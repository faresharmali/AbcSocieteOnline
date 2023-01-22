import React, { useState } from "react";
import { Button,  } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const LoadingScreen = (props) => {
 let [done,setDone]=useState(false)
 setTimeout(() => {
    setDone(true)
    props.setProduits([])
 }, 2000);
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"#1C5161"}} className="confirmation_heading flex_center">Veuillez Patienter !</div>
        <div className="confirmation_form_container">
       {!done && <h1 className="import_title">importation Des Données En Cours...</h1>} 
       {done && <h1 className="import_title">importation Des Données Termineé  <FontAwesomeIcon icon={faCheckCircle} /></h1> }

            <div className="LoadingBarContainer">
        <div className="LoadingBar"></div>
        </div>
        <div className="btns_container flex_center">
         {done && <Button  onClick={()=> props.showLoading(false)} >Fermer</Button>} 
          
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
