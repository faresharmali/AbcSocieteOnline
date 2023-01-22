import React, { useEffect, useState } from "react";
import { Button, TextInput, DatePicker } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const AddProduct = (props) => {
  let [Lot, setLot] = useState(null);
  let [qte, setQte] = useState(0);
  let [Depots, setDepots] = useState([]);
  let [Lots, setLots] = useState([]);
  console.log("mes lots", Lot);
  useEffect(() => {
    setLots(props.Lots.filter((p) => p.product == props.products.identifier));
    let Lot = props.Lots.filter((x) => x.product == props.products.identifier && x.initial == 1);

    setLot(Lot[0])
    setDepots(props.Depots);
  }, [props]);

  let AjouterTaxe = () => {
    if (Lot && qte) {
      if (qte <= Lot.quantity) {
        let data = { qte, Lot, prod: props.products.id };
        props.addProductToList(data);
      } else {
        alert("quantité inssufisante");
      }
    } else {
      alert("tous les champs sont obligatoires");
    }
  };
  const selectLot = (e) => {
    setLot(e.value);
  };
  const selectDepot = (e) => {
    setLots(
      props.Lots.filter(
        (l) => l.depot == e.value && l.product == props.products.identifier
      )
    );
  };
  const selectQte = (e) => {
    setQte(parseInt(e.target.value));
  };
  const ClientsList = [];
  Lots.forEach((c) => ClientsList.push({ value: c, label: c.numero }));
  const DepotList = [];
  Depots.forEach((c) => DepotList.push({ value: c.identifier, label: c.nom }));

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

  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faPlusCircle} />{" "}
          Ajouter Un Produit
        </div>
        <div className="confirmation_form_container">
          <div
            style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
            className="modifyPProduct"
          >
            <div style={{ fontSize: 20 }} className="flex_center">
              {props.products.nom}
            </div>
            <Select
              styles={customStyles}
              placeholder="Depot"
              onChange={selectDepot}
              options={DepotList}
              defaultValue={{ label: "Depot central", value:"tt" }}

            />
            <Select
              styles={customStyles}
              placeholder="Lot"
              onChange={selectLot}
              options={ClientsList}
              defaultValue={{ label:  Lot ? Lot.numero :"Lot initial", value:"tt" }}

            />

            <input
              type="number"
              min="0"
              placeholder="Quantité"
              onChange={selectQte}
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

export default AddProduct;
