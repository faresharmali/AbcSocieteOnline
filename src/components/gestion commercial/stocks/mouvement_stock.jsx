import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faArrowAltCircleDown,
  faArrowCircleUp,
} from "@fortawesome/free-solid-svg-icons";

const Movement_stock = () => {
  let { ipcRenderer } = require("electron");
  let [ProduitsEntreList, setProduitsEntreList] = useState([]);
  let [ProduitsSortieList, setProduitsSortieList] = useState([]);
  useEffect(() => {
    ipcRenderer.send("sendMeBonEntre");
    ipcRenderer.on("BonsEntreSending", (e, result) => {
      let produits=[]
      result.forEach(p=>{
        JSON.parse(p.produits).forEach(x=>{
            produits.push(x)
        })
    })
    setProduitsEntreList(produits)
    });
    ipcRenderer.send("sendMeBonSortie");
    ipcRenderer.on("BonSortieSending", (e, result) => {
      let produitsSortie=[]
      result.forEach(p=>{
        JSON.parse(p.produits).forEach(x=>{
          produitsSortie.push(x)
        })
    })
    setProduitsSortieList(produitsSortie)
    });
  }, []);
  return (
    <section>
      <h2 style={{ marginBottom: "20px" }} className="section_title">
        <FontAwesomeIcon icon={faChartBar} /> Mouvement De Stock
      </h2>

      <div className="stock_stats">
        <div className="stockstat flex_center"> Sortie : {ProduitsSortieList.length} </div>
        <div className="stockstat flex_center">Entrée : {ProduitsEntreList.length}</div>
      </div>
      <section className="etatDesStock">
        <div className="etatElement">
          <div style={{backgroundColor:"rgb(189, 31, 31)"}} className="client_section_heading flex_center">
            <h2>
              <FontAwesomeIcon icon={faArrowAltCircleDown} /> Sortie
            </h2>
          </div>
          <div className="stock_table_container">
            <table id="customers">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>categorie</th>
                  <th>quantité</th>
                </tr>
              </thead>
              <tbody>
              {ProduitsSortieList.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{p.nom}</td>
                  <td data-th="COUNTRY">{p.category}</td>
                 
                  <td data-th="COUNTRY">{p.quantityAchete} piece</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="etatElement">
          <div className="client_section_heading flex_center">
            <h2>
              <FontAwesomeIcon icon={faArrowCircleUp} /> Entrée
            </h2>
          </div>
          <div className="stock_table_container">
            <table id="customers">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>categorie</th>
                  <th>quantité</th>
                </tr>
              </thead>
              <tbody>
              {ProduitsEntreList.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{p.nom}</td>
                  <td data-th="COUNTRY">{p.category}</td>
                 
                  <td data-th="COUNTRY">{p.quantityAchete} piece</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Movement_stock;
