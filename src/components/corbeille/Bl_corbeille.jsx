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

const Bl_Corbeille = (props) => {
  let [Devis, setDevis] = useState([]);
  let [EditPopup, ShowEdit] = useState(false);
  let [DeletePopup, ShowDelete] = useState(false);
  let { ipcRenderer } = require("electron");

  useEffect(() => {
    ipcRenderer.send("SendDeletedData", { table: "BonsLivraison" });
    ipcRenderer.on("SendDeletedDataRep", (e, result) => {
      setDevis(result);
    });

  }, []);

  const recuperer=(id)=>{
    ipcRenderer.send("recuperer",{id,table:"BonsLivraison"})
  }
  let printPage = (BonLivraison) => {
    var writtenNumber = require("written-number");
    let montantEnLettre =
      writtenNumber(JSON.parse(BonLivraison.devis).prix_ttc, { lang: "fr" }) +
      " dinars";
    BonLivraison.montantEnLettre = montantEnLettre;
    ipcRenderer.send("PrintBonLivraison", {...BonLivraison,logo:props.Logo});
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
        <FontAwesomeIcon icon={faTrashAlt} /> Bons De Livraison Supprimés
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
                 {JSON.parse(JSON.parse(e.devis).client_id).nom}{" "}
                 {JSON.parse(JSON.parse(e.devis).client_id).prenom}
               </td>
               <td>{JSON.parse(e.devis).prix_ttc} Da</td>
               <td>{e.reglement} </td>
               <td>
                 {JSON.parse(e.date).day}/{JSON.parse(e.date).month}/
                 {JSON.parse(e.date).year}{" "}
               </td>
               <td>
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

export default Bl_Corbeille;
