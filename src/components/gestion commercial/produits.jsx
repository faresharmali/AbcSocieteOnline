import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faStore,
  faChevronCircleLeft,
  faChevronCircleRight,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Select, Button } from "react-materialize";

import AddProduct from "./addPopups/AddProduct.jsx";
import Modifier_produit_popup from "../utilities/modifier_produits_popup.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";
import getData from "../getData.js";
import { useToasts } from "react-toast-notifications";

const Produits = (Props) => {
  const { ipcRenderer } = require("electron");
  const { addToast } = useToasts();

  let [produits, setproduits] = useState([]);
  let [Category, setCategory] = useState("");

  let [categoryList, setCategoryList] = useState([]);
  let [ProductsNames, setProductsNames] = useState([]);
  let [ListAffiche, setListAffiche] = useState([]);
  let [AddPopup, ShowAddPopup] = useState(false);
  let [deleteDevis, ShowDelete] = useState(false);
  let [showEditPopup, ShowEditPopup] = useState(false);
  let [SelectedProduct, setSelectedProduct] = useState(null);
  let [selectedProduits, SetSelectedProduits] = useState(false);

  let SetActivePage = (e) => {
    setListAffiche(produits.slice((e - 1) * 20, 20 * e));
  };

  useEffect(() => {
    getData(addToast, "produit");
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      let Names = [];
      result.forEach((r) => {
        Names.push(r.nom.trim().toUpperCase());
      });
      setProductsNames(Names);
      setproduits(result);
      setListAffiche(result.slice(0, 20));
    });

    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategoryList(result);
    });
    ipcRenderer.on("ProductToDbAnswer", () => {
      refresher();
    });
    ipcRenderer.on("produit", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendMeProducts");
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  const printData = () => {
    ipcRenderer.send("PrintProduits", {
      title: "Liste Des Produits",
      Data: produits,
      logo: Props.logo,
    });
  };

  let refresher = () => {
    ShowAddPopup(false);
    ipcRenderer.send("sendMeProducts");
  };

  let delete_devis = () => {
    ipcRenderer.send("SendToTrash", { id: selectedProduits, table: "produit" });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeProducts");
      ShowDelete(false);
    });
  };
  let filterData = (e) => {
    if (e.target.name === "nomProduitFilter") {
      if (e.target.value.trim() == "") {
        setListAffiche(produits.slice(0, 20));
      } else {
        setListAffiche(
          produits.filter((x) =>
            x.nom.toUpperCase().includes(e.target.value.toUpperCase())
          )
        );
      }
    } else if (e.target.name === "Barcode") {
      setListAffiche(produits.filter((x) => x.BarCode == e.target.value));
    } else {
      if (e.target.value == "tt") {
        setListAffiche(produits.slice(0, 20));
      } else
        setListAffiche(produits.filter((x) => x.category == e.target.value));
    }
  };
  let Actualiser = () => {
    ipcRenderer.send("sendMeProducts");
  };
  return (
    <section className="nv_devis">
      {deleteDevis && (
        <Delete_popup
          ShowDelete={ShowDelete}
          delete_devis={delete_devis}
          title={"ce Produit"}
        />
      )}
      {showEditPopup && (
        <Modifier_produit_popup
          Actualiser={Actualiser}
          SelectedProduct={SelectedProduct}
          ShowEditPopup={ShowEditPopup}
        />
      )}

      {AddPopup && (
        <AddProduct ProductsNames={ProductsNames} show={ShowAddPopup} />
      )}

      <h1 className="section_title">
        <FontAwesomeIcon icon={faStore} /> Produits
      </h1>

      <div
        style={{ width: "100%", marginTop: "0" }}
        className="clients_table data_table"
      >
        <div className="filter_section">
          <div className="devis_container flex_center">
            <h1 className="title">
              <FontAwesomeIcon icon={faList} />
              {"  "}
              Liste Des Produits
            </h1>
            <div style={{ marginBottom: "10px" }}>
              <Button
                onClick={() => ShowAddPopup(true)}
                style={{ backgroundColor: "#cf7f17", marginRight: "20px" }}
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Ajouter un produit
              </Button>
              <Button
                onClick={printData}
                style={{ backgroundColor: "#cf7f17" }}
              >
                Imprimer
              </Button>
            </div>
          </div>

          <div className="table_filter">
            <Select
              onChange={filterData}
              value={Category}
              name="categoryFilter"
            >
              <option disabled value="">
                {" "}
                Categorie
              </option>
              <option value="tt"> Tous</option>
              {categoryList.map((x) => (
                <option key={x.id} value={x.nom}>
                  {x.nom}
                </option>
              ))}
            </Select>

            <input
              style={{ marginTop: "40px !important" }}
              onChange={filterData}
              type="Text"
              name="nomProduitFilter"
              placeholder="Nom Du Produit"
            />
            <input
              style={{ marginTop: "40px !important" }}
              onChange={filterData}
              type="text"
              name="Barcode"
              placeholder="Code Barre"
            />
          </div>
        </div>
        <div>
          <div className="devis_container flex_center"></div>
          <table id="customers">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Marque</th>
                <th>categorie</th>
                <th>Prix d'achat</th>
                <th>Prix de detaille</th>
                <th>Prix de Semi-Gros</th>
                <th>Prix de Gros</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ListAffiche.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{p.nom}</td>
                  <td data-th="COUNTRY">{p.Marque}</td>
                  <td data-th="COUNTRY">{p.category}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.prix_achat).prix.reduce((a, b) => a + b) /
                      JSON.parse(p.prix_achat).prix.length}{" "}
                    Da
                  </td>
                  <td data-th="COUNTRY">{p.prix_vente} Da</td>
                  <td data-th="COUNTRY">{p.prix_semi} Da</td>
                  <td data-th="COUNTRY">{p.prix_gros} Da</td>
                  <td data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        ShowEditPopup(true);
                        setSelectedProduct(p);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>{" "}
                    <Button
                      onClick={() => {
                        ShowDelete(true);
                        SetSelectedProduits(p.id);
                      }}
                      style={{ backgroundColor: "rgb(207, 31, 31)" }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }} className="flex_center">
            <Pagination
              onSelect={SetActivePage}
              activePage={1}
              items={parseInt(produits.length / 20) + 1}
              leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
              maxButtons={8}
              rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Produits;
