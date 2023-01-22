import React from "react";
import { Button,  } from "react-materialize";


const Error = (props) => {
 
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"rgb(207, 31, 31)"}} className="confirmation_heading flex_center">Erreur !</div>
        <div className="confirmation_form_container">
        <div className="confirmation_select">
          <div className="flex_center">
            <h2>Verifier Votre Connection Internet</h2>
          </div>
         
        </div>
        <div className="btns_container flex_center">
          <Button  onClick={()=> props.ShowerrorPP(false)} >Fermer</Button>
          
        </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
