import React, { useState, useEffect } from "react";
import { Button, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashAlt,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import M from "materialize-css";
import Succes_popup from "../utilities/succes_popup.jsx";
import AddProduct from "../utilities/ProduitBarcode.jsx";
import Select from "react-select";
import sync from "../sync.js";
import { useToasts } from "react-toast-notifications";
import Bureau_menu from "../menus/bureau_menu.jsx";
const Nv_devis = (Props) => {
  let { ipcRenderer } = require("electron");
  let [Produit, setProduitId] = useState(0);
  let [quantity, setQuantity] = useState(0);
  let [Myproducts, setproducts] = useState([]);
  let [PrixTotal, setPrixTotal] = useState(0);
  let [categoriesList, setCategorieList] = useState([]);
  let [succes, showSucces] = useState(false);
  let [produitsChoisi, setProduits] = useState([]);
  let [commerciaux, setCommerciauxList] = useState([]);
  let [Lots, setLotList] = useState([]);
  let [MyproductList, setProductsList] = useState(null);
  let [ChosenLots, setChosenLots] = useState([]);
  let [SelectedLot, setLotChoisi] = useState(null);
  let [barcodeProduct, showAddpopup] = useState(false);
  let [scannedProducts, setScannedProducts] = useState([]);
  let [societe, SetSocieteList] = useState({});
  let [clients, setClients] = useState([]);
  let [Depots, setDepots] = useState([]);
  let [ClientChoisi, setClientChoisi] = useState({ nom: "divers", prenom: "" });
  let [TypedBarCode, setTypedBarCode] = useState(null);
  const { addToast } = useToasts();
  const setRemise = (e, id) => {
    let remiseTotal = e.target.value;
    if (!remiseTotal.trim() == "") {
      produitsChoisi.forEach((p) => {
        if (p.LotChoisi.Lotid == id) {
          setProduits((produitsChoisi) =>
            produitsChoisi.map((p) =>
              p.LotChoisi.Lotid === id
                ? { ...p, remise: parseFloat(remiseTotal) }
                : { ...p }
            )
          );
          refresher(0, 0);
        }
      });
    } else {
      produitsChoisi.forEach((p) => {
        if (p.LotChoisi.Lotid == id) {
          setProduits((produitsChoisi) =>
            produitsChoisi.map((p) =>
              p.LotChoisi.Lotid === id ? { ...p, remise: 0 } : { ...p }
            )
          );
          refresher(0, 0);
        }
      });
    }
  };
  const setQte = (e, Lot) => {
    let qte = e.target.value;
    if (Lot.quantity >= qte) {
      produitsChoisi.forEach((p) => {
        if (p.LotChoisi.Lotid == Lot.Lotid) {
          setProduits((produitsChoisi) =>
            produitsChoisi.map((p) =>
              p.LotChoisi.Lotid === Lot.Lotid
                ? { ...p, quantityAchete: qte }
                : { ...p }
            )
          );
          refresher(0, 0);
        }
      });
    } else {
      alert("Quantité Insufisante !");
    }
  };
  const setPrice = (e, product) => {
    let price = e.target.value;
    produitsChoisi.forEach((p) => {
      if (p.LotChoisi.Lotid == product.LotChoisi.Lotid) {
        setProduits((produitsChoisi) =>
          produitsChoisi.map((p) =>
            p.LotChoisi.Lotid === product.LotChoisi.Lotid
              ? { ...p, prixChoisi: price }
              : { ...p }
          )
        );
        refresher(0, 0);
      }
    });
  };
  useEffect(() => {
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
    });
    ipcRenderer.send("GiveMeClients");
    ipcRenderer.on("ClientsBack", (e, result) => {
      setClients(result);
    });
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result[0]);
    });
    ipcRenderer.send("getLots");
    ipcRenderer.on("lotSent", (e, result) => {
      setLotList(result);
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

    ipcRenderer.send("sendMeAgents");
    ipcRenderer.on("sendMeAgentsRep", (e, result) => {
      setCommerciauxList(result);
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  useEffect(() => {
    refresher(0, 0);
  }, [produitsChoisi]);

  let selectCategory = (e) => {
    if (e.value != "tt") {
      let prod = MyproductList.filter((x) => x.category == e.value);
      setproducts(prod);
    } else {
      setproducts(MyproductList);
    }
    setProduitId(0);
  };
  let selectClient = (e) => {
    if (e.value != "Divers") {
      setClientChoisi(e.value);
    } else {
      setClientChoisi({ nom: "divers", prenom: "" });
    }
    setProduitId(0);
  };

  let refresher = (e, id) => {
    let price = 0;
    if (e == 1) {
      produitsChoisi.forEach((x) => {
        if (x.id == id) {
          price += x.prixChoisi * (x.quantityAchete + 1);
        } else {
          price += x.prixChoisi * x.quantityAchete;
        }
      });
    } else if (e == 2) {
      produitsChoisi.forEach((x) => {
        if (x.id == id) {
          price += x.prixChoisi * (x.quantityAchete - 1);
        } else {
          price += x.prixChoisi * x.quantityAchete;
        }
      });
    } else {
      produitsChoisi.forEach(
        (p) =>
          (price +=
            p.prixChoisi * p.quantityAchete -
            p.prixChoisi * p.quantityAchete * (p.remise / 100))
      );
    }
    setPrixTotal(price);
    setQuantity(0);
  };

  let AjouterProduitViaCodeBar = (barcode) => {
    let prod = MyproductList.filter((p) => p.BarCode == barcode);
    if (prod.length > 0) {
      setScannedProducts(prod[0]);
      showAddpopup(true);
    } else {
      alert("Aucun produit ne coresponds a ce code a barres");
    }
  };
  let addProductToList = (data) => {
    let found = false;
    let produitsch = [...produitsChoisi];

    produitsch.forEach((e) => {
      if (e.LotChoisi.Lotid === data.Lot.Lotid) {
        found = true;
      }
    });
    if (!found) {
      MyproductList.forEach((s) => {
        if (s.id == data.prod) {
          let e = { ...s };
          e.quantityAchete = 1;
          e.remise = 0;
          e.prixChoisi = e.prix_vente;
          e.LotChoisi = data.Lot;
          produitsch.push(e);
          setProduits(produitsch);
        }
      });
    } else {
      produitsChoisi.forEach((p) => {
        if (p.LotChoisi.Lotid == data.Lot.Lotid) {
          if (data.Lot.quantity >= p.quantityAchete + parseInt(data.qte)) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((c) =>
                c.LotChoisi.Lotid == data.Lot.Lotid
                  ? {
                      ...c,
                      quantityAchete:
                        parseInt(c.quantityAchete) + parseInt(data.qte),
                    }
                  : { ...c }
              )
            );
            refresher(0, 0);
          } else {
            alert("quantité non disponnible");
          }
        }
      });
    }
    showAddpopup(false);
    setScannedProducts([]);
  };
  let ajouterProduit = () => {
    let produitsch = [...produitsChoisi];
    let found, empty, lots;
    Produit == 0 ? (empty = true) : (empty = false);
    if (!empty) {
      produitsch.forEach((e) => {
        if (e.LotChoisi.Lotid === SelectedLot.Lotid) {
          found = true;
        }
      });
      if (!found) {
        MyproductList.forEach((s) => {
          if (s.identifier == Produit) {
            let e = { ...s };
            if (SelectedLot.quantity >= 1) {
              e.quantityAchete = 1;
              e.remise = 0;
              e.prixChoisi = e.prix_vente;
              e.LotChoisi = SelectedLot;
              produitsch.push(e);
              setProduits(produitsch);
            } else {
              alert("Quantité Non Disponible !");
            }
          }
        });
      } else {
        alert("Produit Exite !");
      }
    } else {
      alert("veuillez choisir un produit !");
    }

    refresher(0, 0);
  };

  let setProduitChoisi = (e) => {
    let lotsChoisi = Lots.filter((x) => x.product == e.value);
    setChosenLots(lotsChoisi);
    let Lot = Lots.filter((x) => x.product == e.value && x.initial == 1);
    setLotChoisi(Lot[0]);
    setProduitId(e.value);
  };
  let setLot = (e) => {
    setLotChoisi(e.value);
  };
  let setPriceType = (e, id) => {
    let product = produitsChoisi.filter((p) => p.LotChoisi.Lotid == id)[0];
    let price;
    switch (e.value) {
      case "detaille":
        price = product.prix_vente;
        break;
      case "gros":
        price = product.prix_gros;
        break;
      case "semi":
        price = product.prix_semi;
        break;
    }
    setProduits((produitsChoisi) =>
      produitsChoisi.map((c) =>
        c.LotChoisi.Lotid == id ? { ...c, prixChoisi: price } : { ...c }
      )
    );
    refresher(0, 0);
  };

  let EnregisterDevis = () => {
    refresher(0, 0);
    let devisObj = {
      Produits: JSON.stringify(produitsChoisi),
      PrixTotal,
      societe: JSON.stringify(societe),
      client: JSON.stringify(ClientChoisi),
    };
    const { ipcRenderer } = require("electron");
    ipcRenderer.send("addbonachat", devisObj);
    produitsChoisi.forEach((p) => {
      ipcRenderer.send("AddVente", {
        ...p,
        client: JSON.stringify({ nom: "Inconnu", prenom: "" }),
        commercial: JSON.stringify(Props.LoggedInUser),
        societe: societe.Identifiant,
      });
    });
    ipcRenderer.send(
      "updateLots",
      produitsChoisi.map((element) =>
        element.id
          ? { ...element, quantityAchete: -element.quantityAchete }
          : element
      )
    );
    setProduits([]);
    sync(addToast)
  };

  let handleScan = () => {
    AjouterProduitViaCodeBar(TypedBarCode);
  };

  const ClientsList = [{ value: "Divers", label: "Client divers" }];
  clients.forEach((c) =>
    ClientsList.push({ value: c, label: c.nom + " " + c.prenom })
  );
  const CategoryList = [{ value: "tt", label: "Categorie divers" }];
  categoriesList.forEach((c) =>
    CategoryList.push({ value: c.nom, label: c.nom })
  );
  const typePrix = [
    { value: "detaille", label: "détail" },
    { value: "semi", label: "semi-gros" },
    { value: "gros", label: "gros" },
  ];

  const commerciauxList = [];
  commerciaux.forEach((c) =>
    commerciauxList.push({
      value: JSON.stringify(c),
      label: c.nom + " " + c.prenom,
    })
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
  const changeBarcode = (e) => {
    setTypedBarCode(e.target.value);
  };
  return (
    <React.Fragment>
      <Bureau_menu />
      <div className="separator_div"></div>
      <section className="contoire">
        {barcodeProduct && (
          <AddProduct
            show={showAddpopup}
            addProductToList={addProductToList}
            Lots={Lots}
            products={scannedProducts}
            Depots={Depots}
          />
        )}
        {succes && <Succes_popup type="ajout" showSucces={showSucces} />}

        <div className=" ">
          <div className="add_product_contoire ">
            <div className="div_headin flex_center">
              <h1 className="nvdevis_title">
                <FontAwesomeIcon icon={faShoppingBag} /> Produit
              </h1>
            </div>
            <div className="codebarSearch flex_center">
              <TextInput
                value={TypedBarCode}
                onChange={changeBarcode}
                label="Code A Barres"
              />
              <Button
                style={{ marginTop: "20px" }}
                floating
                icon={
                  <FontAwesomeIcon
                    style={{ fontSize: "20px" }}
                    icon={faSearch}
                  />
                }
                large
                onClick={handleScan}
                node="button"
                waves="light"
              />
            </div>
            <Select
              styles={customStyles}
              placeholder="Categorie"
              onChange={selectCategory}
              options={CategoryList}
              defaultValue={{ value: "tt", label: "Categorie divers" }}
            />
            <Select
              styles={customStyles}
              placeholder="Client"
              onChange={selectClient}
              options={ClientsList}
              defaultValue={{ label: "Client divers", value: "divers" }}
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
            <div className="contoireBtnContainer flex_center">
              <Button
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
              {produitsChoisi.length > 0 && (
                <div className="contoireBtnContainer flex_center">
                  <Button
                    style={{
                      backgroundColor: " #a03636",
                    }}
                    onClick={() => setProduits([])}
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={EnregisterDevis}
                    style={{
                      backgroundColor: " #1c5161",
                    }}
                  >
                    Valider
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" ">
          <div className="contoireActions flex_center">
            <div></div>

            <div className="totalprice flex_center">{PrixTotal} DA</div>
          </div>
          <div className="devis_produits_table contoire_table">
            <div>
              <table id="customers">
                <thead>
                  <tr style={{ height: "50px" }}>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Désignation
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
                      Montant{" "}
                    </th>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Remise{" "}
                    </th>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Prix Total
                    </th>
                    <th
                      style={{ backgroundColor: "#232e42", fontSize: "18px" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="contoireTable">
                  {produitsChoisi.map((p) => (
                    <tr key={p.LotChoisi.Lotid}>
                      <td data-th="COUNTRY">{p.nom}</td>
                      <td data-th="COUNTRY">
                        <TextInput
                          onChange={(e) => setPrice(e, p)}
                          min="0"
                          value={p.prixChoisi}
                        />
                      </td>

                      <td data-th="COUNTRY">
                        <TextInput
                          onChange={(e) => setQte(e, p.LotChoisi)}
                          min="0"
                          value={p.quantityAchete}
                        />
                      </td>
                      <td data-th="COUNTRY">
                        <Select
                          styles={customStyles}
                          placeholder="détail"
                          onChange={(e) => setPriceType(e, p.LotChoisi.Lotid)}
                          options={typePrix}
                        />
                      </td>
                      <td data-th="COUNTRY">
                        <TextInput
                          onChange={(e) => setRemise(e, p.LotChoisi.Lotid)}
                          min="0"
                          value={p.remise}
                        />
                      </td>

                      <td data-th="COUNTRY">
                        {p.prixChoisi * p.quantityAchete -
                          p.prixChoisi *
                            p.quantityAchete *
                            (p.remise / 100)}{" "}
                        Da
                      </td>
                      <td data-th="COUNTRY">
                        <Button
                          onClick={() => {
                            let price = 0;
                            produitsChoisi.forEach((x) => {
                              if (x.LotChoisi.Lotid != p.LotChoisi.Lotid)
                                price += x.prixChoisi * x.quantityAchete;
                            });
                            setPrixTotal(price);
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
    </React.Fragment>
  );
};

export default Nv_devis;
