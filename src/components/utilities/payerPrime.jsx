import React from "react";
import { Button } from "react-materialize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import sync from "../sync";
import { useToasts } from "react-toast-notifications";

const NewReglement = (props) => {
  const { addToast } = useToasts();

  const { ipcRenderer } = require("electron");
  let AjouterTaxe = () => {
    console.log(props.SelectedCommerciaux);
    ipcRenderer.send("payPrime", props.SelectedCommerciaux);
    ipcRenderer.on("primePayed", () => {
      props.showPay(false);
      props.refresh();
    });
    sync(addToast);
  };

  return (
    <div className="confirmation_popup flex_center">
      <div className="confirmation">
        <div
          style={{ backgroundColor: "#1c5161" }}
          className="confirmation_heading flex_center"
        >
          <FontAwesomeIcon
            style={{ marginRight: "8px" }}
            icon={faHandHoldingUsd}
          />{" "}
          Payer La Prime
        </div>
        <div className="confirmation_form_container">
          <div style={{ fontSize: "20px" }} className="modifyPProduct">
            Voulez Vous Vraiment Payer Cette Prime ?
          </div>
          <div className="btns_container flex_center">
            <Button onClick={() => props.showPay(false)}>Annuler</Button>
            <Button onClick={AjouterTaxe}>Payer</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReglement;
