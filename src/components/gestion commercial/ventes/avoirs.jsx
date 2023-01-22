import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Pagination, Select } from "react-materialize";
import Delete_popup from "../../utilities/Delete_popup.jsx";
import { useToasts } from "react-toast-notifications";

import {
  faTrashAlt,
  faEdit,
  faEye,
  faHistory,
  faPlusCircle,
  faFileInvoice,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import getData from "../../getData.js";
const Avoirs = (Props) => {
  let { ipcRenderer } = require("electron");
  let [AvoirsList, SetAvoirList] = useState([]);
  let [AvoirsAaficher, setAvoirsAaficher] = useState([]);
  let [deleteDevis, ShowDelete] = useState(false);
  let [SelectedDevis, SetSelectedDevis] = useState(null);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [SelectedClient, SetSelectedClient] = useState(null);
  let [clients, setClientList] = useState([]);
  const { addToast } = useToasts();

  useEffect(() => {
  getData(addToast,"Avoirs")
  ipcRenderer.on("Avoirs", () => {
    addToast("Données Synchronisées Avec Succes", {
      appearance: "success",
      autoDismiss: true,
      placement: "bottom-left",
    });
    ipcRenderer.send("sendMeAvoirs");
  });
    ipcRenderer.send("sendMeAvoirs");
    ipcRenderer.on("avoirsSending", (e, result) => {
      SetAvoirList(result);
      setAvoirsAaficher(result.slice(0, 20));
    });

   
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setClientList(result);
    });
  }, []);
  let delete_devis = () => {
    ipcRenderer.send("DeleteAvoir", SelectedDevis);
    ipcRenderer.on("DeleteAvoirAnswer", (e, result) => {
      ipcRenderer.send("sendMeAvoirs");
      ipcRenderer.on("avoirsSending", (e, result) => {
        SetAvoirList(result);
      });
      ShowDelete(false);
    });
  };
  let SetActivePage = (e) => {
    setAvoirsAaficher(AvoirsList.slice((e - 1) * 20, 20 * e));
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
    let DataArray = [...AvoirsList];
    if (SelectedClient) {
      let mydata = DataArray.filter(
        (v) => JSON.parse(v.client).identifier == SelectedClient
      );
      DataArray = [...mydata];
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
    setAvoirsAaficher(DataArray);
  };
  return (
    <section className="Devis_section">
      {deleteDevis && (
        <Delete_popup
          ShowDelete={ShowDelete}
          delete_devis={delete_devis}
          title={"cet Avoir"}
        />
      )}

      <h2 className="section_title">
        <FontAwesomeIcon icon={faFileInvoice} /> Bons de retour
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faHistory} /> Historique Des Avoirs
          </h1>
          <h1 onClick={() => Props.pagehandler(17)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Nouveau Bon de retour
          </h1>
        </div>
        <div className="table_filter">
          <div>
            Client
            <Select onChange={setFilterData} name="client">
              <option disabled value="">
                {" "}
                Client
              </option>
              <option value="tous">Tous</option>
              {clients.map((c) => (
                <option key={c.identifier} value={c.identifier}>
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
                <th>Bons de retour</th>
                <th>client </th>
                <th>Agent </th>
                <th>prix ttc </th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {AvoirsAaficher.map((a) => (
                <tr key={a.id}>
                  <td>#{a.id}</td>

                  <td data-th="COUNTRY">
                    {JSON.parse(a.client).nom} {JSON.parse(a.client).prenom}{" "}
                  </td>
                  <td data-th="COUNTRY">{a.agent} </td>
                  <td data-th="COUNTRY">{a.prix_ttc} DA </td>
                  <td>
                    <Button
                      onClick={() => {
                        Props.SetAvoirId(a.id);
                        Props.pagehandler(18);
                      }}
                      style={{
                        backgroundColor: "#f8991c",
                        marginLeft: "10px",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                    {Props.LoggedInUser.role == "Administrateur" && (
                      <Button
                        onClick={() => {
                          ShowDelete(true);
                          SetSelectedDevis(a.id);
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
                      </Button>
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
              items={parseInt(AvoirsList.length / 20) + 1}
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

export default Avoirs;
