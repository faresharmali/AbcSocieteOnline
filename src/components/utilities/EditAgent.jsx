import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faEdit } from "@fortawesome/free-solid-svg-icons";

const EditAgent = (props) => {
  const { ipcRenderer } = require("electron");
  const Updateinfos = () => {
    ipcRenderer.send("UpdateAgentInfo", Client);
    ipcRenderer.on("UpdateAgentInfoRep", (e, result) => {
      props.refresh();
      props.showEdit(false);
    });
  };
  let [Client, SetClient] = useState(props.client);
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
            <Button onClick={() => props.showEdit(false)}>Annuler</Button>
            <Button onClick={() => Updateinfos()}>Modifier</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAgent;
