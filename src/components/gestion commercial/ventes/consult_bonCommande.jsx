import React, { useEffect, useState } from "react";
import { Button } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faFileInvoiceDollar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
const Consult_BonCommande = (Props) => {
let [bonCommande,setbonCommande]=useState(null)
let [Date,setDate]=useState("")

let [Produits,setProduits]=useState([])
let { ipcRenderer } = require("electron");

useEffect(()=>{
    ipcRenderer.send("sendMeBonCommande");
    ipcRenderer.on("BonCommandeSending", (e, result) => {
      setbonCommande(result.filter(b=>b.id==Props.BonCommandeId)[0]);
      setProduits(JSON.parse(result.filter(b=>b.id==Props.BonCommandeId)[0].produits));
      setDate(JSON.parse(result.filter(b=>b.id==Props.BonCommandeId)[0].date))
    });

}, []);
let printPage = () => {
  ipcRenderer.send("PrintBonCommande",{...bonCommande,logo: Props.logo})
    };
  return (
    <section className="Devis_consultation ">
   <div className="backBtnContainer">
      <Button onClick={()=>Props.pagehandler(27)} className="backBtn"><FontAwesomeIcon style={{marginRight:"10px"}} icon={faArrowLeft} />Revenir</Button>
      </div>
      <div className="devis_infos_container">
        <div className="devis_details2">
          <div className="Devis_client1">
            <h1 className="Devis_heading_title">Bon Commande </h1>
            <h1>
              Réf : <span>{" "}{bonCommande && bonCommande.ref}</span>{" "}
            </h1>
            <h1>
            Date: <span>{Date.day}/{Date.month}/{Date.year}</span>{" "}
            </h1>
          </div>
          <div className="Devis_client1 ">
          <h1 className="Devis_heading_title">Fournisseur </h1>
           <h1 className="societe_details"> fournisseur: <span>{bonCommande && JSON.parse(bonCommande.Fournisseur).Nom} {bonCommande && JSON.parse(bonCommande.Fournisseur).prenom}</span></h1>
           <h1 className="societe_details"> Adresse: <span>{bonCommande && JSON.parse(bonCommande.Fournisseur).adresse}</span></h1>
           <h1 className="societe_details"> Numero Du Telephone: <span>{bonCommande && JSON.parse(bonCommande.Fournisseur).num}</span></h1>
           
          </div>
        
        </div>

        <div className="ProductsTable">
          <div className="product_column flex_center">
            <div style={{width:"110%"}} className="productItem">Désignation</div>
            <div className="productItem">Categorie</div>
            <div className="productItem">P/U</div>
            <div className="productItem">Qte</div>
            <div className="productItem">Montant total</div>
          </div>
         
         {Produits.map(p=>(
             <div className="product_column flex_center">
             <div style={{width:"110%"}} className="productItem">{p.nom}</div>
             <div className="productItem">{p.category}</div>
             <div className="productItem">{(JSON.parse(p.prix_achat).prix.reduce((a,b)=>a+b)/JSON.parse(p.prix_achat).prix.length)} DA</div>
             <div className="productItem">{p.quantityAchete} Piece</div>
             <div className="productItem">{(JSON.parse(p.prix_achat).prix.reduce((a,b)=>a+b)/JSON.parse(p.prix_achat).prix.length)*p.quantityAchete} DA</div>
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

export default Consult_BonCommande;
