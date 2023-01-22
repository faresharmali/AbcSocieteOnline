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
import NewCategory from "../utilities/newCategory.jsx";
import EditCategory from "../utilities/EditCategory.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";
import getData from "../getData.js";
import { useToasts } from "react-toast-notifications";

const Categories = () => {
  const { addToast } = useToasts();

  let [AddCategory, showAddPopup] = useState(false);
  let [EditCategoryData, showAEditPopup] = useState(false);
  let [DeletePopup, showDeletePopup] = useState(false);
  let [CategoryList, setCategoryList] = useState([]);
  let [CategoryNames, setCategoryNames] = useState([]);
  let [category, setCategory] = useState(null);
  let categoriesNumber = CategoryList.length;
  let [categoriesListAffiché, setCategorieAffiché] = useState([]);
  const { ipcRenderer } = require("electron");
  let SetActivePage = (e) => {
    setCategorieAffiché(CategoryList.slice((e - 1) * 10, 10 * e));
  };
  useEffect(() => {
    getData(addToast, "categories");
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      let Names = [];
      result.forEach((r) => {
        Names.push(r.nom.trim().toUpperCase());
      });
      setCategoryNames(Names);
      setCategoryList(result);
      setCategorieAffiché(result.slice(0, 10));
    });
    ipcRenderer.on("categories", () => {
      addToast("Données Synchronisées Avec Succes !", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendMeCategories");
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let refresher = () => {
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategoryList(result);
    });
  };
  let delete_category = () => {
    ipcRenderer.send("deletecategory", category.id);
    ipcRenderer.on("deletecategoryAnswer", () => {
      console.log("deleted", category.id);
      refresher();
      showDeletePopup(false);
    });
  };
  return (
    <section className="nv_devis">
      {AddCategory && (
        <NewCategory
          CategoryNames={CategoryNames}
          refresher={refresher}
          showAddPopup={showAddPopup}
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
          title={"cette categorie"}
          delete_devis={delete_category}
        />
      )}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faList} /> Categories
      </h1>

      <div style={{ width: "100%", marginTop: "0" }} className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Categories
          </h1>
          <h1 onClick={() => showAddPopup(true)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Nouvelle Categorie
          </h1>
        </div>

        <div>
          <table id="customers">
            <thead>
              <tr className="categories_table">
                <th>N°</th>
                <th style={{ width: "75%" }}>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesListAffiché.map((x) => (
                <tr key={x.id}>
                  <td data-th="COUNTRY">#{x.id}</td>
                  <td data-th="COUNTRY">{x.nom}</td>

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
                    <Button
                      onClick={() => {
                        showAEditPopup(true);
                        setCategory(x);
                      }}
                      style={{
                        marginLeft: "10px",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
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
  );
};

export default Categories;
