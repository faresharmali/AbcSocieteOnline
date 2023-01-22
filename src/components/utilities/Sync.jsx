import React, { useEffect, useState } from "react";
import { Button, Select } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Sync = (props) => {


  return (
    <div className="confirmation_popup22 flex_center">
      <div className="confirmation">
        <div className="confirmation_heading flex_center">Synchronisation ...</div>
        <div className="confirmation_form_container">
      
        <div className="confirmation_select">
          <div className="flex_center">
            <h2>Synchronisation En Cours , Veuillez Patienter ...</h2>
          </div>
        
        </div>
        
        </div>
      </div>
    </div>
  );
};

export default Sync;
