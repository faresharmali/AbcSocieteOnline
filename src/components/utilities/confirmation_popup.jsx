import React, { useEffect, useState } from "react";
import { Button, Select } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Confirmation_popup = (props) => {
  let [societesList, SetSocieteList] = useState([]);
  let [societe, SetSocieteName] = useState("");
  let [reglement, setReglement] = useState("");
  const { ipcRenderer } = require("electron");



  let setPayement=(e)=>{
    setReglement(e.target.value)
  }
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div className="confirmation_heading flex_center">Confirmation</div>
        <div className="confirmation_form_container">
        <div className="confirmation_select">
         
       
        </div>
        <div className="confirmation_select">
          <div className="flex_center">
            <h2>veuillez choisir le Mode De Payement</h2>
          </div>
          <Select onChange={setPayement} value="" icon={<FontAwesomeIcon icon={faUser} />}>
            <option disabled value="">
              {" "}
              Reglement
            </option>
        
            <option  value="Especes">
              {" "}
              Especes
            </option>
        
            <option  value="Cheque">
              {" "}
              Cheque
            </option>
            <option  value=" Virement Bancaire">
              {" "}
              Virement Bancaire
            </option>
        
            <option  value=" à Terme">
              {" "}
              à Terme
            </option>
        
          </Select>
        </div>
        <div className="btns_container flex_center">
          <Button  onClick={()=> props.handlePopup(false)} >Annuler</Button>
          <Button  onClick={()=>props.GenererFacture({societe,reglement})}>Continuer</Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation_popup;
