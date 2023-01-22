import React, { useState, useEffect } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faFileInvoiceDollar,
  faPlus,
  faMinusCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import M from "materialize-css";
import Succes_popup from "../../utilities/succes_popup.jsx";
import BarcodeReader from "react-barcode-reader";
import Select from "react-select";
import sync from "../../sync.js";
import { useToasts } from "react-toast-notifications";

const Nv_bon_sortie = (Props) => {
  let { ipcRenderer } = require("electron");
  let [produitsChoisi, setProduits] = useState([]);
  let [Produit, setProduitId] = useState(0);
  let [quantity, setQuantity] = useState(0);
  let [Myproducts, setproducts] = useState([]);
  let [productList, setProductsList] = useState(0);
  let [categoriesLists, setCategorieList] = useState([]);
  let [Societes, SetSocietes] = useState([]);
  let [SelectedClient, setSelectedClient] = useState(null);
  let [succes, showSucces] = useState(false);
  let [clients, setclients] = useState([]);
  let [Lots, setLotList] = useState([]);
  let [ChosenLots, setChosenLots] = useState([]);
  let [SelectedLot, setLotChoisi] = useState(null);

  let [Depots, setDepots] = useState([]);
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
      setLotList(result);
    });
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocietes(result[0]);
    });
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategorieList(result);
    });
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      setProductsList(result);
      setproducts(result);
    });
    ipcRenderer.send("GiveMeClients");
    ipcRenderer.on("ClientsBack", (e, result) => {
      setclients(result);
      setSelectedClient(result[result.length - 1]);
    });
  }, []);
  let selectCategory = (e) => {
    if ((e.value = "tt")) {
      setproducts(productList);
    } else {
      let prod = productList.filter((x) => x.category == e.value);
      setproducts(prod);
    }
    setProduitId(0);
  };
  let refresher = () => {
    let price = 0;
    produitsChoisi.forEach((x) => (price += x.prix_vente * x.quantityAchete));
    setQuantity(0);
  };

  let selectclient = (e) => {
    console.log(e.value);
    setSelectedClient(e.value);
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
        productList.forEach((e) => {
          if (e.identifier == Produit) {
            let s = { ...e };

            if (SelectedLot.quantity >= parseInt(quantity)) {
              s.quantityAchete = parseInt(quantity);
              s.LotChoisi = SelectedLot;
              produitsch.push(s);
              s.prixChoisi = s.prix_vente;
              setProduits(produitsch);
            } else {
              alert("Quantité Non Disponible !");
            }
          }
        });
      } else {
        produitsChoisi.forEach((p) => {
          if (p.LotChoisi.Lotid == SelectedLot.Lotid) {
            if (SelectedLot.quantity >= p.quantityAchete + parseInt(quantity)) {
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
            } else {
              alert("quantité non disponnible");
            }
          }
        });
      }
    } else {
      alert("Tous les Champs sont obligatoires !");
    }

    refresher();
  };

  let setProduitChoisi = (e) => {
    let lotsChoisi = Lots.filter(
      (x) => x.product == e.value && x.depot == selectedDepot
    );
    setChosenLots(lotsChoisi);
    let Lot = Lots.filter((x) => x.product == e.value && x.initial == 1);
    setLotChoisi(Lot[0]);
    setProduitId(e.value);
  };
  let setPQuantity = (e) => {
    setQuantity(e.target.value);
  };
  let EnregisterDevis = () => {
    if (SelectedClient) {
      const { ipcRenderer } = require("electron");
      let obj1 = {
        produits: JSON.stringify(produitsChoisi),
        agent: Props.LoggedInUser.username,
        SelectedSociete: JSON.stringify(Societes),
        Client: JSON.stringify(SelectedClient),
      };
      ipcRenderer.send("AddBonSortie", obj1);
      ipcRenderer.send(
        "updateLots",
        produitsChoisi.map((element) =>
          element.id
            ? { ...element, quantityAchete: -element.quantityAchete }
            : element
        )
      );
      Props.pagehandler(20);
      sync(addToast);
    } else alert("Les Champs Client Et Societé Sont Obligatoires");
  };
  let changeqte = (x, id) => {
    if (x == 1) {
      produitsChoisi.forEach((p) => {
        if (p.LotChoisi.Lotid == id) {
          console.log(p);
          if (p.quantityAchete < p.LotChoisi.quantity) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((p) =>
                p.LotChoisi.Lotid == id
                  ? { ...p, quantityAchete: p.quantityAchete + 1 }
                  : { ...p }
              )
            );
          } else {
            alert("Quantité Non Disponible");
          }
        }
      });
    } else {
      produitsChoisi.forEach((p) => {
        if (p.LotChoisi.Lotid == id) {
          if (p.quantityAchete > 1) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((p) =>
                p.LotChoisi.Lotid === id
                  ? { ...p, quantityAchete: p.quantityAchete - 1 }
                  : { ...p }
              )
            );
          }
        }
      });
    }
  };
  let AjouterProduitViaCodeBar = (barcode) => {
    let prod = productList.filter((p) => p.BarCode == parseInt(barcode));
    let found = false;
    let produitsch = [...produitsChoisi];

    produitsch.forEach((e) => {
      if (e.id === prod[0].id) {
        found = true;
      }
    });
    if (!found) {
      productList.forEach((e) => {
        if (e.id == prod[0].id) {
          if (e.quantity >= 1) {
            e.quantityAchete = 1;
            produitsch.push(e);
            setProduits(produitsch);
          } else {
            alert("Quantité Non Disponible !");
          }
        }
      });
    } else {
      produitsChoisi.forEach((p) => {
        if (p.id == prod[0].id) {
          if (p.quantityAchete < p.quantity) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((p) =>
                p.id === prod[0].id
                  ? { ...p, quantityAchete: p.quantityAchete + 1 }
                  : { ...p }
              )
            );
          } else {
            alert("Quantité Non Disponible");
          }
        }
      });
    }
  };

  let handleScan = (data) => {
    AjouterProduitViaCodeBar(data);
  };
  let handleError = (err) => {
    console.error(err);
  };

  const chosenClients = [];
  clients.forEach((c) =>
    chosenClients.push({ value: c, label: c.nom + " " + c.prenom })
  );
  const CategoryList = [{ value: "tt", label: "Tous" }];
  categoriesLists.forEach((c) =>
    CategoryList.push({ value: c.nom, label: c.nom })
  );
  const ChosenProducts = [];
  Myproducts.forEach((c) =>
    ChosenProducts.push({ value: c.identifier, label: c.nom })
  );
  const ChosenLot = [];
  ChosenLots.forEach((c) => ChosenLot.push({ value: c, label: c.numero }));
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
  let setLot = (e) => {
    setLotChoisi(e.value);
  };
  const Depotlist = [];
  Depots.forEach((c) => Depotlist.push({ value: c.identifier, label: c.nom }));

  let selectDepot = (e) => {
    let lotsChoisi = Lots.filter(
      (x) => x.product == Produit && x.depot == e.value
    );
    setLotChoisi(null);
    setChosenLots(lotsChoisi);
    setDepotChoisi(e.value);
  };
  return (
    <section className="nv_devis2">
      <BarcodeReader onError={handleError} onScan={handleScan} />

      {succes && <Succes_popup type="ajoutBon" showSucces={showSucces} />}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faFileInvoiceDollar} /> Creer Un Bon de sortie
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
            placeholder="Client"
            onChange={selectclient}
            options={chosenClients}
            defaultValue={{ label: "Client divers", value: "divers" }}
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
            placeholder="Lots"
            onChange={setLot}
            options={ChosenLot}
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
                  <th style={{ backgroundColor: "#232e42", fontSize: "18px" }}>
                    Produit
                  </th>
                  <th style={{ backgroundColor: "#232e42", fontSize: "18px" }}>
                    Lot
                  </th>

                  <th style={{ backgroundColor: "#232e42", fontSize: "18px" }}>
                    Prix Unité
                  </th>
                  <th style={{ backgroundColor: "#232e42", fontSize: "18px" }}>
                    Quantité{" "}
                  </th>
                  <th style={{ backgroundColor: "#232e42", fontSize: "18px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="contoireTable">
                {produitsChoisi.map((p) => (
                  <tr key={p.LotChoisi.Lotid}>
                    <td data-th="COUNTRY">{p.nom}</td>
                    <td data-th="COUNTRY">{p.LotChoisi.numero}</td>
                    <td data-th="COUNTRY">{p.prix_vente} Da</td>
                    <td data-th="COUNTRY">
                      {p.quantityAchete} piece{" "}
                      <span className="qtechange">
                        {" "}
                        <FontAwesomeIcon
                          onClick={() => changeqte(1, p.LotChoisi.Lotid)}
                          className="qtechangePlus"
                          icon={faPlusCircle}
                        />
                        {"  "}
                        <FontAwesomeIcon
                          onClick={() => changeqte(2, p.LotChoisi.Lotid)}
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

export default Nv_bon_sortie;
