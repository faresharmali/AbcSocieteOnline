import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faCogs,
  faTrashAlt,
  faRecycle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";
import EditAgent from "../utilities/EditAgent.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";

const Devis_Corbeille = (props) => {
  let [Devis, setDevis] = useState([]);
  let [EditPopup, ShowEdit] = useState(false);
  let [DeletePopup, ShowDelete] = useState(false);
  let { ipcRenderer } = require("electron");

  useEffect(() => {
    ipcRenderer.send("SendDeletedData", { table: "Factures" });
    ipcRenderer.on("SendDeletedDataRep", (e, result) => {
      setDevis(result);
    });
    ipcRenderer.on("recupererRep",()=>{
      ipcRenderer.send("SendDeletedData", { table: "Devis" });

    })
  }, []);

  const recuperer=(id)=>{
    ipcRenderer.send("recuperer",{id,table:"Factures"})
  }
  let printPage = (Facture) => {
    var writtenNumber = require('written-number');
    let montantEnLettre=(writtenNumber(JSON.parse(Facture.Devis).prix_ttc, {lang: 'fr'})+" dinars")
    Facture.montantEnLettre=montantEnLettre
    ipcRenderer.send("PrintFacture",{...Facture,logo:props.Logo})
      };
  return (
    <section className="nv_devis">
      {EditPopup && (
        <EditAgent
          showEdit={ShowEdit}
          client={SelectedCommerciaux}
          refresh={refresh}
        />
      )}
      {DeletePopup && (
        <Delete_popup
          delete_devis={Delete}
          ShowDelete={ShowDelete}
          title={"cet agent"}
        />
      )}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faTrashAlt} /> Factures Supprimés
      </h1>
      <div style={{ width: "100%" }} className="clients_table data_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Devis
          </h1>
        </div>
        <div>
          <div className="devis_container flex_center"></div>
          <table id="customers">
            <thead>
              <tr>
                <th>N°</th>
                <th>Client</th>
                <th>Prix TTC </th>
                <th>Mode De Paiment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Devis.map((e) => (
               <tr key={e.id}>
               <td>#{e.id}</td>
               <td>
                 {JSON.parse(JSON.parse(e.Devis).client_id).nom}{" "}
                 {JSON.parse(JSON.parse(e.Devis).client_id).prenom}
               </td>
             
               <td>{JSON.parse(e.Devis).prix_ttc} Da</td>
               <td>{e.Reglement} </td>
               <td data-th="COUNTRY">
                 {JSON.parse(e.date).day}/{JSON.parse(e.date).month}/
                 {JSON.parse(e.date).year}{" "}
               </td>
               <td>
               <Button
                      onClick={() => {
                        recuperer(e.id);
                      }}
                      style={{
                        backgroundColor: "#f8991c",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faRecycle} /> 
                    </Button>{" "}
               <Button
                      onClick={() => {
                        printPage(e);
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

export default Devis_Corbeille;
