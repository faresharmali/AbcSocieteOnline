import React, { useEffect, useState } from "react";
import { Button, Select,TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs,faEdit } from "@fortawesome/free-solid-svg-icons";

const EditClient = (props) => {

  const { ipcRenderer } = require("electron");
  let [Client, SetClient] = useState(props.client);
  let changeDetails=(e)=>{
    switch(e.target.name){
        case "Nom" :SetClient({...Client,nom:e.target.value})
        break;
        case "Adresse" :SetClient({...Client,adresse:e.target.value})
        break;
        case "Numero" :SetClient({...Client,num:e.target.value})
        break;
        case "Email" :SetClient({...Client,email:e.target.value})
        break;
        case "Description" :SetClient({...Client,description:e.target.value})
        break;
        case "N.I.S" :SetClient({...Client,Nis:e.target.value})
        break;
        case "N.R.C" :SetClient({...Client,nrc:e.target.value})
        break;
        case "N.I.F" :SetClient({...Client,nif:e.target.value})
        break;
        case "ART" :SetClient({...Client,Narticle:e.target.value})
        break;
        case "Prenom" :SetClient({...Client,prenom:e.target.value})
        break;
    }
    }
    let Updatesociete=()=>{
        ipcRenderer.send("UpdateClientInfo",Client);
        ipcRenderer.on("UpdateClientInfoRep", (e, result) => {
         console.log("updated")
         props.showEdit(false)
         props.refresh()
        
        });
    }
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"#1c5161"}} className="confirmation_heading flex_center"><FontAwesomeIcon style={{marginRight:"8px"}} icon={faEdit} /> {" "} Modifier  </div>
        <div className="confirmation_form_container">
            <div className="modifyPProduct">
        <TextInput onChange={changeDetails} value={Client.nom} id="Nom" name="Nom" label=" Nom " />
        {Client.type=="Particulier" && <TextInput onChange={changeDetails} value={Client.prenom} id="Prenom" name="Prenom" label="Prenom" />}
        <TextInput onChange={changeDetails} value={Client.num}  id="Numero" name="Numero" label="Numero De Telephone" />
        <TextInput onChange={changeDetails} value={Client.adresse}  id="Adresse" name="Adresse" label="Adresse" />
        {Client.type=="Societe" && (
            <React.Fragment>
        <TextInput onChange={changeDetails} value={Client.Nis} id="N.I.S" name="N.I.S" label="N.I.S" />
        <TextInput onChange={changeDetails} value={Client.nrc} id="N.R.C" name="N.R.C" label="N.R.C" />
        <TextInput onChange={changeDetails} value={Client.nif} id="N.I.F" name="N.I.F" label="N.I.F" />
        <TextInput onChange={changeDetails} value={Client.Narticle} id="ART" name="ART" label="ART" />
        </React.Fragment>
        )}
        </div>
        <div className="btns_container flex_center">
          <Button onClick={()=> props.showEdit(false)}  >Annuler</Button>
          <Button onClick={Updatesociete}  >Modifier</Button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default EditClient;
