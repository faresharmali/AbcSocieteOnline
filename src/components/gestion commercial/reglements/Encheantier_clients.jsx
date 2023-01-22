import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faFileInvoice,

} from "@fortawesome/free-solid-svg-icons";
import ReglementConfirmation from "../../utilities/ReglementConfirmation.jsx";
import { useToasts } from 'react-toast-notifications'
import getData from "../../getData.js";

const Encheantier_Clients = () => {
  let { ipcRenderer } = require("electron");
  let [clients, setClientList] = useState([]);
  let [ReglementId, setReglementId] = useState(0);
  let [ConfirmationPopup, showConfirmationPopup] = useState(false);
  const { addToast } = useToasts()

  useEffect(() => {

   getData(addToast,"clients")
    ipcRenderer.on("clients", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("windowReady");
    });
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setClientList(result);
    });
  }, []);

  const PayerReglement = (montant) => {
    ipcRenderer.send("PayerReglement", { ReglementId, montant });
    ipcRenderer.on("PayerReglementRep", (e, result) => {
      ipcRenderer.send("windowReady");
      showConfirmationPopup(false);
    });
  };
  return (
    <section className="Devis_section">
      {ConfirmationPopup && (
        <ReglementConfirmation
          PayerReglement={PayerReglement}
          showConfirmationPopup={showConfirmationPopup}
        />
      )}
      <h2 className="section_title">
        <FontAwesomeIcon icon={faFileInvoice} /> Echeantier Clients
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Reglements Non Payés
          </h1>
        </div>

        <div>
          <table id="customers">
            <thead>
              <tr>
                <th>Client</th>
                <th>Adresse</th>
                <th>Numero De Telephone</th>
                <th>Solde</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((b) => (
                <tr key={b.id}>
                  <td>
                    {b.nom} {b.prenom}
                  </td>
                  <td>{b.adresse}</td>
                  <td data-th="COUNTRY">{b.num} </td>
            
                  <td>
                    {b.solde}
                    {" DA"}
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

export default Encheantier_Clients;
