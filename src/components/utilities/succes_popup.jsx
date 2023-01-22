import React from "react";
import { Button,  } from "react-materialize";


const Succes_popup = (props) => {
 
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"#1C5161"}} className="confirmation_heading flex_center">Message</div>
        <div className="confirmation_form_container">
        <div className="confirmation_select">
          <div className="flex_center">
            {props.type=="edit" && <h2>{props.title} avec succes !</h2> }
            {props.type=="ajout" &&  <h2>Devis ajouté avec succes !</h2> }
            {props.type=="ajoutBon" &&  <h2>Bon d'entrée ajouté Avec succes !</h2> }
           
          </div>
         
        </div>
        <div className="btns_container flex_center">
          <Button  onClick={()=> props.showSucces(false)} >Fermer</Button>
          
        </div>
        </div>
      </div>
    </div>
  );
};

export default Succes_popup;
