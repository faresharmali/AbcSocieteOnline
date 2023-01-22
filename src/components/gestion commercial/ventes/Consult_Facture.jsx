import React, { Component, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { Button } from "react-materialize";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Consult_Facture = (Props) => {
  let Facture = Props.FactureList.filter((x) => x.id == Props.FactureId)[0];
  let Devis = JSON.parse(Facture.Devis);
  let Client = JSON.parse(Devis.client_id);
  let produits = JSON.parse(Devis.produits);

  const { ipcRenderer } = require("electron");

  let printPage = () => {
    var writtenNumber = require("written-number");
    let montant = parseFloat(Devis.prix_ttc.toFixed(2));
    let virgule = (montant % 1) * 100;
    let montantEnLettre =
      writtenNumber(parseInt(Devis.prix_ttc), { lang: "fr" }) + " dinars";
    if (virgule > 0) {
      montantEnLettre =
        writtenNumber(parseInt(Devis.prix_ttc), { lang: "fr" }) +
        " dinars" +
        " et " +
        writtenNumber(parseFloat(virgule.toFixed(2)), { lang: "fr" }) +
        " centiemes";
    }
    Facture.montantEnLettre = montantEnLettre;
    ipcRenderer.send("PrintFacture", { ...Facture, logo: Props.logo });
  };
  return (
    <section className="Devis_consultation ">
      <div className="backBtnContainer">
        <Button onClick={() => Props.pagehandler(10)} className="backBtn">
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faArrowLeft} />
          Revenir
        </Button>
      </div>
      <div className="devis_infos_container">
        <div className="devis_details2">
          <div className="Devis_client1">
            <h1 className="Devis_heading_title">Facture </h1>
            <h1>
              Réf : <span>{Facture.ref}</span>{" "}
            </h1>
            <h1>
              Date:{" "}
              <span>
                {JSON.parse(Facture.date).day}/{JSON.parse(Facture.date).month}/
                {JSON.parse(Facture.date).year}
              </span>{" "}
            </h1>
          </div>
          <div className="Devis_client1 ">
            <h1 className="Devis_heading_title">societe </h1>
            <h1 className="societe_details">
              {" "}
              Nom: <span>{JSON.parse(Facture.societe).nom}</span>
            </h1>
            <h1 className="societe_details">
              {" "}
              Adresse: <span>{JSON.parse(Facture.societe).adresse}</span>
            </h1>
            <h1 className="societe_details">
              {" "}
              Email: <span>{JSON.parse(Facture.societe).email}</span>
            </h1>
            <h1 className="societe_details">
              {" "}
              Numero Du Telephone:{" "}
              <span>{JSON.parse(Facture.societe).num}</span>
            </h1>
          </div>
        </div>

        <div className="ProductsTable">
          <div className="product_column flex_center">
            <div className="productItem">Produit</div>

            <div className="productItem">Prix</div>
            <div className="productItem">Quantité</div>
            <div className="productItem">Prix Total</div>
          </div>

          {produits.map((p) => (
            <div key={p.id} className="product_column flex_center">
              <div className="productItem">{p.nom}</div>
              <div className="productItem">{p.prixChoisi} DA</div>
              <div className="productItem">{p.quantityAchete} Pieces</div>
              <div className="productItem">
                {p.prixChoisi * p.quantityAchete} DA
              </div>
            </div>
          ))}
        </div>
        <div className="underTable">
          <div style={{ paddingLeft: "30px" }} className="client_details_info">
            <h1>
              Client:{" "}
              <span>
                {Client.nom} {Client.prenom}
              </span>
            </h1>
            <h1>
              Adresse: <span>{Client.adresse}</span>
            </h1>
            <h1>
              Numero De Telephone: <span>{Client.num}</span>
            </h1>
          </div>
        </div>

        <div className="devis_details2"></div>
        <div className="devis_details2 DevisFooter">
          <div className="Devis_client3 flex_center">
          Prix HT :{Devis.prix_ht.toFixed(2)} DA

          </div>
          <div
            style={{ justifyContent: "space-around", paddingRight: "20px" }}
            className="Devis_total flex_center"
          >
            <h2 className="Devis_total_title">
              Prix TTC :{Devis.prix_ttc.toFixed(2)} DA
            </h2>
          </div>
        </div>
        <div className="btns_container flex_center">
          <Button onClick={printPage}>Imprimer</Button>
        </div>
      </div>
    </section>
  );
};

export default Consult_Facture;
