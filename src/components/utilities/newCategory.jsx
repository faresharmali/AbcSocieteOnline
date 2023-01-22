import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";
import sync from "../sync";

const NewCategory = (props) => {
  const { addToast } = useToasts();
  const { ipcRenderer } = require("electron");
  let [CategoryName, setNom] = useState("");
  console.log(props.CategoryNames);
  let changeDetails = (e) => {
    setNom(e.target.value);
  };
  let AddCategory = (e) => {
    if (CategoryName.trim() != "") {
      if (!props.CategoryNames.includes(CategoryName.toUpperCase().trim())) {
        ipcRenderer.send("AddCategory", CategoryName);
        ipcRenderer.on("AddCategoryAnswer", (e, result) => {
          props.showAddPopup(false);
          props.refresher();
          props.showSucces();
        });
        sync(addToast);
      } else {
        alert("Categorie Exist Deja ");
      }
    } else {
      alert("Tous Les Champs Sont Obligatoires");
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
          Ajouter Une Categorie
        </div>
        <div className="confirmation_form_container">
          <div className="modifyPProduct">
            <TextInput
              onChange={changeDetails}
              id="Nom"
              name="Nom"
              label=" Nom Du Categorie"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.showAddPopup(false)}>Annuler</Button>
            <Button onClick={AddCategory}>Ajouter</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
