import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";
import sync from "../sync";

const EditCategory = (props) => {
  const { ipcRenderer } = require("electron");
  const { addToast } = useToasts();
  let [category, setname] = useState(props.category);
  let changeDetails = (e) => {
    setname({ ...category, nom: e.target.value });
  };
  useEffect(() => {
    ipcRenderer.on("UpdateCategoryAnswer", (e, result) => {
      props.showAEditPopup(false);
      props.refresher();
      sync(addToast);
    });
  }, []);
  let UpdateCategory = () => {
    ipcRenderer.send("UpdateCategory", category);
  };
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faEdit} />{" "}
          Modifier Une Categorie
        </div>
        <div className="confirmation_form_container">
          <div className="modifyPProduct">
            <TextInput
              onChange={changeDetails}
              value={category.nom}
              id="Nom"
              name="Nom"
              label=" Nom Du Category"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.showAEditPopup(false)}>Annuler</Button>
            <Button onClick={UpdateCategory}>Modifier</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
