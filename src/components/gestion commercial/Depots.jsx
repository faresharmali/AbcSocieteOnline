import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faChevronCircleLeft,
  faChevronCircleRight,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Button } from "react-materialize";
import NewCategory from "../utilities/ajouterDepot.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";
import { useToasts } from "react-toast-notifications";
import getData from "../getData.js";
const Categories = () => {
  let [AddCategory, showAddPopup] = useState(false);
  let [DeletePopup, showDeletePopup] = useState(false);
  let [CategoryList, setCategoryList] = useState([]);
  let [category, setCategory] = useState(null);
  let categoriesNumber = CategoryList.length;
  let [categoriesListAffiché, setCategorieAffiché] = useState([]);
  const { ipcRenderer } = require("electron");
  const { addToast } = useToasts();
  let SetActivePage = (e) => {
    setCategorieAffiché(CategoryList.slice((e - 1) * 10, 10 * e));
  };
  let refresher = () => {
    ipcRenderer.send("getDepots");
  };
  useEffect(() => {
    getData(addToast,"depots")
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setCategoryList(result);
      setCategorieAffiché(result.slice(0, 10));
    });

    ipcRenderer.on("depots", (e, result) => {
      refresher();
    });
    ipcRenderer.on("AddDepotRep", (e, result) => {
      refresher();
    });
  
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let delete_category = () => {
    ipcRenderer.send("SendToTrash", { table: "depots", id: category.id });
    ipcRenderer.on("SendToTrashAnswer", () => {
      refresher();
      showDeletePopup(false);
    });
  };

  return (
    <section className="nv_devis">
      {AddCategory && <NewCategory refresher={refresher} show={showAddPopup} />}

      {DeletePopup && (
        <Delete_popup
          ShowDelete={showDeletePopup}
          title={"Ce Lot"}
          delete_devis={delete_category}
        />
      )}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faList} /> Depots
      </h1>

      <div style={{ width: "100%", marginTop: "0" }} className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Depots
          </h1>
          <h1 onClick={() => showAddPopup(true)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Nouveau Depot
          </h1>
        </div>

        <div>
          <table id="customers">
            <thead>
              <tr className="categories_table">
                <th>N°</th>

                <th>Nom de depot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesListAffiché.map((x) => (
                <tr key={x.id}>
                  <td data-th="COUNTRY">{x.id}</td>
                  <td>{x.nom}</td>
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
  );
};

export default Categories;
