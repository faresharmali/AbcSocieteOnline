import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
const Clients_menu = (props) => {
    
  window.addEventListener("click", () => {
    let subMenus = document.querySelectorAll(".submenu");
    for (let i = 0; i < subMenus.length; i++) {
      subMenus[i].classList.remove("openSub");
    }
  });
  
  return (
    <div className="menu_bar flex_center">
      <div style={{paddingLeft:"23%"}} className="menu_container flex_center">
        <div
          onClick={() => props.changepage(1)}
          className="menu_item flex_center flex_center "
        >
          <FontAwesomeIcon icon={faList} /> Liste Des Clients
        </div>

        <div onClick={() => props.changepage(2)} className="menu_item flex_center">
          <FontAwesomeIcon icon={faUserPlus} /> Ajouter Un Client
        </div>
      </div>
    </div>
  );
};

export default Clients_menu;
