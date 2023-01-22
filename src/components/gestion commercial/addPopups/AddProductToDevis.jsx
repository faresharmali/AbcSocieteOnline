import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const AddProductToDevis = (props) => {
  const { ipcRenderer } = require("electron");
  let [ChosenLots, setChosenLots] = useState([]);
  let [Produit, setProduitId] = useState(0);
  let [quantity, setQuantity] = useState(0);
  let [Myproducts, setproducts] = useState(props.Myproducts);
  let [selectedDepot, setDepotChoisi] = useState(props.Depots[props.Depots.length - 1].identifier);
  let [SelectedLot, setLotChoisi] = useState(null);
console.log(selectedDepot)
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

  const ChosenDepots = [];
  props.Depots.forEach((c) =>
    ChosenDepots.push({ value: c.identifier, label: c.nom })
  );
  const ChosenProducts = [];
  Myproducts.forEach((c) =>
    ChosenProducts.push({ value: c.identifier, label: c.nom })
  );
  const ChosenLot = [];
  ChosenLots.forEach((c) => ChosenLot.push({ value: c, label: c.numero }));
  const CategoryList = [{ value: "tt", label: "toutes les categories" }];
  props.categoriesList.forEach((c) =>
    CategoryList.push({ value: c.nom, label: c.nom })
  );
  let selectDepot = (e) => {
    let lotsChoisi = props.Lots.filter(
      (x) => x.product == Produit && x.depot == e.value
    );
    setChosenLots(lotsChoisi);
    setDepotChoisi(e.value);
  };
  let selectCategory = (e) => {
    if (e.value != "tt") {
      let prod = props.Myproducts.filter((x) => x.category == e.value);
      setproducts(prod);
    } else {
      setproducts(props.Myproducts);
    }
    setProduitId(0);
  };
  let setProduitChoisi = (e) => {
    let lotsChoisi = props.Lots.filter(
      (x) => x.product == e.value && x.depot == selectedDepot
    );
    setChosenLots(lotsChoisi);
    let Lot = props.Lots.filter((x) => x.product == e.value && x.initial == 1);
    setLotChoisi(Lot[0]);
    setProduitId(e.value);
  };
  let setLot = (e) => {
    setLotChoisi(e.value);
  };

  let setPQuantity = (e) => {
    setQuantity(e.target.value);
  };

  let AddProduct = () => {
    props.ajouterProduit({Produit,quantity,SelectedLot})
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
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
            className="modifyPProduct"
          >
            <Select
              styles={customStyles}
              placeholder="Depot"
              onChange={selectDepot}
              options={ChosenDepots}
              defaultValue={{ label: "Depot central", value:"tt" }}

            />
            <Select
              styles={customStyles}
              placeholder="Categorie"
              onChange={selectCategory}
              options={CategoryList}
              defaultValue={{ label: "toutes les categories", value:"tt" }}

            />

            <Select
              styles={customStyles}
              placeholder="Produit"
              onChange={setProduitChoisi}
              options={ChosenProducts}
            />
            <Select
              styles={customStyles}
              placeholder="Lots"
              onChange={setLot}
              options={ChosenLot}
            />

            <TextInput
              value={quantity}
              onChange={setPQuantity}
              label="Quantité"
              min="0"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.show(false)}>Annuler</Button>
            <Button onClick={AddProduct}>Ajouter</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductToDevis;
