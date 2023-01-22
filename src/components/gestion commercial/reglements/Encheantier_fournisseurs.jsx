import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faFileInvoice,
  faEye,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import ReglementConfirmation from "../../utilities/ReglementConfirmation.jsx";
import { useToasts } from "react-toast-notifications";

const Encheantier_fournisseur = () => {
  let { ipcRenderer } = require("electron");
  let [Fournisseurs, setFournisseurs] = useState([]);
  let [ReglementId, setReglementId] = useState(0);
  let [ConfirmationPopup, showConfirmationPopup] = useState(false);
  const checkInternetConnected = require("check-internet-connected");
  const { addToast } = useToasts();
  useEffect(() => {
    ipcRenderer.on("fournisseurs", () => {
      ipcRenderer.send("sendMeFournisseurs");
    });
    let called = false;
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setFournisseurs(result);
    });
  }, []);

  const PayerReglement = (Montant) => {
    console.log("montant is", Montant);
    ipcRenderer.send("PayerFournisseur", { ReglementId, Montant });
    ipcRenderer.on("PayerFournisseurRep", (e, result) => {
      ipcRenderer.send("sendMeFournisseurs");
      ipcRenderer.on("FournisseursSending", (e, result) => {
        setFournisseurs(result);
      });

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
        <FontAwesomeIcon icon={faFileInvoice} /> Echeantier Fournisseurs
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
              {Fournisseurs.map((b) => (
                <tr key={b.id}>
                  <td>
                    {b.Nom} {b.prenom}
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

export default Encheantier_fournisseur;
