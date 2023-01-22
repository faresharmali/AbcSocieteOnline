import React, { useState, useEffect } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faFileInvoiceDollar,
  faUser,
  faStore,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import M from "materialize-css";
import Succes_popup from "../../utilities/succes_popup.jsx";
import Select from "react-select";
import sync from "../../sync.js";
import { useToasts } from "react-toast-notifications";

const Nv_Avoir = (Props) => {
  let { ipcRenderer } = require("electron");
  let [SelectedLot, SetLotChosi] = useState(0);
  let [produitsChoisi, setProduits] = useState([]);
  let [Produit, setProduitId] = useState(0);
  let [clients, setclients] = useState([]);
  let [SelectedClient, setSelectedClient] = useState(null);

  let [quantity, setQuantity] = useState(0);
  let [Myproducts, setproducts] = useState([]);
  let [PrixTotal, setPrixTotal] = useState(0);
  let [categoriesList, setCategorieList] = useState([]);
  let [Lots, setLotList] = useState([]);
  let [LotList, setLots] = useState([]);
  let [succes, showSucces] = useState(false);
  let [societe, SetSocieteList] = useState({});
  let [Depots, setDepots] = useState([]);
  let [selectedDepot, setDepotChoisi] = useState(null);
    let [productList, setProductsList] = useState([]);

  const { addToast } = useToasts();

  useEffect(() => {
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
      setDepotChoisi(result[result.length - 1].identifier);

    });
    ipcRenderer.send("getLots");
    ipcRenderer.on("lotSent", (e, result) => {
      setLotList(result);
    });
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategorieList(result);
    });
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result[0]);
    });
    ipcRenderer.send("GiveMeClients");
    ipcRenderer.on("ClientsBack", (e, result) => {
      setclients(result);
      setSelectedClient(result[result.length-1]);

    });
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      setProductsList(result);
      setproducts(result);
    });
  }, []);
  let selectCategory = (e) => {
    if (e.value == "tt") {
      setproducts(productList);
    } else {
      let prod = productList.filter((x) => x.category == e.value.nom);
      setproducts(prod);
    }
  };
  useEffect(() => {
    refresher(0, 0);
  }, [produitsChoisi]);

  let refresher = () => {
    let price = 0;
    produitsChoisi.forEach((x) => (price += x.prix_vente * x.quantityAchete));
    setPrixTotal(price);
    setQuantity(0);
  };
  let ajouterProduit = () => {
    let produitsch = produitsChoisi;
    let found, empty, Quantitys
    Produit == 0 ? (empty = true) : (empty = false);
    quantity == 0 ? (Quantitys = true) : (Quantitys = false);

    if ( !Quantitys && !empty) {
      produitsch.forEach((e) => {
        if (e.LotChoisi.Lotid == SelectedLot.Lotid) {
          found = true;
        }
      });
      if (!found) {
        productList.forEach((s) => {
          if (s.identifier == Produit) {
            let e = { ...s };
            e.quantityAchete = parseInt(quantity);
            produitsch.push(e);
            e.LotChoisi = SelectedLot;
            setProduits(produitsch);
          }
        });
      } else {
        produitsChoisi.forEach((p) => {
          if (p.LotChoisi.Lotid == SelectedLot.Lotid) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((c) =>
                c.LotChoisi.Lotid == SelectedLot.Lotid
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
      alert("tous les champs son obligatoires");
    }

    refresher();
  };
  let setClientChoisi = (e) => {
    clients.filter((element) => {
      if (element.id == e.value) setClientId(element);
    });
  };

  let setProduitChoisi = (e) => {
    let lotsChoisi = Lots.filter(
      (x) => x.product == e.value && x.depot == selectedDepot
    );
    let Lot = Lots.filter((x) => x.product == e.value && x.initial == 1);
    SetLotChosi(Lot[0]);
    setLots(lotsChoisi);
    setProduitId(e.value);
  };
  let setLotChoisi = (e) => {
    SetLotChosi(e.value);
  };
  let setPQuantity = (e) => {
    setQuantity(e.target.value);
  };
  let EnregisterDevis = () => {
    let devisObj = {
      user: Props.LoggedInUser.username,
      clientID: JSON.stringify(SelectedClient),
      Produits: JSON.stringify(produitsChoisi),
      prixT: PrixTotal,
      societe: JSON.stringify(societe),
    };
    ipcRenderer.send("AddAvoir", devisObj);
    ipcRenderer.send("updateLots", produitsChoisi);
    sync(addToast);
    setProduits([]);
    Props.pagehandler(16);
  };
  const categoryList = [{ value: "tt", label: "Toutes les categories" }];
  categoriesList.forEach((c) => categoryList.push({ value: c, label: c.nom }));

  const ClientsList = [];
  Props.clients.forEach((c) =>
    ClientsList.push({ value: c.id, label: c.nom + " " + c.prenom })
  );
  const ProductList = [];
  Myproducts.forEach((c) =>
    ProductList.push({ value: c.identifier, label: c.nom })
  );
  const LotsList = [];
  LotList.forEach((c) => LotsList.push({ value: c, label: c.numero }));
  const ChosenDepots = [];
  Depots.forEach((c) =>
    ChosenDepots.push({ value: c.identifier, label: c.nom })
  );

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
  let selectDepot = (e) => {
    let lotsChoisi = Lots.filter(
      (x) => x.product == Produit && x.depot == e.value
    );
    SetLotChosi(null);
    setLots(lotsChoisi);
    setDepotChoisi(e.value);
  };

  return (
    <section className="nv_devis2">
      {succes && <Succes_popup type="ajout" showSucces={showSucces} />}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faFileInvoiceDollar} /> Creer un Bon de retour
      </h1>
      <div style={{ height: "100%" }} className="add_product_contoire2 ">
        <div className="div_headin flex_center">
          <h1 className="nvdevis_title">
            <FontAwesomeIcon icon={faPlusCircle} /> Informations
          </h1>
        </div>

        <div
         style={{ gridTemplateColumns: "1fr" }}
         className="devis_client_details devis_general_infos"
        >
          <Select
            styles={customStyles}
            placeholder="Client"
            onChange={setClientChoisi}
            options={ClientsList}
            defaultValue={{ label: "Client divers", value: "divers" }}

          />
          <Select
            styles={customStyles}
            placeholder="Depot"
            onChange={selectDepot}
            options={ChosenDepots}
            defaultValue={{ label: "Depot central", value: "divers" }}

          />
          <Select
            styles={customStyles}
            placeholder="Categorie"
            onChange={selectCategory}
            options={categoryList}
            defaultValue={{ label: "Toutes les categories", value: "divers" }}

          />

          <Select
            styles={customStyles}
            placeholder="Produit"
            onChange={setProduitChoisi}
            options={ProductList}
          />
          <Select
            styles={customStyles}
            placeholder="Lot"
            onChange={setLotChoisi}
            options={LotsList}
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
            min="0"
            label="Quantité"
            value={quantity}
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
        <Button
          onClick={EnregisterDevis}
          style={{ marginTop: "20px",
          backgroundColor: " rgb(28, 81, 97)",
        }}
        >
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
                <tr>
                  <th style={{ backgroundColor: "#232e42" }}>Désignation</th>
                  <th style={{ backgroundColor: "#232e42" }}>Lot</th>
                  <th style={{ backgroundColor: "#232e42" }}>P/U</th>
                  <th style={{ backgroundColor: "#232e42" }}>Qte</th>
                  <th style={{ backgroundColor: "#232e42" }}>Prix total</th>
                  <th style={{ backgroundColor: "#232e42", fontSize: "18px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="contoireTable">
                {produitsChoisi.map((p) => (
                  <tr style={{ padding: "10px 0" }} key={p.LotChoisi.Lotid}>
                    <td data-th="COUNTRY">{p.nom}</td>
                    <td data-th="COUNTRY">{p.LotChoisi.numero}</td>
                    <td data-th="COUNTRY">{p.prix_vente} Da</td>
                    <td data-th="COUNTRY">{p.quantityAchete} piece</td>
                    <td data-th="COUNTRY">
                      {p.prix_vente * p.quantityAchete} Da
                    </td>
                    <td>
                      <Button
                        onClick={() => {
                          let price = 0;
                          produitsChoisi.forEach((x) => {
                            if (x.LotChoisi.Lotid != p.LotChoisi.Lotid)
                              price += x.prixChoisi * x.quantityAchete;
                          });
                          setPrixTotal(price);
                          console.log(produitsChoisi);
                          setProduits(
                            produitsChoisi.filter(
                              (c) => c.LotChoisi.Lotid != p.LotChoisi.Lotid
                            )
                          );
                        }}
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

export default Nv_Avoir;
