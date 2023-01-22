import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Pagination, Select } from "react-materialize";
import Delete_popup from "../../utilities/Delete_popup.jsx";
import { useToasts } from "react-toast-notifications";

import {
  faList,
  faEye,
  faTrashAlt,
  faPlusCircle,
  faFileInvoice,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import getData from "../../getData.js";
const Bon_entre = (Props) => {
  let { ipcRenderer } = require("electron");
  let [bonsEntreList, setBonEntre] = useState([]);
  let [bonsEntreAaficher, setbonsEntreAaficher] = useState([]);
  let [deleteDevis, ShowDelete] = useState(false);
  let [SelectedDevis, SetSelectedDevis] = useState(null);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [SelectedClient, SetSelectedClient] = useState(null);
  let [clients, setClientList] = useState([]);
  const { addToast } = useToasts();


  useEffect(() => {
   getData(addToast,"BonsEntre")
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setClientList(result);
    });
    ipcRenderer.on("BonsEntre", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendMeBonEntre");
    });
    ipcRenderer.send("sendMeBonEntre");
    ipcRenderer.on("BonsEntreSending", (e, result) => {
      setBonEntre(result);
      setbonsEntreAaficher(result.slice(0, 20));
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let delete_devis = () => {
    ipcRenderer.send("SendToTrash", { id: SelectedDevis, table: "bonsentre" });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeBonEntre");

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
          (v) => JSON.parse(v.fournisseur).identifier == SelectedClient
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
          title={"ce Bon d'entre"}
        />
      )}

      <h2 className="section_title">
        <FontAwesomeIcon icon={faFileInvoice} /> Bons D'entrées
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Bons D'entrées
          </h1>
          <h1 onClick={() => Props.pagehandler(24)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Nouveau Bon d'entrée
          </h1>
        </div>
        <div className="table_filter">
          <div>
            Fournisseur
            <Select onChange={setFilterData} name="client">
              <option disabled value="">
                {" "}
                Fournisseur
              </option>
              <option value="tous">Tous</option>
              {clients.map((c) => (
                <option key={c.id} value={c.identifier}>
                  {c.Nom} {c.prenom}
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
                <th>Fournisseur</th>
                <th>Agent</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bonsEntreAaficher.map((b) => (
                <tr key={b.id}>
                  <td style={{ width: "7%" }}>#{b.id}</td>
                  <td>
                    {JSON.parse(b.fournisseur).Nom}{" "}
                    {JSON.parse(b.fournisseur).prenom}
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
                        Props.pagehandler(25);
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
                        {" "}
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
              items={parseInt(bonsEntreList.length / 20) + 1}
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

export default Bon_entre;
