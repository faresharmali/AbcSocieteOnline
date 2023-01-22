import React, { Component } from "react";
import Logo from "../../assets/logo.png";
import { useState, useEffect } from "react";
import { Button } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { machineId, machineIdSync } from "node-machine-id";

const Login = (props) => {
  const { ipcRenderer } = require("electron");
  let [WrongPassword, showPasswordError] = useState(false);
  let [UserNotFound, showUserNotFoundError] = useState(false);
  let [FieldsEmpty, showFieldsEmptyError] = useState(false);
  let [MachineId, SetMachineId] = useState(0);
  let [key, SetKey] = useState("");
  let [newusername, setusername] = useState("");
  let [password, setNewPassword] = useState("");
  let [passwordConfirme, setPasswordConfirme] = useState("");
  let [Identifiant, setIdentifiant] = useState("");
  let [IdentifiantPassword, setIdentifiantPassword] = useState("");
  useEffect(() => {
    let id = machineIdSync();
    ipcRenderer.send("sessionChek");
    ipcRenderer.on("WrongPassword", () => {
      showPasswordError(true);
      setTimeout(() => {
        showPasswordError(false);
      }, 1500);
    });
    ipcRenderer.on("UserNotFound", () => {
      showUserNotFoundError(true);
      setTimeout(() => {
        showUserNotFoundError(false);
      }, 1500);
    });
    ipcRenderer.on("WrongData", () => {
      alert("Username or Password incorrect");
    });
    ipcRenderer.on("LogginSucces", (e, result) => {
      let id = machineIdSync();
      result.MachineId = id;
      ipcRenderer.send("ActiverAbonnement", result);
      ipcRenderer.on("ActiverAbonnementAnswer", (e, results) => {
        alert("Abonnement de " + result.dure + " mois activé avec succes !");
        ipcRenderer.send("addAccountUser", Identifiant);
        props.setPage(0);
      });
    });
    ipcRenderer.on("usedKey", () => {
      alert("Clé Deja Utilisé");
    });
    ipcRenderer.on("wrongKey", () => {
      alert("Clé invalide");
    });
  }, []);

  let [username, setUser] = useState("");
  let [Password, setPassword] = useState("");
  const opentab = () => {
    if (username.trim() != "" && Password.trim() != "") {
      props.handleChange({ username, Password });
    } else {
      showFieldsEmptyError(true);
      setTimeout(() => {
        showFieldsEmptyError(false);
      }, 1500);
    }
  };
  const formHandler = () => {
    let inputs = document.querySelectorAll("input");
    setUser(inputs[0].value);
    setPassword(inputs[1].value);
  };
  const NewUserformHandler = (e) => {
    switch (e.target.name) {
      case "username":
        setusername(e.target.value);
        break;
      case "Password":
        setNewPassword(e.target.value);
        break;
      case "PasswordConfirm":
        setPasswordConfirme(e.target.value);
        break;
    }
  };
  const AddNewUser = () => {
    if (
      newusername.trim() != "" &&
      password.trim() != "" &&
      passwordConfirme.trim() != ""
    ) {
      if (password == passwordConfirme) {
      } else {
        alert("passwords doesn't match");
      }
    } else alert("tous les champs sont obligatoires");
  };
  const CleHandler = (e) => {
    SetKey(e.target.value);
  };

  const ActivateAccount = () => {
    if (Identifiant && IdentifiantPassword && key) {
      let data = {
        user: {
          Username: Identifiant,
          Password: IdentifiantPassword,
        },

        key,
      };
      ipcRenderer.send("CheckKey", data);
    } else {
      alert("tous les champs sont obligatoires");
    }
  };
  const UserDataHandler = (e) => {
    if (e.target.name == "Identifiant") setIdentifiant(e.target.value);
    else setIdentifiantPassword(e.target.value);
  };
  return (
    <section className="login_page flex_center flex_column">
      {props.currentPage == 0 && (
        <React.Fragment>
          <div className="login_form_container flex_center flex_column">
            <img src={Logo} alt="" />

            <input
              onChange={formHandler}
              type="text"
              placeholder="Nom d'utilisateur"
            />
            <input
              type="password"
              placeholder="Mot de Passe"
              onChange={formHandler}
            />
            <div className="login_btns_container">
              <Button style={{ marginRight: "20px" }} onClick={opentab}>
                {" "}
                Connecter{" "}
              </Button>
            </div>
          </div>
          {WrongPassword && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Mot de passe Incorrect !
              </h1>
            </div>
          )}
          {UserNotFound && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Aucun Utilisateur Trouvé !
              </h1>
            </div>
          )}
          {FieldsEmpty && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Veuillez Taper Le Nom d'utilisateur et le mot de passe !
              </h1>
            </div>
          )}
        </React.Fragment>
      )}
      {props.currentPage == 1 && (
        <React.Fragment>
          <div className="login_form_container flex_center flex_column">
            <img src={Logo} alt="" />

            <input
              onChange={NewUserformHandler}
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
            />
            <input
              onChange={NewUserformHandler}
              type="text"
              name="Password"
              placeholder="Mot de Passe"
            />
            <input
              name="PasswordConfirm"
              type="password"
              placeholder="Confirmer Le Mot de Passe"
              onChange={NewUserformHandler}
            />
            <div className="login_btns_container">
              <Button style={{ marginRight: "20px" }} onClick={AddNewUser}>
                {" "}
                Enregistrer{" "}
              </Button>
              <Button
                style={{ marginRight: "20px" }}
                onClick={() => props.setPage(0)}
              >
                {" "}
                Revenir{" "}
              </Button>
            </div>
          </div>
          {WrongPassword && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Mot de passe Incorrect !
              </h1>
            </div>
          )}
          {UserNotFound && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Aucun Utilisateur Trouvé !
              </h1>
            </div>
          )}
          {FieldsEmpty && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Veuillez Taper Le Nom d'utilisateur et le mot de passe !
              </h1>
            </div>
          )}
        </React.Fragment>
      )}
      {props.currentPage == 3 && (
        <React.Fragment>
          <div className="login_form_container flex_center flex_column">
            <img src={Logo} alt="" />

            <input
              onChange={CleHandler}
              type="text"
              placeholder="Clé D'activation"
              name="cle"
            />
            <input
              onChange={UserDataHandler}
              type="text"
              placeholder="Identifiant"
              name="Identifiant"
            />
            <input
              onChange={UserDataHandler}
              type="password"
              placeholder="Mot De Passe"
              name="pass"
            />

            <div className="login_btns_container">
              <Button style={{ marginRight: "20px" }} onClick={ActivateAccount}>
                {" "}
                Activer{" "}
              </Button>
            </div>
          </div>
          {WrongPassword && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Mot de passe Incorrect !
              </h1>
            </div>
          )}
          {UserNotFound && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Aucun Utilisateur Trouvé !
              </h1>
            </div>
          )}
          {FieldsEmpty && (
            <div className="loggin_error flex_center">
              <h1>
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faExclamationCircle}
                />{" "}
                Veuillez Taper Le Nom d'utilisateur et le mot de passe !
              </h1>
            </div>
          )}
        </React.Fragment>
      )}
      {props.currentPage == 2 && <img src={Logo} alt="" />}
    </section>
  );
};

export default Login;
