import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faChevronCircleLeft,
  faChevronCircleRight,
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Button } from "react-materialize";
import NewCategory from "../utilities/ajouterLot.jsx";
import EditCategory from "../utilities/EditCategory.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import getData from "../getData.js";

const Lots = (Props) => {
  let [AddCategory, showAddPopup] = useState(false);
  let [EditCategoryData, showAEditPopup] = useState(false);
  let [DeletePopup, showDeletePopup] = useState(false);
  let [CategoryList, setCategoryList] = useState([]);
  let [category, setCategory] = useState(null);
  let [selectedProduct, setSelectedProduct] = useState(null);
  let [selectedDepot, setSelectedDepot] = useState(null);
  let [selectedSociete, setSelectedSociete] = useState(null);
  let [produits, setProducts] = useState([]);
  let [Depots, setDepots] = useState([]);
  let [Societes, setSociete] = useState([]);
  let categoriesNumber = CategoryList.length;
  let [categoriesListAffiché, setCategorieAffiché] = useState([]);
  const { ipcRenderer } = require("electron");
  const { addToast } = useToasts();

  let SetActivePage = (e) => {
    setCategorieAffiché(CategoryList.slice((e - 1) * 10, 10 * e));
  };

  useEffect(() => {
    getData(addToast,"Lots")
    ipcRenderer.send("getLots");

    ipcRenderer.on("lotSent", (e, result) => {
      setCategoryList(result);
      setCategorieAffiché(result.slice(0, 10));
    });
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      setProducts(result);
    });
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
    });
    ipcRenderer.send("getSociete");
    ipcRenderer.on("SocieteSending", (e, result) => {
      setSociete(result);
    });
    ipcRenderer.on("Lots", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("getLots");
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let delete_category = () => {
    ipcRenderer.send("SendToTrash2", { table: "Lots", id: category.Lotid });
    ipcRenderer.on("SendToTrashAnswer2", () => {
      refresher();
      showDeletePopup(false);
    });
  };
  let refresher = () => {
    ipcRenderer.send("getLots");
  };
  const ClientsList = [{ value: "tt", label: "tous" }];
  produits.forEach((c) => ClientsList.push({ value: c, label: c.nom }));
  const DepotList = [{ value: "tt", label: "tous" }];
  Depots.forEach((c) => DepotList.push({ value: c.identifier, label: c.nom }));
  const SocieteList = [{ value: "tt", label: "tous" }];
  Societes.forEach((c) =>
    SocieteList.push({ value: c.Identifiant, label: c.nom })
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
  const selectProduct = (e) => {
    setSelectedProduct(e.value);
  };
  const selectDepot = (e) => {
    setSelectedDepot(e.value);
  };

  const filterdata = () => {
    let data = [...CategoryList];
    if (selectedProduct == "tt") {
      data = data.filter((d) => d.product);
    } else if (selectedProduct) {
      console.log(selectedProduct);
      console.log(data);
      data = data.filter((l) => l.product == selectedProduct.identifier);
    }
    if (selectedDepot == "tt") {
      setCategorieAffiché(CategoryList.slice(0, 10));
    } else if (selectedDepot) {
      data = data.filter((l) => l.depot == selectedDepot);
    }
    if (selectedSociete == "tt") {
      setCategorieAffiché(CategoryList.slice(0, 10));
    } else if (selectedSociete) {
      data = data.filter((l) => l.societe == selectedSociete);
    }
    setCategorieAffiché(data);
  };
  const printData = () => {
    CategoryList.products=produits
    ipcRenderer.send("PrintLots", {
      title: "Lots",
      Data: CategoryList,
      logo: Props.logo,
    });
  };

  return (
    <div>
      {AddCategory && (
        <NewCategory
          produits={produits}
          refresher={refresher}
          show={showAddPopup}
        />
      )}
      {EditCategoryData && (
        <EditCategory
          category={category}
          refresher={refresher}
          showAEditPopup={showAEditPopup}
        />
      )}
      {DeletePopup && (
        <Delete_popup
          ShowDelete={showDeletePopup}
          title={"Ce Lot"}
          delete_devis={delete_category}
        />
      )}
      <section className="nv_devis">
        <h1 className="section_title">
          <FontAwesomeIcon icon={faList} /> Lots
        </h1>

        <div
          style={{ width: "100%", marginTop: "0" }}
          className="clients_table"
        >
          <div className="devis_container flex_center">
            <h1 className="devis_title">
              <FontAwesomeIcon icon={faList} /> Liste Des Lots
            </h1>
            <h1 onClick={() => showAddPopup(true)} className="new_devis">
              <FontAwesomeIcon icon={faPlusCircle} /> Nouveau Lot
            </h1>
          </div>

          <div>
            <div
              style={{ gridTemplateColumns: "1fr 1fr .5fr .5fr" }}
              className="table_filter"
            >
              <div>
                Produit
                <Select
                  placeholder="selectionner un produit"
                  onChange={selectProduct}
                  styles={customStyles}
                  options={ClientsList}
                />
              </div>
              <div>
                Depot
                <Select
                  placeholder="selectionner un Depot"
                  onChange={selectDepot}
                  styles={customStyles}
                  options={DepotList}
                />
              </div>

              <Button onClick={filterdata}>filtrer</Button>
              <Button
                style={{marginLeft:"10px", backgroundColor: "#cf7f17" }}
                onClick={printData}
              >
                Imprimer
              </Button>
            </div>
            <table id="customers">
              <thead>
                <tr className="categories_table">
                  <th>N°</th>
                  <th>Produit</th>
                  <th>Date De Fabrication</th>
                  <th>Date De Péremption</th>
                  <th>Quantité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesListAffiché.map((x) => (
                  <tr key={x.identifier}>
                    <td data-th="COUNTRY">{x.numero}</td>
                    <td data-th="COUNTRY">
                      {produits.find(
                        (element) => element.identifier == x.product
                      ) &&
                        produits.find(
                          (element) => element.identifier == x.product
                        ).nom}
                    </td>
                    <td data-th="COUNTRY">
                      {JSON.parse(x.date_fabrication).day}/
                      {JSON.parse(x.date_fabrication).month}/
                      {JSON.parse(x.date_fabrication).year}{" "}
                    </td>
                    <td data-th="COUNTRY">
                      {JSON.parse(x.date_pre).day}/
                      {JSON.parse(x.date_pre).month}/
                      {JSON.parse(x.date_pre).year}{" "}
                    </td>
                    <td>{x.quantity}</td>
                    <td>
                      <Button
                        onClick={() => {
                          showDeletePopup(true);
                          setCategory(x);
                        }}
                        style={{
                          backgroundColor: "rgb(207, 31, 31)",
                          marginLeft: "10px",
                          width: "35px",
                          height: "35px",
                          padding: "0",
                        }}
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
                items={categoriesNumber / 10 + 1}
                leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
                maxButtons={8}
                rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lots;
