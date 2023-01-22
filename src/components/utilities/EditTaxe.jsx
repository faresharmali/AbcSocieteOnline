import React, { useEffect, useState } from "react";
import { Button, Select,TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs,faEdit } from "@fortawesome/free-solid-svg-icons";

const EditTaxe = (props) => {

  const { ipcRenderer } = require("electron");
  let [taxe , settaxe]=useState(props.taxe)
  let changeDetails=(e)=>{
    switch(e.target.name){
        case "Nom" :settaxe({...taxe,nom:e.target.value})
        break;
        case "pourcentage" :settaxe({...taxe,pourcentage:e.target.value})
        break;
       
    }
    }
    let Updatesociete=()=>{
        ipcRenderer.send("UpdateTaxe",taxe);
        ipcRenderer.on("UpdateTaxeAnswer", (e, result) => {
         console.log("updated")
         props.ShowEdit(false)
         props.Refresh()
        
        });
    }
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"#1c5161"}} className="confirmation_heading flex_center"><FontAwesomeIcon style={{marginRight:"8px"}} icon={faEdit} /> {" "} Modifier Une Taxe</div>
        <div className="confirmation_form_container">
            <div className="modifyPProduct">
        <TextInput onChange={changeDetails} value={taxe.nom} id="Nom" name="Nom" label=" Nom Du Taxe" />
        <TextInput onChange={changeDetails} value={taxe.pourcentage} id="pourcentage" name="pourcentage" label="Pourcentage" />
       </div>
        <div className="btns_container flex_center">
          <Button onClick={()=> props.ShowEdit(false)}  >Annuler</Button>
          <Button onClick={Updatesociete}  >Modifier</Button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default EditTaxe;
