import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faUserPlus } from "@fortawesome/free-solid-svg-icons";
const Bureau_menu = (props) => {
  window.addEventListener("click", () => {
    let subMenus = document.querySelectorAll(".submenu");
    for (let i = 0; i < subMenus.length; i++) {
      subMenus[i].classList.remove("openSub");
    }
  });

  return (
    <div
      style={{ justifyContent: "flex-start" }}
      className="menu_bar flex_center"
    >
      <div className="menu_container flex_center">
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
      </div>
    </div>
  );
};

export default Bureau_menu;
