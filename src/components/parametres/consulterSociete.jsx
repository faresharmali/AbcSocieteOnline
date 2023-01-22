import React, { Component, useEffect, useState } from "react";
import EditSociete from "../utilities/EditSociete.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneSquareAlt,
  faEnvelope,
  faStoreAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Select, Button } from "react-materialize";

const ConsulterSociete = (props) => {
  let { ipcRenderer } = require("electron");
  let [image, setImage] = useState("");
  let [societe, setSociete] = useState("");
  let [Edit, ShowEdit] = useState(false);
  useEffect(() => {
    ipcRenderer.send("getSocieteForConsultation");
    ipcRenderer.on("SocieteSendingForConsultation", (e, result) => {
      setSociete(result[0]);
      function importAll(r) {
        return r.keys().map(r);
      }
      const images = importAll(
        require.context("../../../dist/img", false, /\.(png|jpe?g|svg)$/)
      );
      images.forEach((i) => {
        if (i.default.includes(result[0].nom)) {
          setImage(i.default);
        }
      });
    });
  }, []);
  const refresh = () => {
    ipcRenderer.send("getSocieteForConsultation");
  };
  return (
    <section className="Agence_consultation flex_center ">
      {Edit && (
        <EditSociete refresh={refresh} societe={societe} ShowEdit={ShowEdit} />
      )}
      <div className="devis_infos_container agContainer">
        <div className="societeContainer">
          <div className="societeDetails">
            <h1 style={{ textAlign: "center" }} className="Devis_heading_title">
              <div className="societeImgContainer flex_center">
                <img
                  className="societeImage"
                  src={image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "../../../dist/img/" + societe.nom + ".png";
                  }}
                  alt=""
                />
              </div>
            </h1>
          </div>

          <div className="societePageContainer">
            <h1>
              {" "}
              <FontAwesomeIcon icon={faStoreAlt} /> Nom De Société :{" "}
              <span>{societe.nom}</span>{" "}
            </h1>
            <h1>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Adresse :{" "}
              <span>{societe.adresse}</span>{" "}
            </h1>
            <h1>
              <FontAwesomeIcon icon={faPhoneSquareAlt} /> Numero De Telephone :
              <span> {societe.num}</span>{" "}
            </h1>
            <h1>
              <FontAwesomeIcon icon={faEnvelope} /> Email :
              <span>{societe.email}</span>{" "}
            </h1>
            <h1>
              Description : <span>{societe.description}</span>{" "}
            </h1>
            <h1>
              {" "}
              Numero de Registre de commerce : <span>{societe.NRC}</span>{" "}
            </h1>
            <h1>
              numéro d’identification fiscal : <span> {societe.NIF}</span>{" "}
            </h1>
            <h1>
              numéro d’article : <span> {societe.ART}</span>{" "}
            </h1>
          </div>
        </div>
        <Button style={{ marginLeft: "85%" }} onClick={() => ShowEdit(true)}>
          <FontAwesomeIcon icon={faEdit} /> modifier
        </Button>
      </div>
    </section>
  );
};

export default ConsulterSociete;
