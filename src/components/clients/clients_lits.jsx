import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUsers,
  faEye,
  faPlusCircle,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";
import { useToasts } from "react-toast-notifications";
import getData from "../getData";

const Clients_List = (Props) => {
  let [clients, setClients] = useState([]);
  const { addToast } = useToasts();

  let { ipcRenderer } = require("electron");

  useEffect(() => {
    getData(addToast, "clients");
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setClients(result);
    });
    ipcRenderer.on("clients", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("windowReady");
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  const printData = () => {
    ipcRenderer.send("printClients", { Data: clients, logo: Props.logo });
  };
  return (
    <section className="clients">
      <h2 className="section_title">
        <FontAwesomeIcon icon={faUsers} /> Clients
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Clients
          </h1>
          <div className="flex_center">
            <h1
              style={{ color: "#fff", fontSize: "17px" }}
              onClick={() => Props.setPage(2)}
              className="new_devis"
            >
              <FontAwesomeIcon icon={faPlusCircle} /> Nouveau Client
            </h1>
            <Button
              onClick={printData}
              style={{
                backgroundColor: "#f8991c",
                marginBottom: "15px",
                marginLeft: "10px",
              }}
            >
              <FontAwesomeIcon icon={faPrint} />
              Imprimer
            </Button>{" "}
          </div>
        </div>
        <div>
          <table id="customers">
            <thead>
              <tr>
                <th>Nom / Prenom</th>
                <th>N° de Telephone</th>
                <th>Adresse</th>
                <th>N Achats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td data-th="CITY/TOWN/PLACES">
                    {c.nom} {c.prenom}
                  </td>
                  <td data-th="VISITING STATUS">{c.num}</td>
                  <td data-th="COUNTRY">{c.adresse}</td>
                  <td data-th="COUNTRY">{c.adresse}</td>
                  <td style={{ width: "16%" }} data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        Props.setClientId(c.id);
                        Props.setPage(3);
                      }}
                      style={{
                        backgroundColor: "#f8991c",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>{" "}
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

export default Clients_List;
