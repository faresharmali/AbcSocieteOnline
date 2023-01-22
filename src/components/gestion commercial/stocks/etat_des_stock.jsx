import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faArrowAltCircleDown, faTimesCircle, faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import Bureau_menu from "../../menus/bureau_menu.jsx";
import { Pagination } from "react-materialize";
const Etat_des_stocks = () => {
  const { ipcRenderer } = require("electron");
  let [produitsFaible, setProduitsFaible] = useState([])
  let [PFAffichier, setPFAffichier] = useState([])
  let [PRAffichier, setPRAffichier] = useState([])
  let [produitsRupture, setproduitsRupture] = useState([])
  let [ProduitsNombre, setproduitsNombre] = useState(0)
  useEffect(() => {
    ipcRenderer.send("sendInventory");
    ipcRenderer.on("inventorySendig", (e, result) => {
      setProduitsFaible(result.filter(p => p.p < p.MinQte));
      setPFAffichier(result.filter(p => p.p < p.MinQte && p.p != null && p.p != 0).slice(0, 12));
      setproduitsRupture(result.filter(p => p.p == null ||p.p ==0 ))
      setPRAffichier(result.filter(p => p.p == null ||p.p ==0).slice(0, 12))
      setproduitsNombre(result.length)
    });
  }, []);
  let SetActivePage = (e) => {
    setPFAffichier(produitsFaible.slice((e - 1) * 12, 12 * e));
  };
  let SetActivePage2 = (e) => {
    setPRAffichier(produitsRupture.slice((e - 1) * 12, 12 * e));
  };
  return (
    <section>
      <Bureau_menu />
      <div className="separator_div"></div>

      <h2 style={{ marginBottom: "20px" }} className="section_title">
        <FontAwesomeIcon icon={faChartBar} />   Etat Des Stock
      </h2>

      <div className="stock_stats">
        <div className="stockstat flex_center">Nombre De Produits : {ProduitsNombre}</div>
        <div className="stockstat flex_center"> Rupture De Stock : {produitsRupture.length}</div>
        <div className="stockstat flex_center">Quantité Faible : {produitsFaible.length}</div>
      </div>



      <section className="etatDesStock">
        <div className="etatElement">
          <div className="client_section_heading flex_center" style={{ backgroundColor: "rgb(189, 31, 31)" }}  >
            <h2><FontAwesomeIcon icon={faTimesCircle} /> Rupture de Stock</h2>
          </div>
          <div className="stock_table_container">
            <table id="customers">
              <thead>
                <tr>
                  <th>Produit</th>
                </tr>
              </thead>
              <tbody>
                {PRAffichier.map((p) => (
                  <tr key={p.id}>
                    <td data-th="COUNTRY">{p.nom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "20px" }} className="flex_center">
              <Pagination
                onSelect={SetActivePage2}
                activePage={1}
                items={parseInt(produitsRupture.length / 12) + 1}
                leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
                maxButtons={8}
                rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
              />
            </div>
          </div>
        </div>
        <div className="etatElement">
          <div style={{ backgroundColor: "#dd8d25" }} className="client_section_heading flex_center">
            <h2><FontAwesomeIcon icon={faArrowAltCircleDown} /> Quantité Faible</h2>
          </div>
          <div className="stock_table_container">
            <table id="customers">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>quantité</th>
                </tr>
              </thead>
              <tbody>
                {PFAffichier.map((p) => (
                  <tr key={p.id}>
                    <td data-th="COUNTRY">{p.nom}</td>
                    <td data-th="COUNTRY">{p.quantity} piece</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "20px" }} className="flex_center">
              <Pagination
                onSelect={SetActivePage}
                activePage={1}
                items={parseInt(produitsFaible.length / 12) + 1}
                leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
                maxButtons={8}
                rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Etat_des_stocks;
