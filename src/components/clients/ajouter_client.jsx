import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCheckDouble,
  faTimesCircle,
  faMapMarkerAlt,
  faPhoneSquareAlt,
  faUserTie,
  faBuilding,
  faFileInvoice,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Button, TextInput } from "react-materialize";
import { useToasts } from "react-toast-notifications";
import sync from "../sync";

const Ajouter_client = (props) => {
  const { addToast } = useToasts();
  const { ipcRenderer } = require("electron");
  let [nom, setName] = useState("");
  let [Prenom, setPname] = useState("");
  let [Num, setNum] = useState("");
  let [Adress, setAdr] = useState("");
  let [Type, setType] = useState("");
  let [Nis, setNis] = useState("");
  let [Nif, setNif] = useState("");
  let [NRC, setNRC] = useState("");
  let [ART, setART] = useState("");
  let [Societe, setSociete] = useState(1);

  let addUser = () => {
    if (
      nom.trim() != "" &&
      Num.trim() != "" &&
      Adress.trim() != "" &&
      Type.trim() != ""
    ) {
      ipcRenderer.send("newUser", {
        nom,
        Prenom,
        Num,
        Adress,
        Type,
        Nis,
        Nif,
        NRC,
        ART,
      });

      props.refreshClient();
      props.setPage(1);
      sync(addToast);
    } else {
      alert("les champs * sont obligatoires");
    }
  };
  let showSucces = () => {
    document.querySelector(".succes").style.display = "inline-block";
    setTimeout(() => {
      document.querySelector(".succes").style.display = "none";
    }, 1500);
  };
  let showError = () => {
    document.querySelector(".error").style.display = "inline-block";
    setTimeout(() => {
      document.querySelector(".error").style.display = "none";
    }, 1500);
  };
  let handleNewUser = (e) => {
    e.target.classList.remove("invalid");
    console.log(e.target.name);
    switch (e.target.name) {
      case "nom":
        setName(e.target.value);
        break;
      case "Prenom":
        setPname(e.target.value);
        break;
      case "Num":
        setNum(e.target.value);
        break;
      case "Adress":
        setAdr(e.target.value);
        break;
      case "NRC":
        setNRC(e.target.value);
        break;
      case "NIS":
        setNis(e.target.value);
        break;
      case "NIF":
        setNif(e.target.value);
        break;
      case "ART":
        setART(e.target.value);
        break;
    }
  };
  let changedType = (e) => {
    setType(e.target.value);
    e.target.value === "Societe" ? setSociete(1) : setSociete(2);
  };
  return (
    <div className="add_user_form">
      <div className="adduser_heading flex_center">
        <h1 className="addUserTitle">
          <FontAwesomeIcon icon={faUserPlus} /> Ajouter Un Client
        </h1>
      </div>

      <div className="form_container2">
        <div className="client_type">
          Type de Client
          <input
            onChange={changedType}
            id="radioBtn2"
            className="ClientTypeRadio"
            type="radio"
            name="clienttype"
            value="Particulier"
          />
          <label htmlFor="radioBtn2">Particulier</label>
          <input
            onChange={changedType}
            id="radioBtn3"
            className="ClientTypeRadio"
            type="radio"
            name="clienttype"
            value="Societe"
          />
          <label htmlFor="radioBtn3">Societe</label>
        </div>
        {Societe == 2 && (
          <section className="client_particulier">
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="Nom"
              name="nom"
              id="nom"
              value={nom}
              icon={<FontAwesomeIcon icon={faUserTie} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="Prenom"
              name="Prenom"
              id="Prenom"
              value={Prenom}
              icon={<FontAwesomeIcon icon={faUserTie} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="Numero De Telephone"
              name="Num"
              id="Num"
              value={Num}
              icon={<FontAwesomeIcon icon={faPhoneSquareAlt} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="Adresse"
              name="Adress"
              id="Adress"
              value={Adress}
              icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
            />
          </section>
        )}
        {Societe == 1 && (
          <section className="client_particulier">
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="Nom De Societé*"
              name="nom"
              id="NomSociete"
              value={nom}
              icon={<FontAwesomeIcon icon={faBuilding} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="Numero De Telephone*"
              name="Num"
              id="Num"
              value={Num}
              icon={<FontAwesomeIcon icon={faPhoneSquareAlt} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="Adresse*"
              name="Adress"
              id="Adress"
              value={Adress}
              icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="N.R.C"
              name="NRC"
              id="NRc"
              value={NRC}
              icon={<FontAwesomeIcon icon={faFileInvoice} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="N.I.F"
              name="NIF"
              id="NIF"
              value={Nif}
              icon={<FontAwesomeIcon icon={faFileInvoice} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="N.I.S"
              name="NIS"
              id="NIS"
              value={Nis}
              icon={<FontAwesomeIcon icon={faFileInvoice} />}
            />
            <TextInput
              onChange={handleNewUser}
              type="text"
              label="A.R.T"
              name="ART"
              id="ART"
              value={ART}
              icon={<FontAwesomeIcon icon={faFileInvoice} />}
            />
          </section>
        )}
      </div>

      <div className="buttons_container flex_center">
        <div className="flex_center alert succes">
          <h4>
            <FontAwesomeIcon icon={faCheckDouble} /> Client Ajouté Avec Succes !
          </h4>
        </div>
        <div className="flex_center alert error">
          <h4>
            <FontAwesomeIcon icon={faTimesCircle} /> Verifier Vos Informations !
          </h4>
        </div>
        <Button style={{ margin: "20px" }} onClick={addUser}>
          <FontAwesomeIcon icon={faPlusCircle} /> AJOUTER
        </Button>
      </div>
    </div>
  );
};

export default Ajouter_client;
