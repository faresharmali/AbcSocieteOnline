import React, { Component,useState } from "react";
import Bureau_menu from "./menus/bureau_menu.jsx";
import image from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneSquareAlt,
  faEnvelope,
  faUserTie,
  faEdit,
  faUnlockAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";
import EditProfile from "./utilities/EditProfile.jsx"
const Profile = (props) => {
  const [Edit,ShowEdit]=useState(false)
  return (
    <section style={{width:"100%",height:"100%"}}>
      {Edit && <EditProfile refreshLoggedInUser={props.refreshLoggedInUser} ShowEdit={ShowEdit} User={props.LoggedInUser} />}
      <Bureau_menu setpage={props.setpage} />
      <div className="flex_center" style={{width:"100%",height:"100%"}}>

      <div className="profile_container">
        <img className="profile_img_container" src={image} alt="" />
        <h1 className="Profile_username">{props.LoggedInUser.username}</h1>

        <div className="userInfo ">
          <h1>
            {" "}
            <FontAwesomeIcon icon={faUserTie} /> Nom:{" "} <span>{props.LoggedInUser.nom}</span>
          </h1>
          <h1>
            {" "}
            <FontAwesomeIcon icon={faUserTie} /> Prenom :{" "}<span>{props.LoggedInUser.prenom}</span>
          </h1>
          <h1>
            {" "}
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Adresse :{" "}<span>{props.LoggedInUser.adresse}</span>
          </h1>
          <h1>
            {" "}
            <FontAwesomeIcon icon={faEnvelope} /> Email :{" "}<span>{props.LoggedInUser.email}</span>
          </h1>
          <h1>
            {" "}
            <FontAwesomeIcon icon={faPhoneSquareAlt} /> Numero de telephone:{" "}<span>{props.LoggedInUser.num}</span>
          </h1>
        </div>
        <div className="Profile_btns_container flex_center">
          <Button  onClick={()=>ShowEdit(true)}> <FontAwesomeIcon icon={faEdit} /> Modifier Mes Informations</Button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Profile;
