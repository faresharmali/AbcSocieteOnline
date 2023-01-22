import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faCogs, faEdit, faTrashAlt, faCheckDouble, faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { Pagination, TextInput, Button } from "react-materialize";
import Modifier_produit_popup from "../../utilities/modifier_produits_popup.jsx"
import Delete_popup from "../../utilities/Delete_popup.jsx"

const Parametrer_produits = () => {
  const { ipcRenderer } = require("electron");
  let [productList, setProducts] = useState([]);
  let [products, setProductList] = useState([]);
  let [SelectedProduct, setSelectedProduct] = useState(null);
  let [howEditPopup, ShowEditPopup] = useState(false);
  let [Succes, showSucces] = useState(false);
  let [deleteDevis, ShowDelete] = useState(false)
  let [selectedProduits, SetSelectedProduits] = useState(false)

  useEffect(() => {
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      setProducts(result.slice(0, 20));
      setProductList(result);
    });

  }, [])
  let Actualiser = () => {
    ipcRenderer.send("sendMeProducts");

  }
  let Changesucces = () => {
    showSucces(true)
    setTimeout(() => {
      showSucces(false)
    }, 2000);
  }
  let delete_devis = () => {
    ipcRenderer.send("SendToTrash", { id: selectedProduits, table: "produit" });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeProducts");
      ShowDelete(false)
    });

  }
  let SetActivePage = (e) => {
    setProducts(products.slice((e - 1) * 20, 20 * e));
  };
  let filterData = (e) => {
    if(e.target.name=="nomProduitFilter"){
      if (e.target.value.trim() == "") {
        setProducts(products.slice(0, 20))
      } else {
        setProducts(
          products.filter((x) =>
            x.nom.toUpperCase().includes(e.target.value.toUpperCase())
          )
        );

      }
    }else{
      if (e.target.value.trim() == "") {
        setProducts(products.slice(0, 20))
      } else {
      setProducts(products.filter((x) => x.BarCode == e.target.value));
      }
    }
  };

  return (
    <section className="nv_devis">
      {deleteDevis && <Delete_popup ShowDelete={ShowDelete} delete_devis={delete_devis} title={"ce Produit"} />}
      {showEditPopup && <Modifier_produit_popup Changesucces={Changesucces} Actualiser={Actualiser} SelectedProduct={SelectedProduct} ShowEditPopup={ShowEditPopup} />}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faCogs} /> Parametrer Les Produits
      </h1>

      <div
        style={{ width: "100%", marginTop: "0" }}
        className="clients_table"
      >

        <div>
          <h1 style={{ fontSize: "22px" }}>
            <FontAwesomeIcon icon={faList} />
            {"  "}
            Liste Des Produits
          </h1>
          
        <div className="filter_section">
        
          <div  className="table_filter2" >
            <TextInput
              style={{ marginTop: "40px !important",marginRight:"30px !important" }}
              onChange={filterData}
              type="Text"
              name="nomProduitFilter"
              label="Nom Du Produit"
            />
            <TextInput
              style={{ marginTop: "40px !important" }}
              onChange={filterData}
              type="text"
              name="Barcode"
              label="Code Barre"
            />
          </div>
        </div>
          {Succes && <h2 className="notification"> <FontAwesomeIcon icon={faCheckDouble} /> produit modifié avec succes !</h2>}
          <table id="customers">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix d'achat</th>
                <th>Prix de Detaille</th>
                <th>Prix de Semi-Gros</th>
                <th>Prix de Gros</th>
                <th>quantité minimal</th>
                <th>Profit %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{p.nom}</td>
                  <td data-th="COUNTRY">{p.prix_achat} Da</td>
                  <td data-th="COUNTRY">{p.prix_vente} Da</td>
                  <td data-th="COUNTRY">{p.prix_semi} Da</td>
                  <td data-th="COUNTRY">{p.prix_gros} Da</td>
                  <td data-th="COUNTRY">{p.MinQte} piece</td>
                  <td data-th="COUNTRY">{p.profit}%</td>
                  <td data-th="COUNTRY"><Button onClick={() => { ShowEditPopup(true); setSelectedProduct(p) }}><FontAwesomeIcon icon={faEdit} /></Button>{" "}<Button onClick={() => { ShowDelete(true); SetSelectedProduits(p.id) }} style={{ backgroundColor: "rgb(207, 31, 31)" }}><FontAwesomeIcon icon={faTrashAlt} /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }} className="flex_center">
            <Pagination
              onSelect={SetActivePage}
              activePage={1}
              items={parseInt(products.length / 20) + 1}
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

export default Parametrer_produits;
