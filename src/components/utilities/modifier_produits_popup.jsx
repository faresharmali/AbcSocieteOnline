import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";
import sync from "../sync.js";

const Modifier_produit_popup = (props) => {
  let [Product, SetProduct] = useState([]);
  const { addToast } = useToasts();
  const { ipcRenderer } = require("electron");
  useEffect(() => {
    ipcRenderer.on("UpdateProductAnswer", (e, result) => {
      props.ShowEditPopup(false);
      props.Actualiser();
      sync(addToast);
    });

    SetProduct(props.SelectedProduct);
  }, []);
  let changeDetails = (e) => {
    switch (e.target.name) {
      case "productName":
        SetProduct({ ...Product, nom: e.target.value });
        break;
      case "PrixAchat":
        SetProduct({ ...Product,  prix_achat: e.target.value.trim()!="" ? parseFloat(e.target.value):0 });
        break;
      case "PrixVente":
        SetProduct({ ...Product, prix_vente: e.target.value.trim()!="" ? parseFloat(e.target.value):0 });
        break;
      case "Categorie":
        SetProduct({ ...Product, category: e.target.value });
        break;
      case "minqte":
        SetProduct({ ...Product, MinQte:  e.target.value.trim()!="" ? parseFloat(e.target.value):0 });
        break;
      case "prix_gros":
        SetProduct({ ...Product, prix_gros:  e.target.value.trim()!="" ? parseFloat(e.target.value):0 });
        break;
      case "prix_semi":
        SetProduct({ ...Product, prix_semi:  e.target.value.trim()!="" ? parseFloat(e.target.value):0 });
        break;
      case "Profit":
        SetProduct({ ...Product, profit:  e.target.value.trim()!="" ? parseFloat(e.target.value):0 });
        break;
    }
  };
  let updateProduct = () => {
    ipcRenderer.send("UpdateProduct", Product);
  };
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faEdit} />{" "}
          Modifier Un Produitsss
        </div>
        <div className="confirmation_form_container">
          <div className="modifyPProduct">
            <TextInput
              onChange={changeDetails}
              value={Product.nom}
              id="productName"
              name="productName"
              label="Nom De Produit"
            />
     
            <TextInput
              onChange={changeDetails}
              value={Product.prix_vente}
              id="PrixVente"
              name="PrixVente"
              label="Prix de Detaille"
            />
            <TextInput
              onChange={changeDetails}
              value={Product.prix_gros}
              id="PrixVente"
              name="prix_gros"
              label="Prix de Gros"
            />
            <TextInput
              onChange={changeDetails}
              value={Product.prix_semi}
              id="PrixVente"
              name="prix_semi"
              label="Prix de Semi-Gros"
            />
            <TextInput
              onChange={changeDetails}
              value={Product.MinQte}
              id="minqte"
              name="minqte"
              label="Quantité Minimal"
            />
            <TextInput
              onChange={changeDetails}
              value={Product.profit}
              id="Profit"
              name="Profit"
              label="Marge De Profit"
            />
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.ShowEditPopup(false)}>Annuler</Button>
            <Button onClick={updateProduct}>Modifier</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modifier_produit_popup;
