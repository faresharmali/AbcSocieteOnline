import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faEdit } from "@fortawesome/free-solid-svg-icons";

const EditProfile = (props) => {
  const { ipcRenderer } = require("electron");

  const Updateinfos = () => {
    if (
      Client.nom.trim() != "" &&
      Client.prenom.trim() != "" &&
      Client.username.trim() != "" &&
      Client.password.trim() != ""
    ) {
      ipcRenderer.send("UpdateAgentInfo", Client);
      ipcRenderer.send("UpdateSessionUser", JSON.stringify(Client));
      props.ShowEdit(false);
      props.refreshLoggedInUser(Client);
    } else alert("tous les champs sont obligatoires");
  };
  let [Client, SetClient] = useState(props.User);
  let changeDetails = (e) => {
    switch (e.target.name) {
      case "Nom":
        SetClient({ ...Client, nom: e.target.value });
        break;
      case "Prenom":
        SetClient({ ...Client, prenom: e.target.value });
        break;
      case "username":
        SetClient({ ...Client, username: e.target.value });
        break;
      case "pass":
        SetClient({ ...Client, password: e.target.value });
        break;
    }
  };

  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faEdit} />{" "}
          Modifier{" "}
        </div>
        <div className="confirmation_form_container">
          <div className="modifyPProduct">
            <TextInput
              onChange={changeDetails}
              value={Client.nom}
              id="Nom"
              name="Nom"
              label=" Nom "
            />
            <TextInput
              onChange={changeDetails}
              value={Client.prenom}
              id="Prenom"
              name="Prenom"
              label="Prenom"
            />
            <TextInput
              onChange={changeDetails}
              value={Client.username}
              id="Numero"
              name="username"
              label="Nom D'utilisateur"
            />
            <TextInput
              type="password"
              onChange={changeDetails}
              value={Client.password}
              id="Adresse"
              name="pass"
              label="Mot de passe"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.ShowEdit(false)}>Annuler</Button>
            <Button onClick={() => Updateinfos()}>Modifier</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
