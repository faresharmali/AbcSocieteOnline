import React, { useState } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const AjouterLot = (props) => {
  const { ipcRenderer } = require("electron");
  let [Nom, setNomDepot] = useState("");
  const { addToast } = useToasts();

  let changeDetails = (e) => {
    setNomDepot(e.target.value);
  };
  let AjouterTaxe = () => {
    if (Nom.trim() != "") {
      let obj = {
        nom: Nom,
        societe: "societe",
      };
      ipcRenderer.send("AddDepot", obj);
      sync(addToast);
      props.show(false);
      props.refresh();
    } else {
      alert("tous les champs sont obligatoires");
    }
  };

  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faPlusCircle} />{" "}
          Ajouter Un Depot
        </div>
        <div className="confirmation_form_container">
          <div
            style={{ gridTemplateColumns: "1fr 1fr" }}
            className="modifyPProduct"
          >
            <TextInput
              onChange={changeDetails}
              id="nom"
              name="nom"
              label="Nom De Depot"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.show(false)}>Annuler</Button>
            <Button onClick={AjouterTaxe}>Ajouter</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjouterLot;
