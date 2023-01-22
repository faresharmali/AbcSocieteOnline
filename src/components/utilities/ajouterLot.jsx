import React, { useEffect, useState } from "react";
import { Button, TextInput, DatePicker } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const AjouterLot = (props) => {
  const { ipcRenderer } = require("electron");
  let [Montant, setMontant] = useState("");
  let [clientChoisi, setClientChoisi] = useState(null);
  let [ChosenDepot, setChosenDepot] = useState(null);
  let [DP, setDateP] = useState({
    day: 1,
    month: 1,
    year: new Date().getFullYear(),
  });
  let [DF, setDateF] = useState({
    day: 1,
    month: 1,
    year: new Date().getFullYear(),
  });
  const { addToast } = useToasts();

  const [Depots, setDepots] = useState([]);
  const setDatePre = (e) => {
    let Ndate = new Date(e.target.value);
    let MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    if (e.target.name == "DF") setDateF(MyDate);
    else setDateP(MyDate);
  };

  useEffect(() => {
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
    });
  }, []);
  let changeDetails = (e) => {
    setMontant(e.target.value);
  };
  let AjouterTaxe = () => {
    if (Montant.trim() != "" && clientChoisi && DP && DF && ChosenDepot) {
      let obj = {
        DF: JSON.stringify(DF),
        DP: JSON.stringify(DP),
        num: Montant,
        Produit: clientChoisi.identifier,
        depot: ChosenDepot.identifier,
      };
      ipcRenderer.send("AddLot", obj);
      sync(addToast);
      props.show(false);
      props.refresher();
    } else {
      alert("tous les champs sont obligatoires");
    }
  };
  const ClientsList = [];
  props.produits.forEach((c) => ClientsList.push({ value: c, label: c.nom }));
  const DepotList = [];
  Depots.forEach((c) => DepotList.push({ value: c, label: c.nom }));

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

  const setClientChoisiA = (e) => {
    setClientChoisi(e.value);
  };
  const setDepotChoisi = (e) => {
    setChosenDepot(e.value);
  };
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faPlusCircle} />{" "}
          Ajouter Un Lot
        </div>
        <div className="confirmation_form_container">
          <div
            style={{ gridTemplateColumns: "1fr 1fr" }}
            className="modifyPProduct"
          >
            <Select
              styles={customStyles}
              placeholder="Depot"
              onChange={setDepotChoisi}
              options={DepotList}
            />
            <Select
              styles={customStyles}
              placeholder="Produit"
              onChange={setClientChoisiA}
              options={ClientsList}
            />

            <TextInput
              onChange={changeDetails}
              id="montant"
              name="Montant"
              label="Numero"
            />
            <TextInput
              onChange={setDatePre}
              id="DF"
              name="DF"
              label="date De Fabrication"
              type="date"
            />
            <TextInput
              onChange={setDatePre}
              id="DP"
              name="DP"
              label="date De Péremption"
              type="date"
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

export default AjouterLot;
