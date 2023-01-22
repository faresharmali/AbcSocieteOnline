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
    ipcRenderer.send("SendDeletedData", { table: "Devis" });
    ipcRenderer.on("SendDeletedDataRep", (e, result) => {
      setDevis(result);
    });
    ipcRenderer.on("recupererRep", () => {
      ipcRenderer.send("SendDeletedData", { table: "Devis" });
    });
  }, []);

  const recuperer = (id) => {
    console.log("fired");
    ipcRenderer.send("recuperer", { id, table: "devis" });
  };
  let printPage = (Devis) => {
    var writtenNumber = require("written-number");
    let montantEnLettre =
      writtenNumber(Devis.prix_ttc, { lang: "fr" }) + " dinars";
   Devis.montantEnLettre = montantEnLettre;
    ipcRenderer.send("PrintPage", {...Devis,logo:props.Logo});
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
        <FontAwesomeIcon icon={faTrashAlt} /> Devis Supprimés
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
                <th>Prix HT </th>
                <th>Prix TTC</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Devis.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{p.id}</td>

                  <td data-th="COUNTRY">
                    {JSON.parse(p.client_id).nom}{" "}
                    {JSON.parse(p.client_id).prenom}{" "}
                  </td>
                  <td data-th="COUNTRY">{p.prix_ht} DA</td>
                  <td data-th="COUNTRY">{p.prix_ttc} DA</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.date).day}/{JSON.parse(p.date).month}/
                    {JSON.parse(p.date).year}{" "}
                  </td>
                  <td data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        recuperer(p.id);
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
                        printPage(p);
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
