import React, { useState, useEffect } from "react";
import Bureau_menu from "./menus/bureau_menu.jsx";
import  Renouveler from "./utilities/Renouveler.jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneSquareAlt,
  faEnvelope,
  faUserTie,
  faEdit,
  faUnlockAlt,
  faKey,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Select, Button, TextInput,Icon } from "react-materialize";

const Abonnement = (props) => {
    let [abonnement, setabonnement] = useState(null);
    let [RenouvelerPopup, ShowRenouveler] = useState(false);
    const {ipcRenderer}=require("electron")
    useEffect(()=>{
        ipcRenderer.send("VerifierCle");
        ipcRenderer.on("VerifierCleRep", (e, result) => {
            setabonnement(result)
        })
    },[])
    const refresh=()=>{
      ipcRenderer.send("VerifierCle");
        ipcRenderer.on("VerifierCleRep", (e, result) => {
            setabonnement(result)
        })
    }
  return (
    <section>
      <Bureau_menu setpage={props.setpage} />
     {RenouvelerPopup &&  <Renouveler refresh={refresh} dateFin={abonnement[0].FinAbonnement} ShowRenouveler={ShowRenouveler} /> }
      <div className="separator_div"></div>
        <div className="abonnement_container flex_center">
     <div className="profile_container ">
        <h1 style={{textTransform:"uppercase"}} className="Profile_username">Mon Abonnement</h1>

        <div className="userInfo ">
          <h1>
            {" "}
            <FontAwesomeIcon icon={faKey} /> Clé:{" "} <span>{abonnement && abonnement[0].cle}</span>
          </h1>
          <h1>
            {" "}
            <FontAwesomeIcon icon={faCalendarAlt} /> Date D'activation :{" "}<span>{abonnement && JSON.parse(abonnement[0].dateActivation).day}/{abonnement && JSON.parse(abonnement[0].dateActivation).month}/{abonnement && JSON.parse(abonnement[0].dateActivation).year}</span>
          </h1>
          <h1>
            {" "}
            <FontAwesomeIcon icon={faCalendarAlt} /> Date de Fin :{" "}<span>{abonnement && JSON.parse(abonnement[0].FinAbonnement).day}/{abonnement && JSON.parse(abonnement[0].FinAbonnement).month}/{abonnement && JSON.parse(abonnement[0].FinAbonnement).year}</span>
          </h1>
        
        </div>
        <div className="Profile_btns_container flex_center">
          <Button onClick={()=>ShowRenouveler(true)} style={{width:"350px"}}> <FontAwesomeIcon icon={faEdit} /> Renouveler Mon Abonnement</Button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Abonnement;
