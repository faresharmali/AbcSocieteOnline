import React, { useState, useEffect } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";

import {
  faPlusCircle,
  faFileInvoiceDollar,
  faPlus,
  faMinusCircle,
  faTrashAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import M from "materialize-css";
import Succes_popup from "../../utilities/succes_popup.jsx";
import Reglement_popup from "../../utilities/confirmation_popup.jsx";
import BarcodeReader from "react-barcode-reader";
import sync from "../../sync.js";
import { useToasts } from "react-toast-notifications";

const Nv_bon_entre = (Props) => {
  let { ipcRenderer } = require("electron");
  let [produitsChoisi, setProduits] = useState([]);
  let [Produit, setProduitId] = useState(0);
  let [quantity, setQuantity] = useState(0);
  let [PAchat, setPAchat] = useState(0);
  let [Myproducts, setproducts] = useState([]);
  let [PrixTotal, setPrixTotal] = useState(0);
  let [categoriesList, setCategorieList] = useState([]);
  let [succes, showSucces] = useState(false);
  let [RefglementP, showPopup] = useState(false);
  let [fournisseurs, setFournisseurs] = useState([]);
  let [fournisseur, SetFournisseur] = useState(null);
  let [Societes, SetSocietes] = useState([]);
  let [Lots, setLots] = useState([]);
  let [Depots, setDepots] = useState([]);
  let [LotsChoisi, setChosenLots] = useState([]);
  let [ProductList, setProductList] = useState([]);
  let [SelectedLot, SetLotChosi] = useState(0);
  let [selectedDepot, setDepotChoisi] = useState(null);
  const { addToast } = useToasts();
  useEffect(() => {
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
      setDepotChoisi(result[result.length - 1].identifier);
    });
    ipcRenderer.send("getLots");
    ipcRenderer.on("lotSent", (e, result) => {
      setLots(result);
    });
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocietes(result);
    });
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategorieList(result);
    });
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setFournisseurs(result);
      SetFournisseur(result[0]);
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
      setproducts(ProductList);
    } else {
      let prod = ProductList.filter((x) => x.category == e.value);
      setproducts(prod);
    }
  };
  let refresher = (e, id) => {
    let price = 0;
    if (e == 1) {
      produitsChoisi.forEach((x) => {
        if (x.id == id) {
          price += x.prix_achat * (x.quantityAchete + 1);
        } else {
          price += x.prix_achat * x.quantityAchete;
        }
      });
    } else if (e == 2) {
      produitsChoisi.forEach((x) => {
        if (x.id == id) {
          price += x.prix_achat * (x.quantityAchete - 1);
        } else {
          price += x.prix_achat * x.quantityAchete;
        }
      });
    } else {
      produitsChoisi.forEach((x) => (price += x.prix_achat * x.quantityAchete));
    }
    setPrixTotal(price);
    setQuantity(0);
  };
  let ajouterProduit = () => {
    let produitsch = produitsChoisi;
    let found, Quantitys;
    quantity == 0 ? (Quantitys = true) : (Quantitys = false);

    if (!Quantitys) {
      produitsch.forEach((e) => {
        if (e.LotChoisi.Lotid === SelectedLot.Lotid) {
          found = true;
        }
      });
      if (!found) {
        ProductList.forEach((e) => {
          if (e.identifier == Produit) {
            let s = { ...e };
            s.quantityAchete = parseInt(quantity);
            s.LotChoisi = SelectedLot;
            s.prix_achat = parseFloat(PAchat);
            produitsch.push(s);
            setProduits(produitsch);
          }
        });
      } else {
        produitsChoisi.forEach((e) => {
          if (e.LotChoisi.Lotid === SelectedLot.Lotid) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((c) =>
                c.LotChoisi.Lotid === SelectedLot.Lotid
                  ? {
                      ...c,
                      quantityAchete:
                        parseInt(c.quantityAchete) + parseInt(quantity),
                      prix_achat: PAchat,
                    }
                  : { ...c }
              )
            );
          }
        });
      }
    } else {
      alert("Selectionner un produit + quantité !");
    }

    refresher(0, 0);
  };

  let selectclient = (e) => {
    SetFournisseur(e.value);
  };

  let setProduitChoisi = (e) => {
    let lotsChoisi = Lots.filter(
      (x) => x.product == e.value && x.depot == selectedDepot
    );
    setChosenLots(lotsChoisi);
    let Lot = Lots.filter((x) => x.product == e.value && x.initial == 1);
    SetLotChosi(Lot[0]);
    setProduitId(e.value);
  };
  let selectDepot = (e) => {
    let lotsChoisi = Lots.filter(
      (x) => x.product == Produit && x.depot == e.value
    );
    setChosenLots(lotsChoisi);
    setDepotChoisi(e.value);
  };
  let setLot = (e) => {
    SetLotChosi(e.value);
  };
  let setPQuantity = (e) => {
    setQuantity(e.target.value);
  };
  let ChangePrixAchat = (e) => {
    setPAchat(e.target.value);
  };
  let EnregisterDevis = ({ reglement }) => {
    if (fournisseur) {
      const { ipcRenderer } = require("electron");
      let obj = {
        produits: JSON.stringify(produitsChoisi),
        agent: Props.LoggedInUser.username,
        fournisseur: fournisseur,
        reglement: reglement,
        Total: PrixTotal,
      };
      ipcRenderer.send("AddBonEntre", obj);
      const obj2 = {
        user: Props.LoggedInUser.username,
        montant: PrixTotal,
        Client: fournisseur,
        reglement: reglement,
        type: "fournisseur",
      };
      ipcRenderer.send("AddReglement", obj2);
      ipcRenderer.send("AddAchat", {
        produitsChoisi,
        fournisseur: JSON.stringify(fournisseur),
      });
      ipcRenderer.send("updateLots", produitsChoisi);
      sync(addToast);
      setProduits([]);
      showPopup(false);
      Props.pagehandler(19);
      ipcRenderer.send("updatePrixAchat", produitsChoisi);
    } else alert("les Champs Societé et Fournisseur Sont Obligatoires");
  };
  let changeqte = (x, id) => {
    if (x == 1) {
      produitsChoisi.forEach((p) => {
        if (p.id == id) {
          setProduits((produitsChoisi) =>
            produitsChoisi.map((p) =>
              p.id === id
                ? { ...p, quantityAchete: p.quantityAchete + 1 }
                : { ...p }
            )
          );
          refresher(1, id);
        }
      });
    } else {
      produitsChoisi.forEach((p) => {
        if (p.id == id) {
          if (p.quantityAchete > 1) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((p) =>
                p.id === id
                  ? { ...p, quantityAchete: p.quantityAchete - 1 }
                  : { ...p }
              )
            );
            refresher(2, id);
          }
        }
      });
    }
  };
  let AjouterProduitViaCodeBar = (barcode) => {
    let prod = ProductList.filter((p) => p.BarCode == barcode);
    let found = false;
    let produitsch = [...produitsChoisi];
    produitsch.forEach((e) => {
      if (e.id === prod[0].id) {
        found = true;
      }
    });
    if (!found) {
      ProductList.forEach((e) => {
        if (e.id == prod[0].id) {
          e.quantityAchete = 1;
          produitsch.push(e);
          setProduits(produitsch);
        }
      });
    } else {
      setProduits((produitsChoisi) =>
        produitsChoisi.map((c) =>
          c.id == prod[0].id
            ? { ...c, quantityAchete: c.quantityAchete + 1 }
            : { ...c }
        )
      );
    }
    setPrixTotal((PrixTotal += prod[0].prix_achat));
  };

  let handleScan = (data) => {
    AjouterProduitViaCodeBar(data);
  };
  let handleError = (err) => {
    console.error(err);
  };
  const ChosenLots = [];
  LotsChoisi.forEach((c) => ChosenLots.push({ value: c, label: c.numero }));
  const ChosenSociete = [];
  Societes.forEach((c) => ChosenSociete.push({ value: c, label: c.nom }));
  const chosenClients = [];
  fournisseurs.forEach((c) =>
    chosenClients.push({ value: c, label: c.Nom + " " + c.prenom })
  );
  const CategoryList = [{ value: "tt", label: "Toutes les categories" }];
  categoriesList.forEach((c) =>
    CategoryList.push({ value: c.nom, label: c.nom })
  );
  const ChosenProducts = [];
  Myproducts.forEach((c) =>
    ChosenProducts.push({ value: c.identifier, label: c.nom })
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
  const Depotlist = [];
  Depots.forEach((c) => Depotlist.push({ value: c.identifier, label: c.nom }));

  return (
    <div>
      {RefglementP && (
        <Reglement_popup
          handlePopup={showPopup}
          GenererFacture={EnregisterDevis}
        />
      )}
      {succes && <Succes_popup type="ajoutBon" showSucces={showSucces} />}
      <section className="nv_devis2">
        <BarcodeReader onError={handleError} onScan={handleScan} />

        <h1 className="section_title">
          <FontAwesomeIcon icon={faFileInvoiceDollar} /> Creer Un Bon D'entrée
        </h1>

        <div style={{ height: "100%" }} className="add_product_contoire2 ">
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
              placeholder="Fournisseur"
              onChange={selectclient}
              options={chosenClients}
              defaultValue={{ label: "Fournisseur divers", value: "divers" }}
            />
            <Select
              styles={customStyles}
              placeholder="Depot"
              onChange={selectDepot}
              options={Depotlist}
              defaultValue={{ label: "Depot central", value: "divers" }}
            />
            <Select
              styles={customStyles}
              placeholder="Categorie"
              onChange={selectCategory}
              options={CategoryList}
              defaultValue={{ label: "Toutes les categories", value: "divers" }}
            />
            <Select
              styles={customStyles}
              placeholder="Produit"
              onChange={setProduitChoisi}
              options={ChosenProducts}
            />
            <Select
              styles={customStyles}
              placeholder="Lot"
              onChange={setLot}
              options={ChosenLots}
            />
            <TextInput
              value={PAchat}
              onChange={ChangePrixAchat}
              label="Prix d'achat"
            />
            <div
              style={{ justifyContent: "space-around" }}
              className="flex_center"
            >
              <TextInput
                id="qtte"
                onChange={setPQuantity}
                style={{ marginTop: "15px", width: "150px" }}
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
                onClick={() => {
                  refresher(0, 0);
                  showPopup(true);
                }}
                style={{
                  marginTop: "20px",
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
                  <tr className="tableHeader" style={{ height: "50px" }}>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Désignation
                    </th>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Lot
                    </th>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      P/U
                    </th>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Qte{" "}
                    </th>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Supprimer
                    </th>
                  </tr>
                </thead>
                <tbody className="contoireTable">
                  {produitsChoisi.map((p) => (
                    <tr key={p.LotChoisi.numero}>
                      <td data-th="COUNTRY">{p.nom}</td>
                      <td data-th="COUNTRY">{p.LotChoisi.numero}</td>
                      <td data-th="COUNTRY">{p.prix_achat} Da</td>
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
                          onClick={() => {
                            let price = 0;
                            produitsChoisi.forEach((x) => {
                              if (x.id != p.id)
                                price += x.prix_achat * x.quantityAchete;
                            });
                            setPrixTotal(price);
                            setProduits(
                              produitsChoisi.filter((c) => c.id != p.id)
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
    </div>
  );
};

export default Nv_bon_entre;
