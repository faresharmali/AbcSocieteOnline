import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faEdit } from "@fortawesome/free-solid-svg-icons";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const EditClient = (props) => {
  const { addToast } = useToasts();

  useEffect(() => {
    ipcRenderer.on("UpdateFournisseurRep", (e, result) => {
      sync(addToast);
      props.showEdit(false);
      props.refresh();
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  const { ipcRenderer } = require("electron");
  let [Client, SetClient] = useState(props.Fournisseur);
  let changeDetails = (e) => {
    switch (e.target.name) {
      case "Nom":
        SetClient({ ...Client, Nom: e.target.value });
        break;
      case "Adresse":
        SetClient({ ...Client, adresse: e.target.value });
        break;
      case "Numero":
        SetClient({ ...Client, num: e.target.value });
        break;
      case "Email":
        SetClient({ ...Client, email: e.target.value });
        break;
      case "Description":
        SetClient({ ...Client, description: e.target.value });
        break;
      case "N.I.S":
        SetClient({ ...Client, NIS: e.target.value });
        break;
      case "N.R.C":
        SetClient({ ...Client, RC: e.target.value });
        break;
      case "N.I.F":
        SetClient({ ...Client, NIF: e.target.value });
        break;
      case "ART":
        SetClient({ ...Client, ART: e.target.value });
        break;
    }
  };
  let Updatesociete = () => {
    ipcRenderer.send("UpdateFournisseur", Client);
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
              value={Client.Nom}
              id="Nom"
              name="Nom"
              label=" Nom "
            />
            <TextInput
              onChange={changeDetails}
              value={Client.num}
              id="Numero"
              name="Numero"
              label="Numero De Telephone"
            />
            <TextInput
              onChange={changeDetails}
              value={Client.adresse}
              id="Adresse"
              name="Adresse"
              label="Adresse"
            />
            <TextInput
              onChange={changeDetails}
              value={Client.NIS}
              id="N.I.S"
              name="N.I.S"
              label="N.I.S"
            />
            <TextInput
              onChange={changeDetails}
              value={Client.RC}
              id="N.R.C"
              name="N.R.C"
              label="N.R.C"
            />
            <TextInput
              onChange={changeDetails}
              value={Client.NIF}
              id="N.I.F"
              name="N.I.F"
              label="N.I.F"
            />
            <TextInput
              onChange={changeDetails}
              value={Client.ART}
              id="ART"
              name="ART"
              label="ART"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.showEdit(false)}>Annuler</Button>
            <Button onClick={Updatesociete}>Modifier</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClient;
