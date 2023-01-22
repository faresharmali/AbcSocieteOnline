import React, { useEffect, useState } from "react";
import { Button, Select,TextInput } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs,faEdit } from "@fortawesome/free-solid-svg-icons";

const EditSociete = (props) => {

  const { ipcRenderer } = require("electron");
  let [Societe, SetSociete] = useState(props.societe);
  let [imgPath, setImgPath] = useState("");

  let changeDetails=(e)=>{
    switch(e.target.name){
        case "Nom" :SetSociete({...Societe,nom:e.target.value})
        break;
        case "Adresse" :SetSociete({...Societe,adresse:e.target.value})
        break;
        case "Numero" :SetSociete({...Societe,num:e.target.value})
        break;
        case "Email" :SetSociete({...Societe,email:e.target.value})
        break;
        case "Description" :SetSociete({...Societe,description:e.target.value})
        break;
        case "N.R.C" :SetSociete({...Societe,NRC:e.target.value})
        break;
        case "N.I.F" :SetSociete({...Societe,NIF:e.target.value})
        break;
        case "ART" :SetSociete({...Societe,ART:e.target.value})
        break;
    }
    }
    let Updatesociete=()=>{
        ipcRenderer.send("Updatesociete",{...Societe,imgPath});
        ipcRenderer.on("UpdateSocieteAnswer", (e, result) => {
          props.refresh()
          props.ShowEdit(false)
        
        });
    }
    const fileUpload =(e)=>{
      setImgPath(e.target.files[0].path)
    }
  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div style={{backgroundColor:"#1c5161"}} className="confirmation_heading flex_center"><FontAwesomeIcon style={{marginRight:"8px"}} icon={faEdit} /> {" "} Modifier Un Produit</div>
        <div className="confirmation_form_container">
            <div className="modifyPProduct">
        <TextInput onChange={changeDetails} value={Societe.nom} id="Nom" name="Nom" label=" Nom De Société" />
        <TextInput onChange={changeDetails} value={Societe.adresse} id="Adresse" name="Adresse" label="Adresse" />
        <TextInput onChange={changeDetails} value={Societe.num}  id="Numero" name="Numero" label="Numero De Telephone" />
        <TextInput onChange={changeDetails}  value={Societe.email} id="Email" name="Email" label="Email" />
        <TextInput onChange={changeDetails} value={Societe.description} id="Description" name="Description" label="Description" />
        <TextInput onChange={changeDetails} value={Societe.NRC} id="N.R.C" name="N.R.C" label="N.R.C" />
        <TextInput onChange={changeDetails} value={Societe.NIF} id="N.I.F" name="N.I.F" label="N.I.F" />
        <TextInput onChange={changeDetails} value={Societe.ART} id="ART" name="ART" label="ART" />
        <TextInput
            id="TextInput-4"
            label="Selectionner Votre Logo"
            type="file"
            accept=".png , .jpg"
            onChange={fileUpload}
            style={{ backgroundColor: "#dd8d25" }}
          />
        </div>
        <div className="btns_container flex_center">
          <Button onClick={()=> props.ShowEdit(false)}  >Annuler</Button>
          <Button onClick={Updatesociete}  >Modifier</Button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default EditSociete;
