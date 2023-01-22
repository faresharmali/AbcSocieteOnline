import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPrint,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button, TextInput } from "react-materialize";
import Succes_popup from "../../utilities/succes_popup.jsx";
import AddProductToDevis from "../addPopups/AddProductToDevis.jsx";

const EditFacture = (Props) => {
  let [Facture, setFacture] = useState(
    Props.FacturesList.filter((x) => x.id == Props.FactureId)[0]
  );
  let [Devis, setDevis] = useState(JSON.parse(Facture.Devis));
  let [date, SetChosenDate] = useState(
    JSON.parse(Facture.date).year +
      "-" +
      (JSON.parse(Facture.date).month < 10
        ? "0" + JSON.parse(Facture.date).month
        : JSON.parse(Facture.date).month) +
      "-" +
      (JSON.parse(Facture.date).day < 10
        ? "0" + JSON.parse(Facture.date).day
        : JSON.parse(Facture.date).day)
  );
  let [Produits, setProduit] = useState(JSON.parse(Devis.produits));
  let [Succes, showSucces] = useState(false);
  let Client = JSON.parse(Devis.client_id);
  let [Lots, setLotList] = useState([]);
  let [Myproducts, setproducts] = useState([]);
  let [categoriesList, setCategorieList] = useState([]);
  let [Depots, setDepots] = useState([]);
  let [AddProdPopup, showAddProduct] = useState(false);
  const { ipcRenderer } = require("electron");
  useEffect(()=>{
    let prix_httt = 0;
    Produits.forEach((p) => {
      prix_httt +=
        (p.prixChoisi - p.prixChoisi * (p.remise / 100)) * p.quantityAchete;
    });
    setDevis({
      ...Devis,
      produits: JSON.stringify(Produits),
      prix_ht: prix_httt,
      prix_ttc:
        prix_httt + prix_httt * 0.19 + (prix_httt + prix_httt * 0.19) * 0.01,
    });
    setFacture({
      ...Facture,
      Devis: JSON.stringify({
        ...Devis,
        produits: JSON.stringify(Produits),
        prix_ht: prix_httt,
        prix_ttc:
          prix_httt + prix_httt * 0.19 + (prix_httt + prix_httt * 0.19) * 0.01,
      }),
    });
  },[Produits])
  useEffect(() => {
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
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

    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  let changeQte = (id, e) => {
    let value = e.target.value;
    if (value.trim() == "") {
      value = 0;
    }
    let error = false;
    Myproducts.forEach((p) => {
      if (p.id == id) {
        if (p.quantity < e.target.value) {
          error = true;
        }
      }
    });
    if (!error) {
      setProduit((Produits) =>
        Produits.map((c) =>
          c.id === id ? { ...c, quantityAchete: parseInt(value) } : { ...c }
        )
      );
    } else {
      alert("Quantité Non Disponible");
    }
  };
  let DeleteProduct = (id) => {
    setProduit(Produits.filter((p) => p.id != id));
 
  };
  let UpdateDevis = () => {

    ipcRenderer.send("UpdateFacture", Facture);
    ipcRenderer.on("UpdateFactureAnswer", (e) => {
      showSucces(true);
    });
    Props.updateDevis();
  };
  const setPrice = (e, product) => {
    let price = e.target.value;
    Produits.forEach((p) => {
      if (p.LotChoisi.Lotid == product.LotChoisi.Lotid) {
        setProduit((Produits) =>
          Produits.map((p) =>
            p.LotChoisi.Lotid === product.LotChoisi.Lotid
              ? { ...p, prixChoisi: price }
              : { ...p }
          )
        );
      }
    });
  };
  const setRemise = (e, product) => {
    let Remise = e.target.value;
    Produits.forEach((p) => {
      if (p.LotChoisi.Lotid == product.LotChoisi.Lotid) {
        setProduit((Produits) =>
          Produits.map((p) =>
            p.LotChoisi.Lotid === product.LotChoisi.Lotid
              ? { ...p, remise: Remise }
              : { ...p }
          )
        );
      }
    });
  };
  const setProductName = (e, product) => {
    let name = e.target.value;
    Produits.forEach((p) => {
      if (p.LotChoisi.Lotid == product.LotChoisi.Lotid) {
        setProduit((Produits) =>
          Produits.map((p) =>
            p.LotChoisi.Lotid === product.LotChoisi.Lotid
              ? { ...p, nom: name }
              : { ...p }
          )
        );
      }
    });
  };
  const setRef = (e, product) => {
    let ref = e.target.value;
    setFacture({ ...Facture, ref: ref });
  };
  const setDate = (e) => {
    let date = e.target.value;
    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8, 10);
    SetChosenDate(year + "-" + month + "-" + day);
    setFacture({ ...Facture, date: JSON.stringify({ year, month, day }) });
  };
  let ajouterProduit = (data) => {
    let produitsch = [...Produits];
    let found;

    produitsch.forEach((e) => {
      if (e.LotChoisi.Lotid === data.SelectedLot.Lotid) {
        found = true;
      }
    });
    if (!found) {
      Myproducts.forEach((s) => {
        if (s.identifier == data.Produit) {
          let e = { ...s };
          if (data.SelectedLot.quantity >= parseInt(data.quantity)) {
            e.quantityAchete = parseInt(data.quantity);
            e.remise = 0;
            e.prixChoisi = e.prix_vente;
            e.LotChoisi = data.SelectedLot;
            produitsch.push(e);
            setProduit(produitsch);
            showAddProduct(false);
          } else {
            alert("Quantité Non Disponible !");
          }
        }
      });
    } else {
      Produits.forEach((p) => {
        if (p.LotChoisi.Lotid == data.SelectedLot.Lotid) {
          if (
            data.SelectedLot.quantity >=
            p.quantityAchete + parseInt(data.quantity)
          ) {
            setProduit((Produits) =>
              Produits.map((c) =>
                c.LotChoisi.Lotid == data.SelectedLot.Lotid
                  ? {
                      ...c,
                      quantityAchete:
                        parseInt(c.quantityAchete) + parseInt(data.quantity),
                    }
                  : { ...c }
              )
            );
            showAddProduct(false);
          } else {
            alert("quantité non disponnible");
          }
        }
      });
    }
  };

  return (
    <section className="Devis_consultation ">
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
      <div className="backBtnContainer">
        <Button onClick={() => Props.pagehandler(10)} className="backBtn">
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faArrowLeft} />
          Revenir
        </Button>
      </div>
      {Succes && <Succes_popup  title={"Facture modifiée"} showSucces={showSucces} type="edit" />}
      <div className="devis_infos_container">
        <div className="devis_details2">
          <div className="Devis_client1">
            <h1 className="Devis_heading_title">Modifier Facture </h1>
            <h1>
              Réf :{" "}
              <span>
                {" "}
                <TextInput
                  onChange={(e) => setRef(e)}
                  min="0"
                  value={Facture.ref}
                />{" "}
              </span>{" "}
            </h1>
            <h1>
              Date:{" "}
              <span>
                <input
                  type="date"
                  name=""
                  id=""
                  onChange={(e) => {
                    setDate(e);
                  }}
                  value={date}
                />
              </span>{" "}
            </h1>
            <Button
              style={{ backgroundColor: "#f8991c" }}
              onClick={() => showAddProduct(true)}
            >
              Ajouter un produit
            </Button>
          </div>

          <div className="Devis_client"></div>
        </div>

        <div className="ProductsTable">
          <div className="product_column flex_center">
            <div className="productItem">Désignation</div>
            <div className="productItem">P/U</div>
            <div className="productItem">Remise(%)</div>
            <div className="productItem">Qte</div>
            <div className="productItem">Action</div>
          </div>
          {Produits.map((p) => (
            <div key={p.id} className="product_column flex_center pColumn2">
              <div className="productItem">
                <TextInput
                  onChange={(e) => setProductName(e, p)}
                  min="0"
                  value={p.nom}
                />{" "}
              </div>
              <div className="productItem">
                <TextInput
                  onChange={(e) => setPrice(e, p)}
                  min="0"
                  value={p.prixChoisi}
                />{" "}
              </div>

              <div className="productItem">
                <TextInput
                  onChange={(e) => setRemise(e, p)}
                  min="0"
                  value={p.remise}
                />{" "}
              </div>
              <input
                onChange={(e) => changeQte(p.id, e)}
                type="number"
                name="qte"
                value={p.quantityAchete}
              />
              <div className="productItem">
                <Button
                  onClick={() => DeleteProduct(p.id)}
                  style={{
                    backgroundColor: "rgb(207, 31, 31)",
                    marginLeft: "10px",
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="client_details_info">
          <h1>
            Client:{" "}
            <span>
              {Client.nom} {Client.prenom}
            </span>
          </h1>
          <h1>
            Adresse: <span>{Client.adresse}</span>
          </h1>
          <h1>
            Numero De Telephone: <span>{Client.num}</span>
          </h1>
        </div>

        <div className="devis_details2 DevisFooter">
          <div className="Devis_client3 flex_center">
          Prix HT :{Devis.prix_ht.toFixed(2)} DA
          </div>
          <div
            style={{ justifyContent: "space-around", paddingRight: "20px" }}
            className="Devis_total flex_center"
          >
            <h2 className="Devis_total_title">
              Prix TTC : {Devis.prix_ttc.toFixed(2)} DA
            </h2>
          </div>
        </div>
        <div className="btns_container flex_center">
          <Button onClick={UpdateDevis}>
            <FontAwesomeIcon icon={faPrint} /> Sauvgarder
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EditFacture;
