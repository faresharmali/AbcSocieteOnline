import React, { useState, useEffect } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faFileInvoiceDollar,
  faUser,
  faStore,
  faPlus,
  faMinusCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import M from "materialize-css";
import Succes_popup from "../../utilities/succes_popup.jsx";
import Select from "react-select";
import sync from "../../sync.js";
import { useToasts } from "react-toast-notifications";
const Nv_bon_commande = (Props) => {
  const { addToast } = useToasts();
  let { ipcRenderer } = require("electron");
  let [produitsChoisi, setProduits] = useState([]);
  let [Produit, setProduitId] = useState(0);
  let [quantity, setQuantity] = useState(0);
  let [Products, setProductList] = useState([]);
  let [Myproducts, setproducts] = useState([]);
  let [PrixTotal, setPrixTotal] = useState(0);
  let [categoriesList, setCategorieList] = useState([]);
  let [succes, showSucces] = useState(false);
  let [fournisseurs, setFournisseurs] = useState([]);
  let [Selectedfournisseur, SetSelectedFournisseur] = useState(null);
  let [societe, SetSocieteList] = useState({});
  useEffect(() => {
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategorieList(result);
    });
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setFournisseurs(result);
      SetSelectedFournisseur(result[0]);

    });
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result[0]);
    });
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      setProductList(result);
      setproducts(result);
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let selectCategory = (e) => {
    if (e.value == "tt") {
      setproducts(Products);
    } else {
      let prod = Products.filter((x) => x.category == e.value.nom);
      setproducts(prod);
    }
  };
  let selectFournisseur = (e) => {
    console.log(e.value);
    SetSelectedFournisseur(e.value);
  };
  let refresher = () => {
    let price = 0;
    produitsChoisi.forEach((x) => (price += x.prix_vente * x.quantityAchete));
    setPrixTotal(price);
    setQuantity(0);
  };
  let ajouterProduit = () => {
    let produitsch = produitsChoisi;
    let found, empty, Quantitys;
    Produit == 0 ? (empty = true) : (empty = false);
    quantity == 0 ? (Quantitys = true) : (Quantitys = false);

    if (!empty && !Quantitys) {
      produitsch.forEach((e) => {
        if (e.identifier == Produit) {
          found = true;
        }
      });
      if (!found) {
        Props.productList.forEach((e) => {
          if (e.identifier == Produit) {
            e.quantityAchete = parseInt(quantity);
            produitsch.push(e);
            setProduits(produitsch);
          }
        });
      } else {
        produitsChoisi.forEach((p) => {
          if (p.identifier == Produit) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((c) =>
                c.identifier == Produit
                  ? {
                      ...c,
                      quantityAchete:
                        parseInt(c.quantityAchete) + parseInt(quantity),
                    }
                  : { ...c }
              )
            );
            refresher(0, 0);
          }
        });
      }
    } else {
      console.log("insert product , or quantity empty");
    }

    refresher();
  };

  let setProduitChoisi = (e) => {
    setProduitId(e.value);
  };
  let setPQuantity = (e) => {
    setQuantity(e.target.value);
  };
  let EnregisterDevis = () => {
    const { ipcRenderer } = require("electron");
    let obj = {
      produits: JSON.stringify(produitsChoisi),
      agent: Props.LoggedInUser.username,
      fournisseur: Selectedfournisseur,
      societe,
    };
    console.log(obj);
    ipcRenderer.send("AddBonCommande", obj);
    ipcRenderer.on("AddBonCommandeAnswer", () => {
      Props.pagehandler(27);
    });
    sync(addToast);
  };
  let changeqte = (x, id) => {
    if (x == 1) {
      setProduits((produitsChoisi) =>
        produitsChoisi.map((p) =>
          p.id === id
            ? { ...p, quantityAchete: p.quantityAchete + 1 }
            : { ...p }
        )
      );
    } else {
      setProduits((produitsChoisi) =>
        produitsChoisi.map((p) =>
          p.id === id
            ? { ...p, quantityAchete: p.quantityAchete - 1 }
            : { ...p }
        )
      );
    }
  };
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

  const FournisseursList = [];
  fournisseurs.forEach((c) =>
    FournisseursList.push({ value: c, label: c.Nom })
  );
  const CategoryList = [{ value: "tt", label: "Toutes les categories" }];
  categoriesList.forEach((c) => CategoryList.push({ value: c, label: c.nom }));
  const ProduitList = [];
  Myproducts.forEach((c) =>
    ProduitList.push({ value: c.identifier, label: c.nom })
  );

  return (
    <section className="nv_devis2">
      {succes && <Succes_popup type="ajoutBon" showSucces={showSucces} />}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faFileInvoiceDollar} /> Creer un bon de commande
      </h1>
      <div style={{ height: "70%" }} className="add_product_contoire2 ">
        <div className="div_headin flex_center">
          <h1 className="nvdevis_title">
            <FontAwesomeIcon icon={faPlusCircle} /> Ajouter produit
          </h1>
        </div>

        <div
          style={{ gridTemplateColumns: "1fr" }}
          className="devis_client_details devis_general_infos"
        >
          <Select
            styles={customStyles}
            placeholder="fournisseur"
            options={FournisseursList}
            onChange={selectFournisseur}
            defaultValue={{ label: "Fournisseur divers", value: "divers" }}
          />

          <Select
            styles={customStyles}
            placeholder="Categorie"
            options={CategoryList}
            onChange={selectCategory}
            defaultValue={{ label: "Toutes les categories", value: "divers" }}
          />
          <Select
            styles={customStyles}
            placeholder="Produit"
            options={ProduitList}
            onChange={setProduitChoisi}
          />
          <div
            style={{ justifyContent: "space-around" }}
            className="flex_center"
          >
            <TextInput
              id="qtte"
              onChange={setPQuantity}
              style={{ marginTop: "15px" }}
              type="number"
              label="Quantité"
              value={quantity}
              min="0"
            />
            <Button
              id="dvBtn"
              onClick={ajouterProduit}
              style={{ marginTop: "20px" }}
              floating
              icon={
                <FontAwesomeIcon style={{ fontSize: "20px" }} icon={faPlus} />
              }
              large
              node="button"
              waves="light"
            />
          </div>
          {produitsChoisi.length > 0 && (
        <Button onClick={EnregisterDevis} style={{ marginTop: "20px" }}>
          Valider
        </Button>
      )}
          
        </div>
      </div>
      <div className="nvDevis_container ">
        <div className="devis_produits_table contoire_table">
          <div>
            <table id="customers">
              <thead>
                <tr className="tableHeader">
                  <th>Désignation</th>
                  <th>Categorie</th>
                  <th>P/U</th>
                  <th>Qte </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="contoireTable">
                {produitsChoisi.map((p) => (
                  <tr key={p.id}>
                    <td data-th="COUNTRY">{p.nom}</td>
                    <td data-th="COUNTRY">{p.category}</td>
                    <td data-th="COUNTRY">{p.prix_vente} Da</td>
                    <td data-th="COUNTRY">
                      {p.quantityAchete} piece{" "}
                      <span className="qtechange">
                        {" "}
                        <FontAwesomeIcon
                          onClick={() => changeqte(1, p.id)}
                          className="qtechangePlus"
                          icon={faPlusCircle}
                        />
                        {"  "}
                        <FontAwesomeIcon
                          onClick={() => changeqte(2, p.id)}
                          className="qtechangeMinus"
                          icon={faMinusCircle}
                        />
                      </span>
                    </td>

                    <td data-th="COUNTRY">
                      <Button
                        onClick={() =>
                          setProduits(
                            produitsChoisi.filter((c) => c.id != p.id)
                          )
                        }
                        style={{
                          backgroundColor: "rgb(207, 31, 31)",
                          marginLeft: "10px",
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
    </section>
  );
};

export default Nv_bon_commande;
