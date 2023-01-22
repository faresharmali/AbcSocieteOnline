import React from "react";
import { Button,  } from "react-materialize";


const Delete_popup = (props) => {
 
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"rgb(207, 31, 31)"}} className="confirmation_heading flex_center">Attention !</div>
        <div className="confirmation_form_container">
        <div className="confirmation_select">
          <div className="flex_center">
            <h2>Voulez-vous Vraiment supprimer  {props.title} ?!</h2>
          </div>
         
        </div>
        <div className="btns_container flex_center">
          <Button  onClick={()=> props.ShowDelete(false)} >Annuler</Button>
          <Button  onClick={()=> props.delete_devis()} >Supprimer</Button>
          
        </div>
        </div>
      </div>
    </div>
  );
};

export default Delete_popup;
