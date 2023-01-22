import React, { useEffect, useState } from "react";
import { Button } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faFileInvoiceDollar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
const Consult_BonSortie = (Props) => {
let [bonEntre,setBonEntre]=useState(null)
let [Produits,setProduits]=useState([])
let [Date,setDate]=useState("")
let { ipcRenderer } = require("electron");

useEffect(()=>{
    ipcRenderer.send("sendMeBonSortie");
    ipcRenderer.on("BonSortieSending", (e, result) => {
      setBonEntre(result.filter(b=>b.id==Props.BonEntreId)[0]);
      setProduits(JSON.parse(result.filter(b=>b.id==Props.BonEntreId)[0].produits));
      setDate(JSON.parse(result.filter(b=>b.id==Props.BonEntreId)[0].date)) 
    });

   
}, []);
let printPage = () => {
  ipcRenderer.send("PrintBonSortie",{...bonEntre,logo: Props.logo})
    };
  return (
    <section className="Devis_consultation ">
    <div className="backBtnContainer">
      <Button onClick={()=>Props.pagehandler(20)} className="backBtn"><FontAwesomeIcon style={{marginRight:"10px"}} icon={faArrowLeft} />Revenir</Button>
      </div>
      <div className="devis_infos_container">
        <div className="devis_details2">
          <div className="Devis_client1">
            <h1 className="Devis_heading_title">Bon De Sortie </h1>
            <h1>
              Réf : <span>{" "}{bonEntre && bonEntre.ref}</span>{" "}
            </h1>
            <h1>
              Date: <span>{Date.day}/{Date.month}/{Date.year}</span>{" "}
            </h1>
          </div>
          <div className="Devis_client1 ">
          <h1 className="Devis_heading_title">Client </h1>
           <h1 className="societe_details"> Nom: <span>{bonEntre && JSON.parse(bonEntre.client).nom} {bonEntre && JSON.parse(bonEntre.client).prenom}</span></h1>
           <h1 className="societe_details"> Adresse: <span>{bonEntre && JSON.parse(bonEntre.client).adresse}</span></h1>
           <h1 className="societe_details"> Numero Du Telephone: <span>{bonEntre && JSON.parse(bonEntre.client).num}</span></h1>
           
          </div>
        
        </div>

        <div className="ProductsTable">
          <div className="product_column flex_center">
            <div style={{width:"110%"}} className="productItem">Produit</div>
            <div className="productItem">Categorie</div>
            <div className="productItem">Prix</div>
            <div className="productItem">Quantité</div>
            <div className="productItem">Prix Total</div>
          </div>
         
         {Produits.map(p=>(
             <div className="product_column flex_center">
             <div style={{width:"110%"}} className="productItem">{p.nom}</div>
             <div className="productItem">{p.category}</div>
             <div className="productItem">{p.prixChoisi} DA</div>
             <div className="productItem">{p.quantityAchete} Piece</div>
             <div className="productItem">{p.prixChoisi*p.quantityAchete} DA</div>
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

export default Consult_BonSortie;
