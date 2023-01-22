import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import sync from "../sync";

const NewReglement = (props) => {
  const { ipcRenderer } = require("electron");
  let [Montant, setMontant] = useState("");
  let [clientChoisi, setClientChoisi] = useState(null);
  let [ModePayement, SetModePayementChoisi] = useState("");
  const [clients, setClients] = useState([]);
  const { addToast } = useToasts();
  useEffect(() => {
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setClients(result);
    });
    ipcRenderer.on("PayerFournisseurRep", (e, result) => {
      ipcRenderer.send("sendMeFournisseurs");
    });
  }, []);
  let changeDetails = (e) => {
    setMontant(e.target.value);
  };
  let AjouterTaxe = () => {
    if (Montant.trim() != "" && clientChoisi && ModePayement.trim() != "") {
      const obj = {
        montant: Montant,
        Client:clientChoisi,
        reglement: ModePayement,
        paye: 0,
        user: props.user.username,
        type: "fournisseur",
      };
      ipcRenderer.send("AddReglement", obj);
      ipcRenderer.send("PayerFournisseur", {
        ReglementId: clientChoisi.id,
        Montant: Montant,
      });

      props.show(false);
      setTimeout(() => {
        sync(addToast)
        props.refresh();
      }, 450);
    } else {
      alert("tous les champs sont obligatoires");
    }
  };
  const ClientsList = [];
  clients.forEach((c) =>
    ClientsList.push({ value: c, label: c.Nom + " " + c.prenom })
  );
  const Modes = [
    { value: "Especes", label: "Especes" },
    { value: "Cheque", label: "Cheque" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      minHeight: "40px",
      height: "45px",
      marginTop: "5px",
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      marginTop: "5px",
      height: "40px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
    }),
  };
  const setModeDePayement = (e) => {
    SetModePayementChoisi(e.value);
  };
  const setClientChoisiA = (e) => {
    setClientChoisi(e.value);
  };
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faPlusCircle} />{" "}
          Ajouter Un Reglement
        </div>
        <div className="confirmation_form_container">
          <div
            style={{ gridTemplateColumns: "1fr 1fr .5fr" }}
            className="modifyPProduct"
          >
            <Select
              styles={customStyles}
              placeholder="Fournisseur"
              onChange={setClientChoisiA}
              options={ClientsList}
            />
            <Select
              styles={customStyles}
              placeholder="Mode De Payement"
              onChange={setModeDePayement}
              options={Modes}
            />
            <TextInput
              onChange={changeDetails}
              id="montant"
              name="Montant"
              label="Montant"
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
