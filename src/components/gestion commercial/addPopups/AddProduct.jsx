import React, { useEffect, useState } from "react";
import { Button, TextInput, Select } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";

import sync from "../../sync";
const AddProduct = (props) => {
  const { ipcRenderer } = require("electron");
  let [categoryList, setCategoryList] = useState([]);

  let [ProductName, setProductName] = useState("");
  let [Barcode, setBarcode] = useState("");
  let [Category, setCategory] = useState("");
  let [PrixAchat, SetPrixAchat] = useState(0);
  let [PrixVente, SetPrixVente] = useState(0);
  let [PrixGros, SetPrixGros] = useState(0);
  let [Profit, SetProfit] = useState(0);
  let [PrixSemi, SetPrixSemi] = useState(0);
  let [Marque, SetMarque] = useState("");
  let [MinQte, SetMinQte] = useState(0);
  let [InitQte, setInitQte] = useState(0);
  const { addToast } = useToasts();
  console.log(PrixAchat)
  useEffect(() => {
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategoryList(result);
    });
  }, []);
  let SetData = (e) => {
    if (e.target.value.trim() == "") {
      console.log("nannn");
    }
    switch (e.target.name) {
      case "category":
        setCategory(e.target.value);
        break;

      case "prixvente":
        SetPrixVente(e.target.value);
        break;
      case "PrixGros":
        SetPrixGros(e.target.value);
        break;
      case "PrixSemi":
        SetPrixSemi(e.target.value);
        break;

      case "nom":
        setProductName(e.target.value);
        break;
      case "Barcode":
        setBarcode(e.target.value);
        break;
      case "MinQte":
        SetMinQte(parseInt(e.target.value));
        break;
      case "Marque":
        SetMarque(e.target.value);
        break;
      case "pAchat":
        SetPrixAchat(e.target.value);
        break;
      case "Profit":
        SetProfit(e.target.value);
        break;
      case "qte":
        setInitQte(e.target.value);
        break;
    }
  };
  let ajouterProduit = () => {
    if (ProductName.trim() != "") {
      if (!props.ProductsNames.includes(ProductName.trim().toUpperCase())) {
        let Product_Obj = {
          ProductName,
          Category,
          PrixAchat: JSON.stringify({ prix: [parseFloat(PrixAchat)] }),
          PrixVente,
          Barcode,
          MinQte,
          Marque,
          PrixGros,
          PrixSemi,
          Profit,
          qte: InitQte,
        };
        ipcRenderer.send("SendProductToDB", Product_Obj);
        sync(addToast);
      } else {
        alert("produit deja exist");
      }
    } else {
      alert("Le Champ Nom De Produit Est Obligatoire");
    }
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
            <TextInput
              id="TextInput-mar"
              label="Marque Du Produit"
              value={Marque}
              name="Marque"
              onChange={SetData}
            />
            <TextInput
              id="TextInput-4"
              label="Nom Du Produit"
              value={ProductName}
              name="nom"
              onChange={SetData}
            />
            <TextInput
              id="TextInput-5"
              label="Code Barre"
              value={Barcode}
              name="Barcode"
              onChange={SetData}
              type="text"
            />
            <Select onChange={SetData} value={Category} name="category">
              <option disabled value="">
                {" "}
                categorie
              </option>
              {categoryList.map((x) => (
                <option key={x.id} value={x.nom}>
                  {x.nom}
                </option>
              ))}
            </Select>
            <TextInput
              value={PrixAchat}
              name="pAchat"
              onChange={SetData}
              style={{ marginTop: "15px" }}
              label="Prix d'achat"
            />
            <TextInput
              value={PrixVente}
              name="prixvente"
              onChange={SetData}
              style={{ marginTop: "15px" }}
              label="Prix de detail"
            />
            <TextInput
              value={PrixGros}
              name="PrixGros"
              onChange={SetData}
              style={{ marginTop: "15px" }}
              label="Prix de Gros"
            />
            <TextInput
              value={PrixSemi}
              name="PrixSemi"
              onChange={SetData}
              style={{ marginTop: "15px" }}
              label="Prix de Semi-Gros"
            />
            <TextInput
              value={MinQte}
              name="MinQte"
              onChange={SetData}
              style={{ marginTop: "15px" }}
              label="Quantité Minimale"
            />
            <TextInput
              value={InitQte}
              name="qte"
              onChange={SetData}
              style={{ marginTop: "15px" }}
              label="Quantité initiale"
            />
            <TextInput
              value={Profit}
              name="Profit"
              onChange={SetData}
              style={{ marginTop: "15px" }}
              label="Pourcentage De Profit"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.show(false)}>Annuler</Button>
            <Button onClick={ajouterProduit}>Ajouter</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
