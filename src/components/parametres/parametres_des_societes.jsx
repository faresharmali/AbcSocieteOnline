import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faCogs,
  faEye,
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";
import DeletePup from "../utilities/Delete_popup.jsx";

const parametres_societes = (props) => {
  let [societesList, SetSocieteList] = useState([]);
  let [DeletePopup, ShowDeletePopup] = useState(false);
  let [SocieteId, SetSocieteIdDel] = useState(false);
  let { ipcRenderer } = require("electron");
  useEffect(() => {
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result);
    });
  }, []);
  let deleteSociete = () => {
    ipcRenderer.send("DeleteSociete", SocieteId);
    ipcRenderer.on("DeleteSocieteRep", (e, result) => {
      ipcRenderer.send("sendMeSocietes");
      ShowDeletePopup(false);
    });
  };
  return (
    <section className="nv_devis">
      {DeletePopup && (
        <DeletePup
          title={"cette societe"}
          delete_devis={deleteSociete}
          ShowDelete={ShowDeletePopup}
        />
      )}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faCogs} /> Parametres Des Societées
      </h1>
      <div style={{ width: "100%" }} className="clients_table data_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Societées
          </h1>
       
        </div>
        <div>
          <div className="devis_container flex_center"></div>
          <table id="customers">
            <thead>
              <tr>
                <th>Nom De Societé</th>
                <th>Numero Du Telephone</th>
                <th>Adresse</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {societesList.map((c) => (
                <tr key={c.id}>
                  <td data-th="CITY/TOWN/PLACES">{c.nom}</td>
                  <td data-th="VISITING STATUS">{c.num}</td>
                  <td data-th="COUNTRY">{c.adresse}</td>
                  <td data-th="COUNTRY">{c.email}</td>
                  <td data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        props.setSocieteId(c.id);
                        props.pagehandler(7);
                      }}
                      style={{ backgroundColor: "#f8991c" }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
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

export default parametres_societes;
