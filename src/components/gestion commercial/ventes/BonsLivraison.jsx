import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Select, Pagination } from "react-materialize";
import {
  faHistory,
  faTruck,
  faEye,
  faEdit,
  faTrashAlt,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import Delete_popup from "../../utilities/Delete_popup.jsx";
import { useToasts } from "react-toast-notifications";
import getData from "../../getData.js";

const BonLivraison = (Props) => {
  const { addToast } = useToasts();

  let [BonsLivraison, setBons] = useState([]);
  const { ipcRenderer } = require("electron");
  let [deleteDevis, ShowDelete] = useState(false);
  let [SelectedDevis, SetSelectedDevis] = useState(null);
  let [clients, setClientList] = useState([]);
  let [ReglementsAaficher, setReglementsAaficher] = useState([]);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [SelectedClient, SetSelectedClient] = useState(null);
  let [selectedSociete, setSelectedSociete] = useState(null);
  let [Societes, SetSocieteList] = useState([]);

  useEffect(() => {
    getData(addToast,"BonsLivraison")

    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result);
    });

    ipcRenderer.send("sendMeBonsLivraison");

    ipcRenderer.on("BonsLivraisonSending", (e, result) => {
      setBons(result);
      setReglementsAaficher(result.slice(0, 20));
    });
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setClientList(result);
    });
    ipcRenderer.on("BonsLivraison", (e, result) => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendMeBonsLivraison");
    
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  let delete_devis = () => {
    ipcRenderer.send("SendToTrash", {
      id: SelectedDevis,
      table: "BonsLivraison",
    });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeBonsLivraison");
      ipcRenderer.on("BonsLivraisonSending", (e, result) => {
        setBons(result);
      });
      ShowDelete(false);
    });
  };
  const setFilterData = (e) => {
    if (e.target.name == "client") {
      SetSelectedClient(e.target.value);
    }
    if (e.target.name == "Societe") {
      setSelectedSociete(e.target.value);
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
    let DataArray = [...BonsLivraison];
    if (SelectedClient) {
      if (SelectedClient == "tous") {
        DataArray = [...BonsLivraison];
      } else {
        let mydata = DataArray.filter(
          (v) =>
            JSON.parse(JSON.parse(v.devis).client_id).identifier ==
            SelectedClient
        );
        DataArray = [...mydata];
      }
    }
    if (selectedSociete) {
      if (selectedSociete == "tous") {
        DataArray = [...BonsLivraison];
      } else {
        let mydata = DataArray.filter(
          (v) => JSON.parse(v.societe).identifier == selectedSociete
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
    setReglementsAaficher(DataArray);
  };
  let SetActivePage = (e) => {
    setReglementsAaficher(BonsLivraison.slice((e - 1) * 20, 20 * e));
  };
  return (
    <section className="Devis_section flex_center flex_column">
      {deleteDevis && (
        <Delete_popup
          ShowDelete={ShowDelete}
          delete_devis={delete_devis}
          title={"ce Bon de livraison"}
        />
      )}

      <h1 className="section_title">
        <FontAwesomeIcon icon={faTruck} /> Bons Du Livraisons
      </h1>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faHistory} /> Historique Des Livraisons
          </h1>
        </div>
        <div className="table_filter">
          <div>
            Societé
            <Select onChange={setFilterData} name="Societe">
              <option disabled value="">
                {" "}
                Societé
              </option>
              <option value="tous">Tous</option>
              {Societes.map((c) => (
                <option key={c.id} value={c.identifier}>
                  {c.nom}
                </option>
              ))}
            </Select>
          </div>
          <div>
            Client
            <Select onChange={setFilterData} name="client">
              <option disabled value="">
                {" "}
                Client
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
                <th>N° Bon</th>
                <th>client</th>
                <th>Agent commercial</th>
                <th>Prix Total</th>
                <th>Reglement </th>
                <th>Date </th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {ReglementsAaficher.map((e) => (
                <tr key={e.id}>
                  <td>#{e.id}</td>
                  <td>
                    {JSON.parse(JSON.parse(e.devis).client_id).nom}{" "}
                    {JSON.parse(JSON.parse(e.devis).client_id).prenom}
                  </td>
                  <td>{JSON.parse(e.agent).username}</td>
                  <td>{JSON.parse(e.devis).prix_ttc.toFixed(2)} Da</td>
                  <td>{e.reglement} </td>
                  <td>
                    {JSON.parse(e.date).day}/{JSON.parse(e.date).month}/
                    {JSON.parse(e.date).year}{" "}
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        Props.SetBonId(e.id);
                        Props.pagehandler(14),
                          Props.SetBonLivraison(BonsLivraison);
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
                      <React.Fragment>
                        <Button
                          onClick={() => {
                            ShowDelete(true);
                            SetSelectedDevis(e.id);
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
                        <Button
                          onClick={() => {
                            Props.SetBonId(e.id);
                            Props.pagehandler(41);
                            Props.SetBonLivraison(BonsLivraison);

                          }}
                          style={{
                            marginLeft: "10px",
                            width: "35px",
                            height: "35px",
                            padding: "0",
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
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
              items={parseInt(BonsLivraison.length / 20) + 1}
              leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
              maxButtons={8}
              rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BonLivraison;
