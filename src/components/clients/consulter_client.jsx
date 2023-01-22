import React, { useState, useEffect } from "react";
import cientImg from "../../../assets/Client pic.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-materialize";
import EditClient from "../utilities/EditClient_popup.jsx"
import DeletePopup from "../utilities/Delete_popup.jsx"
import {
  faIdBadge,
  faChartBar,
  faUser,
  faUserTie,
  faCalendar,
  faTrashAlt,
  faEdit,
  faMapMarkerAlt,
  faPhoneSquareAlt,
} from "@fortawesome/free-solid-svg-icons";
const Consulter_client = (props) => {
  let [client, setClient] = useState(null);
  let [Edit, showEdit] = useState(false);
  let [Delete, showdelete] = useState(false);
  const { ipcRenderer } = require("electron");
  useEffect(() => {
    ipcRenderer.send("sendClient", props.clientId);
    ipcRenderer.on("sendClientAnswer", (e, result) => {
      setClient(result[0]);
    });
  }, []);
  const refresh=()=>{
    ipcRenderer.send("sendClient", props.clientId);
    ipcRenderer.on("sendClientAnswer", (e, result) => {
      setClient(result[0]);
    });
  }
  const deleteClient=()=>{
    ipcRenderer.send("SendToTrash", { id: client.id, table: "clients" });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeDevis");
      props.refreshClient()
      props.setPage(1)
    });

  }


  return (
    <section className="client_profile">
     {Delete &&  <DeletePopup  ShowDelete={showdelete} delete_devis={deleteClient} title={"ce client"} />}
     {Edit && <EditClient  refresh={refresh}  client={client} showEdit={showEdit} />} 
      <div className="client_profile_element profile">
        <div className="client_section_heading flex_center">
          <h2>
            {" "}
            <FontAwesomeIcon icon={faUser} /> Informations Personelle
          </h2>
        </div>
        <div className="profile_picture_container flex_center ">
          <img className="client_picture" src={cientImg} alt="" />
        </div>
        <div className="client_name flex_center">
          <h1>
            {" "}
            {client != null && (
              <span>
                {client.nom} {client.prenom}
              </span>
            )}
          </h1>
        </div>
        <div className="client_details">
          <h1>
            <FontAwesomeIcon icon={faPhoneSquareAlt} /> Telephone :{" "}
            {client != null && <span>{client.num}</span>}{" "}
          </h1>
          <h1>
            <FontAwesomeIcon icon={faUserTie} /> Type : <span>Particulier</span>
          </h1>
          <h1>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Adresse :{" "}
            {client != null && <span>{client.adresse} </span>}
          </h1>

          <h1>
            <FontAwesomeIcon icon={faCalendar} /> Date d'ajout :{" "}
            {client != null && (
              <span>
                {JSON.parse(client.DateAjout).day}/
                {JSON.parse(client.DateAjout).month}/
                {JSON.parse(client.DateAjout).year}
              </span>
            )}
          </h1>
        </div>
        <div className="client_btns flex_center">
          <Button onClick={()=>showEdit(true)}>
            <FontAwesomeIcon icon={faEdit} /> Modifier
          </Button>
          <Button onClick={()=>showdelete(true)}>
            <FontAwesomeIcon icon={faTrashAlt} /> supprimer
          </Button>
        </div>
      </div>
      <div className="client_profile_element">
        <div className="client_section_heading flex_center">
          <h2>
            <FontAwesomeIcon icon={faUserTie} /> Coordonnées Fiscaux
          </h2>
        </div>
        <div className="coordonees_fiscaux">
          <h1>
            <FontAwesomeIcon icon={faCalendar} /> N°R.C :{" "}
            {client != null && <span>{client.nrc}</span>}
          </h1>
          <h1>
            <FontAwesomeIcon icon={faCalendar} /> N.I.F :{" "}
            {client != null && <span>{client.nif}</span>}
          </h1>
          <h1>
            <FontAwesomeIcon icon={faCalendar} /> N° Article :{" "}
            {client != null && <span>{client.Narticle}</span>}
          </h1>
          <h1>
            <FontAwesomeIcon icon={faCalendar} /> N° I.S :{" "}
            {client != null && <span>{client.Nis}</span>}
          </h1>
        </div>
      </div>
      <div className="client_profile_element">
        <div className="client_section_heading flex_center">
          <h2>
            <FontAwesomeIcon icon={faChartBar} /> Statistiques
          </h2>
        </div>
        <div className="coordonees_fiscaux">
          
        </div>
      </div>
    </section>
  );
};

export default Consulter_client;
