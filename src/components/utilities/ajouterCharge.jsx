import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const NewReglement = (props) => {
  const { ipcRenderer } = require("electron");
  let [Montant, setMontant] = useState("");
  let [Benificier, setbenificier] = useState("");
  let [Remarque, setRemarque] = useState("");
  const { addToast } = useToasts();

  let changeDetails = (e) => {
    switch (e.target.name) {
      case "Benificier":
        setbenificier(e.target.value);
        break;
      case "Montant":
        setMontant(e.target.value);
        break;
      case "Remarque":
        setRemarque(e.target.value);
        break;
    }
  };
  let AjouterTaxe = () => {
    if (
      Montant.trim() != "" &&
      Remarque.trim() != "" &&
      Benificier.trim() != ""
    ) {
      const obj = {
        Montant,
        Remarque,
        Benificier,
      };
      ipcRenderer.send("addCharge", obj);
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
          Ajouter Des Charges
        </div>
        <div className="confirmation_form_container">
          <div
            style={{ gridTemplateColumns: "1fr 1fr .5fr" }}
            className="modifyPProduct"
          >
            <TextInput
              onChange={changeDetails}
              id="Benificier"
              name="Benificier"
              label="Bénéficier"
            />
            <TextInput
              onChange={changeDetails}
              id="montant"
              name="Montant"
              label="Montant"
            />
            <TextInput
              onChange={changeDetails}
              id="Remarque"
              name="Remarque"
              label="Remarque"
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

export default NewReglement;
