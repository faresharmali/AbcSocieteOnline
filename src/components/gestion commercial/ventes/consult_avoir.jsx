import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTruck, faPrint,faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";

const Consult_Avoir = (Props) => {
    let [avoir,setAvoir]=useState(null)
    let  [produits , setProduits]=useState([])
  const { ipcRenderer } = require("electron");
  useEffect(() => {
    ipcRenderer.send("getAvoir",Props.AvoirId);
    ipcRenderer.on("getAvoirAnswer", (e, result) => {
        setAvoir(result[0])
        setProduits(JSON.parse(result[0].produits))
        });
        
  }, []);
  let printPage = () => {
    ipcRenderer.send("PrintBonAvoir",{...avoir,logo: Props.logo})
      };
  return (
    <section className="Devis_consultation ">
       <div className="backBtnContainer">
      <Button onClick={()=>Props.pagehandler(16)} className="backBtn"><FontAwesomeIcon style={{marginRight:"10px"}} icon={faArrowLeft} />Revenir</Button>
      </div>
      <div className="devis_infos_container">
        <div className="devis_details2">
          <div className="Devis_client1">
            <h1 className="Devis_heading_title">Bon de retour </h1>
            <h1>
              Réf : <span>{avoir && avoir.ref}</span>{" "}
            </h1>
            <h1>
              Date: 
              {" "}
              {avoir && <span>
                {JSON.parse(avoir.date).day}/
                {JSON.parse(avoir.date).month}/
                {JSON.parse(avoir.date).year}
              </span> }
             {" "}
               
            </h1>
          </div>
          <div className="Devis_client"></div>
        </div>

        <div className="ProductsTable">
          <div className="product_column flex_center">
            <div className="productItem">Produit</div>
            <div className="productItem">Categorie</div>

            <div className="productItem">Prix</div>
            <div className="productItem">Quantité</div>
            <div className="productItem">Prix Total</div>
          </div>
          {produits.map((p) => (
            <div key={p.id} className="product_column flex_center">
              <div className="productItem">{p.nom}</div>
              <div className="productItem">{p.category}</div>
              <div className="productItem">{p.prix_vente} DA</div>
              <div className="productItem">{p.quantityAchete} Pieces</div>
              <div className="productItem">
                {p.prix_vente * p.quantityAchete} DA
              </div>
            </div>
          ))}
        </div>
     
        <div className="btns_container flex_center">
          <Button onClick={printPage}>Imprimer</Button>
         
        </div>
      
      </div>
    </section>
  );
};

export default Consult_Avoir;
