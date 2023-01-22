import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const NewAgent = (props) => {
  const { ipcRenderer } = require("electron");
  let [Nom, setNom] = useState("");
  let [Prenom, setbPrenom] = useState("");
  let [Mobile, setMobile] = useState("");
  const { addToast } = useToasts();

  let changeDetails = (e) => {
    switch (e.target.name) {
      case "Nom":
        setNom(e.target.value);
        break;
      case "Prenom":
        setbPrenom(e.target.value);
        break;
      case "Numero":
        setMobile(e.target.value);
        break;
    }
  };
  let AjouterTaxe = () => {
    if (Mobile.trim() != "" && Prenom.trim() != "" && Nom.trim() != "") {
      const obj = {
        Mobile,
        Prenom,
        Nom,
      };
      ipcRenderer.send("NewAgent", obj);
      props.show(false);
      props.refresh();
      sync(addToast);
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
          Ajouter Un Agent Commerciale
        </div>
        <div className="confirmation_form_container">
          <div
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
            className="modifyPProduct"
          >
            <TextInput
              onChange={changeDetails}
              id="Nom"
              name="Nom"
              label="Nom"
            />
            <TextInput
              onChange={changeDetails}
              id="Prenom"
              name="Prenom"
              label="Prenom"
            />
            <TextInput
              onChange={changeDetails}
              id="Numero"
              name="Numero"
              label="Mobile"
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

export default NewAgent;
