import React, { useEffect,useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faFileExport, 
  faStoreAlt, 
  faTruck, 
faUsers
} from "@fortawesome/free-solid-svg-icons";
const Exporter = () => {

    let { ipcRenderer } = require("electron");
    let [produits,setProduits]=useState([])
    let [clients,setClients]=useState([])
    let [fournisseurs,setFournisseurs]=useState([])
    useEffect(() => {
        ipcRenderer.send("sendMeProducts");
        ipcRenderer.on("ProductsSending", (e, result) => {
            let array=[]
            let ProductsArray=[];
            result.forEach(p=>{
                array=[];
                array.push(p.nom)
                array.push(p.category)
                array.push(p.Marque)
                array.push(p.prix_achat)
                array.push(p.prix_vente)
                array.push(p.prix_gros)
                array.push(p.prix_semi)
                array.push(p.MinQte)
                array.push(p.profit)
                array.push(p.BarCode)
                array.push(p.quantity)
                ProductsArray.push(array)
              })
              console.log(ProductsArray)
            setProduits(ProductsArray)
          
        });
        console.log(produits)
        ipcRenderer.send("windowReady");
        ipcRenderer.on("resultsent", (e, result) => {
          let array=[]
          let ProductsArray=[];
          result.forEach(p=>{
              array=[];
              array.push(p.nom)
              array.push(p.prenom)
              array.push(p.adresse)
              array.push(p.num)
              ProductsArray.push(array)

             
          })
          setClients(ProductsArray);
        });
        ipcRenderer.send("sendMeFournisseurs");
        ipcRenderer.on("FournisseursSending", (e, result) => {
          let array=[]
          let ProductsArray=[];
          result.forEach(p=>{
              array=[];
              array.push(p.Nom)
              array.push(p.prenom)
              array.push(p.adresse)
              array.push(p.num)
              ProductsArray.push(array)

             
          })

            setFournisseurs(ProductsArray);
        });
    },[])
    let generateCsv=(data,type)=>{
        let heading;
        let title;
       if(type=="produits"){ heading="Nom de Produit,Categorie,Marque,Prix d'achat,Prix De Detail,Prix De Gros, Prix Semi-gros,Quantite Min,Marge De Profit , Code a Barre , Quantite\n";title="Liste des produits.csv"}
       if(type=="clients"){ heading="Nom,Prenom,Adresse,Numero De Telephone\n";title="Liste des Clients.csv" }
       if(type=="fournisseurs"){ heading="Nom,Prenom,Adresse,Numero De Telephone\n";title="Liste des Fournisseurs.csv" }
             var csv = heading;
             data.forEach(function(row) {
                     csv += row.join(',');
                     csv += "\n";
             });
          
             var hiddenElement = document.createElement('a');
             hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
             hiddenElement.target = '_blank';
             hiddenElement.download = title;
             hiddenElement.click();      
    }

    return (
        <section className="nv_devis">
        <h1 className="section_title">
        <FontAwesomeIcon icon={faFileExport} /> Exporter Des Données
      </h1>
      <div style={{ width: "100%",paddingTop:"80px" }} className="clients_table data_table">
      <div style={{position:"relative"}} className="stat_element_heading flex_center exportHeading">
            <h1>Selectionner Les Données à Exporter...</h1>
          </div>
       
        <div className="devis_container flex_center">
      <h1 className="devis_title"><FontAwesomeIcon icon={faUsers} /> Exporter La liste Des Clients</h1>
      <button className="exportBtn" onClick={()=>generateCsv(clients,"clients")}><FontAwesomeIcon icon={faFileExport} /> exporter </button>

      </div>
        <div className="devis_container flex_center">
      <h1 className="devis_title"><FontAwesomeIcon icon={faStoreAlt} /> Exporter La liste Des Produits</h1>
      <button className="exportBtn" onClick={()=>generateCsv(produits,"produits")}><FontAwesomeIcon icon={faFileExport} /> exporter</button>

      </div>
        <div className="devis_container flex_center">
      <h1 className="devis_title"><FontAwesomeIcon icon={faTruck} /> Exporter La liste Des Fournisseurs</h1>
      <button className="exportBtn" onClick={()=>generateCsv(fournisseurs,"fournisseurs")}><FontAwesomeIcon icon={faFileExport} /> exporter</button>

      </div>
       
      </div>
    </section>







     );
}
 
export default Exporter;