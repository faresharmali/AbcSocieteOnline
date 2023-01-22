import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCheckDouble,
  faTimesCircle,
  faPlusCircle,
  faStoreAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button, TextInput } from "react-materialize";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const Ajouter_societe = (props) => {
  const { ipcRenderer } = require("electron");
  let [nom, setName] = useState("");
  let [email, setEmail] = useState("");
  let [Num, setNum] = useState("");
  let [Adress, setAdr] = useState("");
  let [NRC, setNRC] = useState("");
  let [ART, setART] = useState("");
  let [NIF, setNIF] = useState("");
  let [Description, setDescription] = useState("");
  let [identifier, setidentifier] = useState("");
  let [password, setpassword] = useState("");
  const { addToast } = useToasts();

  let addUser = () => {
    let inputs = document.querySelectorAll("input");
    let valid = true;
    inputs.forEach((input) => {
      if (input.value.trim() == "") {
        valid = false;
      }
    });
    if (valid) {
      ipcRenderer.send("newSociete", {
        nom,
        email,
        Num,
        Adress,
        NRC,
        ART,
        NIF,
        Description,
        password,
        identifier,
      });
      ipcRenderer.on("addSocieterResult", () => {
        props.pagehandler(2);
      });
      sync(addToast);
    } else {
      alert("tous les champs sont obligatoires");
    }
  };

  let handleNewUser = (e) => {
    e.target.classList.remove("invalid");
    switch (e.target.name) {
      case "nom":
        setName(e.target.value);

        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "Num":
        setNum(e.target.value);
        break;
      case "Adress":
        setAdr(e.target.value);
        break;
      case "Description":
        setDescription(e.target.value);
        break;
      case "NRC":
        setNRC(e.target.value);
        break;
      case "NIF":
        setNIF(e.target.value);
        break;
      case "ART":
        setART(e.target.value);
        break;
      case "id":
        setidentifier(e.target.value);
        break;
      case "mp":
        setpassword(e.target.value);
        break;
    }
  };

  return (
    <section>
      <h2
        style={{ marginBottom: "20px", fontSize: "30px" }}
        className="section_title"
      >
        <FontAwesomeIcon icon={faPlusCircle} /> Ajouter Une Societé
      </h2>
      <div className="add_user_form">
        <div className="adduser_heading flex_center">
          <h1 className="addUserTitle">
            <FontAwesomeIcon icon={faStoreAlt} /> Informations De Societé
          </h1>
        </div>

        <div className="form_container">
          <TextInput
            onChange={handleNewUser}
            type="text"
            label="Identifiant"
            name="id"
            id="id"
            value={identifier}
          />
          <TextInput
            onChange={handleNewUser}
            type="password"
            label="Mot De Passe"
            name="mp"
            id="mp"
            value={password}
          />
          <TextInput
            onChange={handleNewUser}
            type="text"
            label="Nom De Sociétée"
            name="nom"
            id="nom"
            value={nom}
          />
          <TextInput
            onChange={handleNewUser}
            type="text"
            label="Adresse De Sociétée"
            name="Adress"
            id="Adress"
            value={Adress}
          />

          <TextInput
            onChange={handleNewUser}
            type="text"
            label="Numero De Telephone"
            id="Num"
            name="Num"
            value={Num}
          />

          <TextInput
            onChange={handleNewUser}
            type="email"
            label="Email Du Sociétée"
            id="email"
            name="email"
            value={email}
          />
          <TextInput
            onChange={handleNewUser}
            type="text"
            label="Description"
            id="Description"
            name="Description"
          />
          <TextInput
            onChange={handleNewUser}
            type="text"
            label="R.C"
            name="NRC"
            id="NRC"
          />
          <TextInput
            onChange={handleNewUser}
            type="text"
            label="N.I.F"
            name="NIF"
            id="NIF"
          />
          <TextInput
            onChange={handleNewUser}
            type="text"
            label="A.R.T"
            name="ART"
            id="ART"
          />

          <Button
            onClick={addUser}
            style={{
              margin: "0 auto",
              marginTop: "20px",
              backgroundColor: "#dd8d25",
              width: "40%",
            }}
          >
            {" "}
            Ajouter{" "}
          </Button>
        </div>
        <div className="buttons_container flex_center">
          <div className="flex_center alert succes">
            <h4>
              <FontAwesomeIcon icon={faCheckDouble} /> Societé Ajouté Avec
              Succes !
            </h4>
          </div>
          <div className="flex_center alert error">
            <h4>
              <FontAwesomeIcon icon={faTimesCircle} /> Verifier Vos Informations
              !
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ajouter_societe;
