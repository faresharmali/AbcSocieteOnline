import React, { Component, useState, useEffect } from "react";
import { Button, Icon, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faFileInvoiceDollar,
  faUser,
  faPlus,
  faMinusCircle,
  faTrashAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import M from "materialize-css";
import Succes_popup from "../../utilities/succes_popup.jsx";
import BarcodeReader from "react-barcode-reader";
import AddProduct from "../../utilities/ProduitBarcode.jsx";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import sync from "../../sync.js";
import AddProductToDevis from "../addPopups/AddProductToDevis.jsx";

const Nv_devis = (Props) => {
  let { ipcRenderer } = require("electron");
  let [Client, setClientId] = useState(null);
  let [Myproducts, setproducts] = useState([]);
  let [PrixTotal, setPrixTotal] = useState(0);
  let [categoriesList, setCategorieList] = useState([]);
  let [succes, showSucces] = useState(false);
  let [produitsChoisi, setProduits] = useState([]);
  let [Societe, SetSocieteList] = useState([]);
  let [commerciaux, setCommerciauxList] = useState([]);
  let [clients, setClientList] = useState([]);
  let [Lots, setLotList] = useState([]);
  let [CommercialChoisi, setCommerciauxChosen] = useState(null);
  let [barcodeProduct, showAddpopup] = useState(false);
  let [AddProdPopup, showAddProduct] = useState(false);
  let [scannedProducts, setScannedProducts] = useState([]);
  let [TypedBarCode, setTypedBarCode] = useState("");
  let [Depots, setDepots] = useState([]);
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
  useEffect(() => {
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
    });
    ipcRenderer.send("GiveMeClients");
    ipcRenderer.on("ClientsBack", (e, result) => {
      setClientList(result);
      setClientId(result[result.length-1])
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
      setproducts(result);
    });

    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result);
    });
    ipcRenderer.send("sendMeAgents");
    ipcRenderer.on("sendMeAgentsRep", (e, result) => {
      setCommerciauxChosen(result[0]);
      setCommerciauxList(result);
    });
    ipcRenderer.on("DevisInsertAnswer", (e, result) => {
      setProduits([]);
      Props.pagehandler(4);
      sync(addToast);
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  useEffect(() => {
    refresher(0, 0);
  }, [produitsChoisi]);

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
  };

  let AjouterProduitViaCodeBar = (barcode) => {
    let prod = Props.productList.filter((p) => p.BarCode == barcode);
    if (prod.length > 0) {
      setScannedProducts(prod[0]);
      showAddpopup(true);
    } else {
      alert("Aucun produit ne correspond avec ce code a barres");
    }
    setTypedBarCode("")
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
      Props.productList.forEach((s) => {
        if (s.id == data.prod) {
          let e = { ...s };
          e.quantityAchete = parseInt(data.qte);
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
  let ajouterProduit = (data) => {
    let produitsch = [...produitsChoisi];
    let found;

    produitsch.forEach((e) => {
      if (e.LotChoisi.Lotid === data.SelectedLot.Lotid) {
        found = true;
      }
    });
    if (!found) {
      Props.productList.forEach((s) => {
        if (s.identifier == data.Produit) {
          let e = { ...s };
          if (data.SelectedLot.quantity >= parseInt(data.quantity)) {
            e.quantityAchete = parseInt(data.quantity);
            e.remise = 0;
            e.prixChoisi = e.prix_vente;
            e.LotChoisi = data.SelectedLot;
            produitsch.push(e);
            setProduits(produitsch);
            showAddProduct(false);
          } else {
            alert("Quantité Non Disponible !");
          }
        }
      });
    } else {
      produitsChoisi.forEach((p) => {
        if (p.LotChoisi.Lotid == data.SelectedLot.Lotid) {
          if (
            data.SelectedLot.quantity >=
            p.quantityAchete + parseInt(data.quantity)
          ) {
            setProduits((produitsChoisi) =>
              produitsChoisi.map((c) =>
                c.LotChoisi.Lotid == data.SelectedLot.Lotid
                  ? {
                      ...c,
                      quantityAchete:
                        parseInt(c.quantityAchete) + parseInt(data.quantity),
                    }
                  : { ...c }
              )
            );
            refresher(0, 0);
            showAddProduct(false);
          } else {
            alert("quantité non disponnible");
          }
        }
      });
    }

    refresher(0, 0);
  };
  let setClientChoisi = (e) => {
    setClientId(e.value);
  };

  let setCommerciauxChoisi = (e) => {
    setCommerciauxChosen(e.value);
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
    if (Client && CommercialChoisi) {
      refresher(0, 0);
      let devisObj = {
        clientID: JSON.stringify(Client),
        Produits: JSON.stringify(produitsChoisi),
        prixT: PrixTotal,
        prixTTC: PrixTotal + PrixTotal * 0.19,
        commercial: JSON.stringify(CommercialChoisi),
        societe: Societe[0],
      };
      console.log(devisObj);
      const { ipcRenderer } = require("electron");
      ipcRenderer.send("AddDevis", devisObj);
    } else {
      alert("les champs client et societe sont obligatoires");
    }
  };

  let handleScan = () => {
    AjouterProduitViaCodeBar(TypedBarCode);
  };


  const ClientsList = [];
  clients.forEach((c) =>
    ClientsList.push({ value: c, label: c.nom + " " + c.prenom })
  );
  const CategoryList = [{ value: "tt", label: "tous" }];
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
      value:c,
      label: c.nom + " " + c.prenom,
    })
  );
  const ChosenProducts = [];
  Myproducts.forEach((c) =>
    ChosenProducts.push({ value: c.identifier, label: c.nom })
  );
  const ChosenDepots = [];
  Depots.forEach((c) =>
    ChosenDepots.push({ value: c.identifier, label: c.nom })
  );

  const ChosenSociete = [];
  Societe.forEach((c) => ChosenSociete.push({ value: c, label: c.nom }));
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
  return (
    <React.Fragment>
      {AddProdPopup && (
        <AddProductToDevis
          categoriesList={categoriesList}
          Myproducts={Myproducts}
          Depots={Depots}
          Lots={Lots}
          ajouterProduit={ajouterProduit}
          show={showAddProduct}
        />
      )}
      {barcodeProduct && (
        <AddProduct
          show={showAddpopup}
          addProductToList={addProductToList}
          Lots={Lots}
          Depots={Depots}
          products={scannedProducts}
        />
      )}
      <section className="nv_devis2">
        <h1 className="section_title">
          <FontAwesomeIcon icon={faFileInvoiceDollar} /> Nouveau devis
        </h1>

        {succes && <Succes_popup type="ajout" showSucces={showSucces} />}

        <div className="add_product_contoire2 ">
          <div className="div_headin flex_center">
            <h1 className="nvdevis_title">
              <FontAwesomeIcon icon={faUser} /> Ajouter produit
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
              placeholder="Commerciale"
              onChange={setCommerciauxChoisi}
              options={commerciauxList}
              defaultValue={{ label: "Admin", value: commerciaux[0] }}
            />
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
            <Button
              style={{
                backgroundColor: " #1c5161",
              }}
              onClick={() => showAddProduct(true)}
            >
              Ajouter un Produit{" "}
            </Button>
            {produitsChoisi.length > 0 && (
              <Button
                onClick={EnregisterDevis}
                style={{
                  backgroundColor: " #cf7f17",
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
                <tbody  className="contoireTable">
                  {produitsChoisi.map((p) => (
                    <tr key={p.LotChoisi.Lotid}>
                      <td data-th="COUNTRY">{p.nom}</td>
                      <TextInput
                        onChange={(e) => setPrice(e, p)}
                        min="0"
                        value={p.prixChoisi}
                      />{" "}
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
                          label="Remise"
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
                  {produitsChoisi.length > 0 && (
                    <React.Fragment>
                      <tr>
                        <td
                          style={{ backgroundColor: "#1C5161", color: "#fff" }}
                          data-th="COUNTRY"
                        >
                          Total HT
                        </td>
                        <td data-th="COUNTRY">{PrixTotal} Da</td>
                      </tr>
                    </React.Fragment>
                  )}
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
