import React, { useEffect, useState } from "react";
import { Button, Select,TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle,faEdit } from "@fortawesome/free-solid-svg-icons";

const NewTaxe = (props) => {

  const { ipcRenderer } = require("electron");
  let [nomTaxe,setNom]=useState("")
  let [pourcentage,setpourcentage]=useState("")
  let changeDetails=(e)=>{
    switch(e.target.name){
        case "Nom" :setNom(e.target.value)
        break;
        case "pourcentage" :setpourcentage(e.target.value)
        break;
    }
    }
    let AjouterTaxe=()=>{
        if(nomTaxe.trim()!="" && pourcentage.trim()!=""){          
            const obj={nomTaxe,pourcentage}
            ipcRenderer.send("AddTaxe",obj);
            ipcRenderer.on("AddTaxeAnswer", (e, result) => {
              const checkInternetConnected = require("check-internet-connected");

              props.ShowTaxe(false)
             props.Refresh()
            
            });
        }else{
            alert("tous les champs sont obligatoires")
        }
    }
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"#1c5161"}} className="confirmation_heading flex_center"><FontAwesomeIcon style={{marginRight:"8px"}} icon={faPlusCircle} /> {" "} Ajouter Une Taxe</div>
        <div className="confirmation_form_container">
            <div className="modifyPProduct">
        <TextInput onChange={changeDetails}id="Nom" name="Nom" label=" Nom Du Taxe" />
        <TextInput onChange={changeDetails}  id="pourcentage" name="pourcentage" label="pourcentage du taxe" />
        
        </div>
        <div className="btns_container flex_center">
          <Button onClick={()=> props.ShowTaxe(false)}  >Annuler</Button>
          <Button onClick={AjouterTaxe}  >Ajouter</Button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default NewTaxe;
