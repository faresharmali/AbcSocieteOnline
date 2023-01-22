import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faStore,
  faCog,
  faShoppingBasket,
  faDollarSign,
  faChartBar,
  faStream

}
 from "@fortawesome/free-solid-svg-icons";
const GcMenu = () => {
    return ( 
        <div className="menu_bar flex_center">
        <div className="menu_container flex_center">
            <div className="menu_item flex_center"><FontAwesomeIcon icon={faShoppingBasket} />    Tiers & Produits</div>
            <div className="menu_item flex_center"><FontAwesomeIcon icon={faShoppingCart} /> Ventes</div>
            <div className="menu_item flex_center"> <FontAwesomeIcon icon={faStore} /> Stocks</div>
            <div className="menu_item flex_center"><FontAwesomeIcon icon={faDollarSign} /> Reglements</div>
            <div className="menu_item flex_center"><FontAwesomeIcon icon={faChartBar} /> Etats</div>
            <div className="menu_item flex_center"><FontAwesomeIcon icon={faStream} /> Utilitaires</div>
            <div className="menu_item flex_center"><FontAwesomeIcon icon={faCog} /> Parametres</div>
        </div>
    </div>
     );
}
 
export default GcMenu;