import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faEdit } from "@fortawesome/free-solid-svg-icons";

const Renouveler = (props) => {
  const { ipcRenderer } = require("electron");
  let [Cle, SetCle] = useState("");
  let [DateDeFin, SetDateFin] = useState(JSON.parse(props.dateFin));
  let changeDetails = (e) => {
    switch (e.target.name) {
      case "cle":
        SetCle(e.target.value);
    }
  };
  let Updatesociete = () => {
    let keycall=false
    let date
    let calledKey = false;
    let mutex = false;
    let AccountActivated = false;
    if (Cle.trim() != "") {
      ipcRenderer.send("CheckKey");
      ipcRenderer.on("CheckKeyRep", (e, result) => {
        if (!calledKey) {
          calledKey = true;
          result.forEach((r) => {
            if (r.cle == Cle) {
              mutex = true;
              if (r.statu == 0) {
                AccountActivated = true; 
                let key = {
                  key: r,
                  keyId: r.id,
                };
                if(DateDeFin.month+r.dure<=12){
                   date = {
                    day: DateDeFin.day - 1,
                    month: DateDeFin.month+r.dure,
                    year: DateDeFin.year,
                  };
                }else{
                   date = {
                    day: DateDeFin.day - 1,
                    month: (DateDeFin.month+r.dure)-12,
                    year: DateDeFin.year+1,
                  };
                }
                let data={date,key}
                ipcRenderer.send("renouvelerAbonnement",data);
                ipcRenderer.on("renouvelerAbonnementRep", (e, result) => {
                  if(!keycall){
                    keycall=true
                    alert("Abonnement de " + r.dure + " mois activer avec succes");
                  }
                  props.ShowRenouveler(false);
                  props.refresh();
                });
              } else alert("cle deja utilisé");
            }
          });
          if (!mutex) {
            alert("cle invalide");
          }
        }
      });
     
    } else {
      alert("champ obligatoire");
    }
  };
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faEdit} />{" "}
          Renouveler L'abonnement
        </div>
        <div className="confirmation_form_container">
          <TextInput
            onChange={changeDetails}
            id="Nom"
            name="cle"
            label=" Clé D'activation"
          />
          <div className="btns_container flex_center">
            <Button onClick={() => props.ShowRenouveler(false)}>Annuler</Button>
            <Button onClick={Updatesociete}>Renouveler</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Renouveler;
