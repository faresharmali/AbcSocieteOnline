import React, { useEffect, useState } from "react";
import { Button, Select,TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs,faDollarSign,faEdit } from "@fortawesome/free-solid-svg-icons";
const ReglementConfirmation = (props) => {
const [montant,setMontant]=useState(0)
const ChangeData=(e)=>{
  setMontant(e.target.value)
}
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"#1c5161"}} className="confirmation_heading flex_center"><FontAwesomeIcon style={{marginRight:"8px"}} icon={faEdit} /> {" "}Confirmer Le Paiment</div>
        <div className="confirmation_form_container">
            <TextInput 
              label="montant"
              icon={<FontAwesomeIcon icon={faDollarSign} />}
              onChange={ChangeData}
              value={montant}
            />
            <div className="modifyPProduct">
       </div>
        <div className="btns_container flex_center">
          <Button onClick={()=> props.showConfirmationPopup(false)}  >Annuler</Button>
          <Button onClick={()=>props.PayerReglement(montant)} >Confirmer</Button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default ReglementConfirmation;
