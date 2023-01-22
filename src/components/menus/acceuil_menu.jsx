import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faStore,
  faCog,
  faShoppingBasket,
  faDollarSign,
  faChartBar,
  faStream,
} from "@fortawesome/free-solid-svg-icons";
const Acceuil_Menu = (props) => {
  window.addEventListener("click", () => {
    let subMenus = document.querySelectorAll(".submenu");
    for (let i = 0; i < subMenus.length; i++) {
      subMenus[i].classList.remove("openSub");
    }
  });
  let open_submenu = (x) => {
    event.stopPropagation();
    let subMenus = document.querySelectorAll(".submenu");
    for (let i = 0; i < subMenus.length; i++) {
      if (i != x) subMenus[i].classList.remove("openSub");
    }
    subMenus[x].classList.toggle("openSub");
  };
  return (
    <div className="menu_bar flex_center">
      <div
        style={{
          marginLeft:
            props.LoggedInUser.role != "Administrateur" ? "70px" : "0",
        }}
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
            onClick={() => open_submenu(0)}
            className="menu_item flex_center "
          >
            <FontAwesomeIcon icon={faShoppingBasket} /> Tiers & Produits
            <div
              onClick={() => event.stopPropagation()}
              className="submenu  sm1"
            >
              <div
                onClick={() => {
                  props.pagehandler(3);
                }}
                className="subItem"
              >
                fournisseurs
              </div>
              <div
                onClick={() => {
                  props.pagehandler(8);
                }}
                className="subItem"
              >
                famille de produits
              </div>
              <div
                onClick={() => {
                  props.pagehandler(2);
                }}
                className="subItem"
              >
                Produits
              </div>
              <div
                onClick={() => {
                  props.pagehandler(39);
                }}
                className="subItem"
              >
                Clients
              </div>
              <div
                onClick={() => {
                  props.pagehandler(45);
                }}
                className="subItem"
              >
                Commerciaux
              </div>
              <div
                onClick={() => {
                  props.pagehandler(43);
                }}
                className="subItem"
              >
                Lots
              </div>
            </div>
          </div>
          <div
            onClick={() => open_submenu(1)}
            className="menu_item flex_center"
          >
            <FontAwesomeIcon icon={faShoppingCart} /> Ventes & Achats
            <div
              onClick={() => event.stopPropagation()}
              className="submenu sm2"
            >
              <div
                onClick={() => {
                  props.pagehandler(4);
                }}
                className="subItem"
              >
                Devis
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(27);
                }}
              >
                Bons de commande
              </div>
              <div
                onClick={() => {
                  props.pagehandler(13);
                }}
                className="subItem"
              >
                Bons de livraison
              </div>
              <div
                onClick={() => {
                  props.pagehandler(10);
                }}
                className="subItem"
              >
                Factures
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(16);
                }}
              >
                Bons de retour
              </div>
            </div>
          </div>
          <div
            onClick={() => open_submenu(2)}
            className="menu_item flex_center"
          >
            {" "}
            <FontAwesomeIcon icon={faStore} /> Stocks
            <div
              onClick={() => event.stopPropagation()}
              className="submenu sm3"
            >
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(44);
                }}
              >
                Inventaire
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(46);
                }}
              >
                Depots
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(19);
                }}
              >
                Bons d'entrées
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(20);
                }}
              >
                Bons de sorties
              </div>
            </div>
          </div>
          <div
            onClick={() => open_submenu(3)}
            className="menu_item flex_center"
          >
            <FontAwesomeIcon icon={faDollarSign} /> Reglements
            <div
              onClick={() => event.stopPropagation()}
              className="submenu sm4"
            >
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(30);
                }}
              >
                Régelements Clients
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(40);
                }}
              >
                Régelements Fournisseurs
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(31);
                }}
              >
                echéantier clients
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(38);
                }}
              >
                echéantier Fournisseurs
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(42);
                }}
              >
                Charges
              </div>
            </div>
          </div>
          <div
            onClick={() => open_submenu(4)}
            className="menu_item flex_center"
          >
            <FontAwesomeIcon icon={faChartBar} /> Etats
            <div
              onClick={() => event.stopPropagation()}
              className="submenu sm5"
            >
              <div
                onClick={() => {
                  props.pagehandler(12);
                }}
                className="subItem"
              >
                Historique des ventes
              </div>
              <div
                className="subItem"
                onClick={() => {
                  props.pagehandler(29);
                }}
              >
                Historique des achats
              </div>
            </div>
          </div>
          {props.LoggedInUser.role == "Administrateur" && (
            <div
              onClick={() => open_submenu(5)}
              className="menu_item flex_center"
            >
              <FontAwesomeIcon icon={faStream} /> Utilitaires
              <div
                onClick={() => event.stopPropagation()}
                className="submenu sm6"
              >
              
                <div
                  className="subItem"
                  onClick={() => {
                    props.pagehandler(34);
                  }}
                >
                  Importer des données
                </div>
                <div
                  className="subItem"
                  onClick={() => {
                    props.pagehandler(35);
                  }}
                >
                  Exporter des données
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Acceuil_Menu;
