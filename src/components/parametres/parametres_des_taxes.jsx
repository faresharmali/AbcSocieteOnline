import React, { Component, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faCogs,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";
import NewTaxe from "../utilities/newTax.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";
import EditTaxe from "../utilities/EditTaxe.jsx";
const parametres_taxes = () => {
  const checkInternetConnected = require("check-internet-connected");

  const { ipcRenderer } = require("electron");
  let [showTaxePopup, ShowTaxe] = useState(false);
  let [ShowDeletePopup, ShowDelete] = useState(false);
  let [ShowEditPopup, ShowEdit] = useState(false);
  let [Taxes, SetTaxes] = useState([]);
  let [TaxeID, SetTaxeID] = useState(0);
  let [taxe, setTaxe] = useState({});
  useEffect(() => {
    ipcRenderer.send("sendTaxes");
    ipcRenderer.on("taxesSending", (e, result) => {
      SetTaxes(result);
    });
    ipcRenderer.on("refreshRequest", () => {
      ipcRenderer.send("sendTaxes");
    });
  }, []);

  const Refresh = () => {
    ipcRenderer.send("sendTaxes");
    ipcRenderer.on("taxesSending", (e, result) => {
      SetTaxes(result);
    });
  };
  const delete_taxe = () => {
    console.log(TaxeID);
    ipcRenderer.send("deleteTaxe", TaxeID);
    ipcRenderer.on("deleteTaxeAnswer", (e, result) => {
      Refresh();
      ShowDelete(false);
    });
  };
  return (
    <section className="nv_devis">
      {showTaxePopup && <NewTaxe ShowTaxe={ShowTaxe} Refresh={Refresh} />}
      {ShowDeletePopup && (
        <Delete_popup
          ShowDelete={ShowDelete}
          delete_devis={delete_taxe}
          title={"cette taxe"}
        />
      )}
      {ShowEditPopup && (
        <EditTaxe ShowEdit={ShowEdit} taxe={taxe} Refresh={Refresh} />
      )}

      <h1 className="section_title">
        <FontAwesomeIcon icon={faCogs} /> Parametres Des Taxes
      </h1>
      <div style={{ width: "100%" }} className="clients_table data_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Taxes
          </h1>
          <h1 onClick={() => ShowTaxe(true)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Ajouter Une Taxe
          </h1>
        </div>
        <div>
          <div className="devis_container flex_center"></div>
          <table id="customers">
            <thead>
              <tr>
                <th>Nom Du Taxe</th>
                <th>Pourcentage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Taxes.map((t) => (
                <tr key={t.id}>
                  <td>{t.nom}</td>
                  <td>{t.pourcentage}%</td>
                  <td style={{ width: "16%" }} data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        ShowEdit(true);
                        setTaxe(t);
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
                    <Button
                      onClick={() => {
                        SetTaxeID(t.id);
                        ShowDelete(true);
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

export default parametres_taxes;
