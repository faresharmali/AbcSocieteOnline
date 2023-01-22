import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faList,
  faFileImport,
  faStore
} from "@fortawesome/free-solid-svg-icons";
import { TextInput, Button ,RadioGroup} from "react-materialize";
import LoadingScreen from "../utilities/LoadingScreen.jsx";
const Importer = () => {

  let [produits, setProduits] = useState([]);
  let [Loading, showLoading] = useState(false);
  let [Type, setType] = useState("");
  function handleFiles(e) {
    // Check for the various File API support.
    if (window.FileReader) {
      // FileReader are supported.
      getAsText(e.target.files[0]);
    } else {
      alert("FileReader are not supported in this browser.");
    }
  }

  function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
  }

  function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
  }

  function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    let LineToTable = [];
    for (var i = 0; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(";");
      var tarr = [];
      for (var j = 0; j < data.length; j++) {
        tarr.push(data[j]);
      }
      LineToTable = tarr[0].split(",");

      lines.push(LineToTable);
    }

    lines.shift();
    console.log(lines);
    setProduits(lines);

  }

  function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
      alert("Canno't read file !");
    }
  }

  let importData = () => {
    if(Type=="Produits"){
      const { ipcRenderer } = require("electron");
      ipcRenderer.send("importProducts", produits);
      showLoading(true);
    }
    if(Type=="Clients"){
      const { ipcRenderer } = require("electron");
      ipcRenderer.send("importClients", produits);
      showLoading(true);    }
    if(Type=="fournisseurs"){
      const { ipcRenderer } = require("electron");
      ipcRenderer.send("importFournisseurs", produits);
      showLoading(true);    }
  };
  let choosedata=(e)=>{
    document.querySelector("#importform").reset();
    setType(e.target.value)
    setProduits([])
  }
  return (
    <section style={{ padding: "10px" }}>
      {Loading && <LoadingScreen showLoading={showLoading} setProduits={setProduits} />}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faFileImport} /> Importer Les Données
      </h1>
      <div
        style={{ width: "100%", height: "200px" }}
        className="clients_table "
      >
        <div className="Import_container ">
          <h1 className="devis_title">
            {" "}
            <FontAwesomeIcon icon={faStore} /> Importer La liste Des Produits{" "}
          </h1>
      <input onChange={choosedata} value="Produits" id="radioBtn1" type="radio" name="produit"/>
      <label htmlFor="radioBtn1">Produits</label>
      <input onChange={choosedata} id="radioBtn2" type="radio" name="produit" value="Clients"/>
      <label htmlFor="radioBtn2">Clients</label>
      <input onChange={choosedata} id="radioBtn3" type="radio" name="produit" value="fournisseurs"/>
      <label htmlFor="radioBtn3">Fournisseurs</label>
    <form id="importform">
          <TextInput
            id="TextInput-4"
            label="Choisir Un Fichier"
            type="file"
            onChange={handleFiles}
            accept=".csv"
            style={{ backgroundColor: "#dd8d25" }}
          />
          </form>
        </div>
      </div>
      <div style={{ width: "100%" }} className="clients_table ">
        <div className="devis_container flex_center">
          {Type=="Produits" && (
             <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Produits Dans Le Fichier
          </h1>)}
          {Type=="Clients" && (
             <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Clients Dans Le Fichier
          </h1>)}
          {Type=="fournisseurs" && (
             <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Fournisseurs Dans Le Fichier
          </h1>)}
         
        </div>
        <div>
          <div className="devis_container flex_center"></div>
          <table id="customers">
            <thead>
            {Type=="Produits" && (
              <tr>
                <th>Produit</th>
                <th>categorie</th>
                <th>Marque</th>
                <th>Quantité</th>
              </tr>
                 )}
            {Type=="Clients" && (
              <tr>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Adresse</th>
                <th>N° de telephone</th>
              </tr>
                 )}
            {Type=="fournisseurs" && (
              <tr>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Adresse</th>
                <th>N° de telephone</th>
              </tr>
                 )}

            </thead>
            <tbody>
              {Type=="Produits" && (
                  produits.map((p) => (
                    <tr>
                      <td>{p[0]}</td>
                      <td>{p[1]}</td>
                      <td>{p[2]}</td>
                      <td>{p[10]}</td>
                    </tr>
                  ))
              )}
              {Type=="Clients" && (
                  produits.map((p) => (
                    <tr>
                      <td>{p[0]}</td>
                      <td>{p[1]}</td>
                      <td>{p[2]}</td>
                      <td>{p[3]}</td>
                    </tr>
                  ))
              )}
              {Type=="fournisseurs" && (
                  produits.map((p) => (
                    <tr>
                      <td>{p[0]}</td>
                      <td>{p[1]}</td>
                      <td>{p[2]}</td>
                      <td>{p[3]}</td>
                    </tr>
                  ))
              )}
             
            </tbody>
          </table>
          {produits.length > 0 && (
            <Button
              onClick={importData}
              style={{ marginTop: "20px", backgroundColor: "#dd8d25" }}
            >
              {" "}
              <FontAwesomeIcon icon={faFileImport} /> Importer
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Importer;
