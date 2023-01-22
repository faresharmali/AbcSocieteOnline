import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Pagination, Select } from "react-materialize";
import Delete_popup from "../../utilities/Delete_popup.jsx";
import {
  faList,
  faChevronCircleLeft,
  faChevronCircleRight,
  faEye,
  faTrashAlt,
  faPlusCircle,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";
import getData from "../../getData.js";

const Bon_sortie = (Props) => {
  let { ipcRenderer } = require("electron");
  let [bonsEntreList, setBonEntre] = useState([]);
  let [deleteDevis, ShowDelete] = useState(false);
  let [SelectedDevis, SetSelectedDevis] = useState(null);
  let [bonsEntreAaficher, setbonsEntreAaficher] = useState([]);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [SelectedClient, SetSelectedClient] = useState(null);
  let [clients, setclients] = useState([]);
  const { addToast } = useToasts();
  useEffect(() => {
    getData(addToast, "BonSortie");
    ipcRenderer.on("BonSortie", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendMeBonSortie3");
    });
    ipcRenderer.send("GiveMeClients");
    ipcRenderer.on("ClientsBack", (e, result) => {
      setclients(result);
    });

    ipcRenderer.send("sendMeBonSortie3");
    ipcRenderer.on("BonSortieSending3", (e, result) => {
      setBonEntre(result);
      setbonsEntreAaficher(result.slice(0, 20));
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let delete_devis = () => {
    ipcRenderer.send("SendToTrash", { id: SelectedDevis, table: "bonsortie" });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeBonSortie3");

      ShowDelete(false);
    });
  };
  let SetActivePage = (e) => {
    setbonsEntreAaficher(bonsEntreList.slice((e - 1) * 20, 20 * e));
  };
  const setFilterData = (e) => {
    if (e.target.name == "client") {
      SetSelectedClient(e.target.value);
    }
    if (e.target.name == "minDate") {
      let date = {
        year: e.target.value.slice(0, 4),
        month: e.target.value.slice(5, 7),
        day: e.target.value.slice(8, 10),
      };
      SetMinDate(date);
    }
    if (e.target.name == "maxDate") {
      let date2 = {
        year: e.target.value.slice(0, 4),
        month: e.target.value.slice(5, 7),
        day: e.target.value.slice(8, 10),
      };
      SetMaxDate(date2);
    }
  };
  const filterTable = () => {
    let DataArray = [...bonsEntreList];
    if (SelectedClient) {
      if (SelectedClient == "tous") {
        DataArray = [...bonsEntreList];
      } else {
        let mydata = DataArray.filter(
          (v) => JSON.parse(v.client).identifier == SelectedClient
        );
        DataArray = [...mydata];
      }
    }
    if (MinDate) {
      let array = [];
      DataArray.forEach((v) => {
        if (JSON.parse(v.date).year > parseInt(MinDate.year)) {
          array.push(v);
        } else if (JSON.parse(v.date).year == parseInt(MinDate.year)) {
          if (JSON.parse(v.date).month > parseInt(MinDate.month)) {
            array.push(v);
          } else if (JSON.parse(v.date).month == parseInt(MinDate.month)) {
            if (JSON.parse(v.date).day >= parseInt(MinDate.day)) {
              array.push(v);
            }
          }
        }
      });
      DataArray = [...array];
    }
    if (MaxDate) {
      let array2 = [];
      DataArray.forEach((v) => {
        if (JSON.parse(v.date).year <= parseInt(MaxDate.year)) {
          if (JSON.parse(v.date).month < parseInt(MaxDate.month)) {
            array2.push(v);
          } else if (JSON.parse(v.date).month == parseInt(MaxDate.month)) {
            if (JSON.parse(v.date).day <= parseInt(MaxDate.day)) {
              array2.push(v);
            }
          }
        }
      });
      DataArray = [...array2];
    }
    setbonsEntreAaficher(DataArray);
  };
  return (
    <section className="Devis_section">
      {deleteDevis && (
        <Delete_popup
          ShowDelete={ShowDelete}
          delete_devis={delete_devis}
          title={"ce Bon de sortie"}
        />
      )}

      <h2 className="section_title">
        <FontAwesomeIcon icon={faFileInvoice} /> Bons De Sortie
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Bons De Sortie
          </h1>
          <h1 onClick={() => Props.pagehandler(26)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Nouveau Bon de sortie
          </h1>
        </div>
        <div className="table_filter">
          <div>
            Client
            <Select onChange={setFilterData} name="client">
              <option disabled value="">
                {" "}
                Fournisseur
              </option>
              <option value="tous">Tous</option>
              {clients.map((c) => (
                <option key={c.id} value={c.identifier}>
                  {c.nom} {c.prenom}
                </option>
              ))}
            </Select>
          </div>
          <div>
            De:
            <input
              style={{
                boxSizing: "border-box !important",
                margin: "0 !important",
              }}
              onChange={setFilterData}
              type="date"
              name="minDate"
            />
          </div>
          <div>
            a:
            <input onChange={setFilterData} type="date" name="maxDate" />
          </div>
          <Button onClick={filterTable}>filtrer</Button>
        </div>
        <div>
          <table id="customers">
            <thead>
              <tr>
                <th>N° </th>
                <th>Client</th>
                <th>Agent Commerciale</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bonsEntreAaficher.map((b) => (
                <tr key={b.id}>
                  <td style={{ width: "7%" }}>#{b.id}</td>
                  <td>
                    {JSON.parse(b.client).nom} {JSON.parse(b.client).prenom}
                  </td>
                  <td>{b.agent}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(b.date).day}/{JSON.parse(b.date).month}/
                    {JSON.parse(b.date).year}{" "}
                  </td>
                  <td style={{ width: "16%" }} data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        Props.SetBonEntreId(b.id);
                        Props.pagehandler(33);
                      }}
                      style={{
                        backgroundColor: "#f8991c",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                    {Props.LoggedInUser.role == "Administrateur" && (
                      <React.Fragment>
                        <Button
                          onClick={() => {
                            ShowDelete(true);
                            SetSelectedDevis(b.id);
                          }}
                          style={{
                            backgroundColor: "rgb(207, 31, 31)",
                            marginLeft: "10px",
                            width: "35px",
                            height: "35px",
                            padding: "0",
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>{" "}
                      </React.Fragment>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }} className="flex_center">
            <Pagination
              onSelect={SetActivePage}
              activePage={1}
              items={parseInt(bonsEntreList.length) / 20 + 1}
              leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
              maxButtons={4}
              rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bon_sortie;
