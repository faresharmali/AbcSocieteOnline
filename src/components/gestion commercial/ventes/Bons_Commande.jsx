import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Select } from "react-materialize";
import {
  faList,
  faEdit,
  faEye,
  faTrashAlt,
  faPlusCircle,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import DeletePopup from "../../utilities/Delete_popup.jsx";
import getData from "../../getData.js";
import { useToasts } from "react-toast-notifications";

const Bons_commande = (Props) => {
  const { addToast } = useToasts();

  let { ipcRenderer } = require("electron");
  let [bonsEntreList, setBonEntre] = useState([]);
  let [bonsEntreAaficher, setbonsEntreAaficher] = useState([]);

  let [selectedBon, setSelectedBon] = useState(0);
  let [DP, ShowPopup] = useState(false);
  let [clients, setClientList] = useState([]);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [SelectedClient, SetSelectedClient] = useState(null);

  useEffect(() => {
    getData(addToast,"Bons_commande")
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setClientList(result);
    });
    ipcRenderer.send("sendMeBonCommande");
    ipcRenderer.on("BonCommandeSending", (e, result) => {
      setBonEntre(result);
      setbonsEntreAaficher(result);
    });

    ipcRenderer.on("Bons_commande", () => {
      ipcRenderer.send("sendMeBonCommande");
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  const deleteBon = () => {
    ipcRenderer.send("SendToTrash", {
      id: selectedBon,
      table: "bons_commande",
    });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeBonCommande");

      ShowPopup(false);
    });
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
          (v) => JSON.parse(v.Fournisseur).identifier == SelectedClient
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
      {DP && (
        <DeletePopup
          ShowDelete={ShowPopup}
          delete_devis={deleteBon}
          title="ce bon de Commande"
        />
      )}
      <h2 className="section_title">
        <FontAwesomeIcon icon={faFileInvoice} /> Bons De Commande
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Bons De Commande
          </h1>
          <h1 onClick={() => Props.pagehandler(28)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Nouveau Bons De Commande
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
                  <td>{JSON.parse(b.Fournisseur).Nom}</td>
                  <td>{b.agent}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(b.date).day}/{JSON.parse(b.date).month}/
                    {JSON.parse(b.date).year}{" "}
                  </td>
                  <td style={{ width: "16%" }} data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        Props.SetBonCId(b.id);
                        Props.pagehandler(36);
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
                      <Button
                        onClick={() => {
                          setSelectedBon(b.id);
                          ShowPopup(true);
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
        </div>
      </div>
    </section>
  );
};

export default Bons_commande;
