import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCheckDouble,
  faTimesCircle,
  faPlusCircle,
  faIdBadge,
  faMapMarkerAlt,
  faPhoneSquareAlt,
  faUnlockAlt,
  faUserTie,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Select, Button, TextInput, Icon } from "react-materialize";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const Ajouter_commerciaux = (Props) => {
  const { addToast } = useToasts();

  const { ipcRenderer } = require("electron");
  let [nom, setName] = useState("");
  let [Prenom, sePrenom] = useState("");
  let [Num, setNum] = useState("");
  let [Adress, setAdr] = useState("");
  let [role, setRole] = useState("");
  let [UserName, setUserName] = useState("");
  let [Password, setPassword] = useState("");
  useEffect(() => {
    ipcRenderer.on("addcommerciauxResult", () => {
      sync(addToast);
      Props.pagehandler(3);
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let addUser = () => {
    let inputs = document.querySelectorAll("input");
    let valid = true;
    inputs.forEach((input) => {
      if (input.value.trim() == "") {
        input.classList.add("invalid");
        valid = false;
      }
    });
    if (valid) {
      ipcRenderer.send("newCommercieaux", {
        nom,
        Prenom,
        Num,
        Adress,
        role,
        UserName,
        Password,
      });
    } else {
      showError();
    }
  };

  let showError = () => {
    document.querySelector(".error").style.display = "inline-block";
    setTimeout(() => {
      document.querySelector(".error").style.display = "none";
    }, 1500);
  };
  let handleNewUser = (e) => {
    e.target.classList.remove("invalid");
    switch (e.target.name) {
      case "Nom":
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
      case "Prenom":
        sePrenom(e.target.value);
        break;
      case "username":
        setUserName(e.target.value);
        break;
      case "role":
        setRole(e.target.value);
        break;
      case "motdepasse":
        setPassword(e.target.value);
        break;
    }
  };
  return (
    <section>
      <div
        style={{ width: "70%", borderRadius: "10px" }}
        className="add_user_form"
      >
        <div className="adduser_heading flex_center">
          <h1 className="addUserTitle">
            <FontAwesomeIcon icon={faUserPlus} /> Ajouter Un Utilisateur
          </h1>
        </div>
        <div className="form_container">
          <TextInput
            onChange={handleNewUser}
            icon={<FontAwesomeIcon icon={faUserTie} />}
            type="text"
            label="Nom"
            name="Nom"
            id="nom"
          />
          <TextInput
            onChange={handleNewUser}
            icon={<FontAwesomeIcon icon={faUserTie} />}
            type="text"
            label="Prenom"
            name="Prenom"
            id="prenom"
          />
          <TextInput
            onChange={handleNewUser}
            icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
            type="text"
            label="Adresse"
            name="Adress"
            id="adrresse"
          />
          <TextInput
            onChange={handleNewUser}
            icon={<FontAwesomeIcon icon={faPhoneSquareAlt} />}
            type="text"
            label="Numero De Telephone"
            name="Num"
          />

          <TextInput
            onChange={handleNewUser}
            icon={<FontAwesomeIcon icon={faIdBadge} />}
            type="text"
            label="Nom D'utilisateur"
            name="username"
            id="username"
          />
          <TextInput
            onChange={handleNewUser}
            icon={<FontAwesomeIcon icon={faUnlockAlt} />}
            type="password"
            label="Mot De Passe"
            name="motdepasse"
            id="mp"
          />
          <Select onChange={handleNewUser} value="" name="role">
            <option disabled value="">
              {" "}
              Role
            </option>
            <option value="Administrateur"> Administrateur</option>
            <option value="Agent Commercial"> Agent Commercial</option>
          </Select>
          <div></div>
          <div className="add_btn_container flex_center">
            <Button onClick={() => Props.pagehandler(3)} className="backBtn2">
              <FontAwesomeIcon
                style={{ height: "40px !important", marginRight: "10px" }}
                icon={faArrowLeft}
              />
              Revenir
            </Button>
            <Button onClick={addUser}>
              <FontAwesomeIcon icon={faPlusCircle} /> Ajouter
            </Button>
          </div>
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

export default Ajouter_commerciaux;
