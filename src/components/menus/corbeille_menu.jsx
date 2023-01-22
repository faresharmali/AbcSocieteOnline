import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faStore,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
const Corbeille_Menu = (props) => {
  return (
    <div className="menu_bar flex_center">
      <div
        className="menu_container flex_center"
      >
        <div className="flex_center menuButtonContainer">
          <div class="menu active">
            <svg viewBox="0 0 64 48">
              <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
              <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
              <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
            </svg>
          </div>
          Navigation
        </div>
        <div className="menuItemsContainer flex_center">
          <div
            onClick={() => props.setpage(1)}
            className="menu_item flex_center flex_center "
          >
            <FontAwesomeIcon icon={faShoppingBasket} /> Devis
          </div>
          <div
            onClick={() => props.setpage(2)}
            className="menu_item flex_center"
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            Factures
          </div>
          <div
            onClick={() => props.setpage(3)}
            className="menu_item flex_center"
          >
            {" "}
            <FontAwesomeIcon icon={faStore} /> Bons Livraison
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corbeille_Menu;
