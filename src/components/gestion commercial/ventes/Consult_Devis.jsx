import React, { useEffect, useState } from "react";
import Confirmation_popup from "../../utilities/confirmation_popup.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faFileInvoiceDollar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";
import { useToasts } from "react-toast-notifications";
import sync from "../../sync.js";
const Consult_Devis = (Props) => {
  let Devis = Props.DevisList.filter((x) => x.id == Props.DevisId)[0];
  let Produits = JSON.parse(Devis.produits);
  let Client = JSON.parse(Devis.client_id);
  let [showPopup, handlePopup] = useState(false);
  let [showBLPopup, handlePopup2] = useState(false);
  let [facturé, setfacturestate] = useState(Devis.facture);
  let [Livre, setLivreState] = useState(Devis.livre);
  const { addToast } = useToasts();
  const { ipcRenderer } = require("electron");
  let GenereBL = (options) => {
    if (options.reglement == "Especes") {
      Devis.prix_ttc += Devis.prix_ttc * 0.01;
    }
    let obj = {
      user: JSON.stringify(Props.LoggedInUser),
      Devis: JSON.stringify(Devis),
      societe: Devis.societe,
      reglement: options.reglement,
    };
    let obj2 = {
      agent: Props.LoggedInUser.username,
      produits: JSON.stringify(Produits),
      SelectedSociete: Devis.societe,
      Client: Devis.client_id,
    };
    ipcRenderer.send("AddBonLivraison", obj);
    ipcRenderer.send("AddBonSortie", obj2);
    ipcRenderer.send(
      "updateLots",
      Produits.map((element) =>
        element.id
          ? { ...element, quantityAchete: -element.quantityAchete }
          : element
      )
    );
    sync(addToast);
    ipcRenderer.send("devisLivre", Props.DevisId);
    Produits.forEach((p) => {
      ipcRenderer.send("AddVente", {
        ...p,
        client: Devis.client_id,
        commercial: Devis.commercial,
        societe: JSON.parse(Devis.societe).Identifiant,
      });
    });
    setLivreState(1);
    handlePopup2(false);
    let data = {
      Produits,
      commercial: Devis.commercial,
    };
    ipcRenderer.send("AddPrimes", data);
    Props.refreshClient();
  };

  let GenererFacture = (options) => {
    if (options.reglement == "Especes") {
      Devis.prix_ttc += Devis.prix_ttc * 0.01;
    }
    let Called = false;
    let obj = {
      user: JSON.stringify(Props.LoggedInUser),
      Devis: JSON.stringify(Devis),
      societe: Devis.societe,
      reglement: options.reglement,
    };
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      if (!Called) {
        Called = true;
        ipcRenderer.send("AddFacture", obj);
        ipcRenderer.send("devisFacture", Props.DevisId);
        Props.refreshClient();
        setfacturestate(1);
        const obj2 = {
          user: Props.LoggedInUser.username,
          montant: Devis.prix_ttc,
          Client: JSON.parse(Devis.client_id),
          reglement: options.reglement,
          type: "client",
        };
        ipcRenderer.send("AddReglement", obj2);
        Props.updateProductList();
        handlePopup(false);

        sync(addToast);
      }
    });
  };

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
    Devis.montantEnLettre = montantEnLettre;
    ipcRenderer.send("PrintPage", { ...Devis, logo: Props.logo });
  };
  return (
    <section id="divIdToPrint" className="Devis_consultation ">
      {showPopup && (
        <Confirmation_popup
          handlePopup={handlePopup}
          GenererFacture={GenererFacture}
        />
      )}
      {showBLPopup && (
        <Confirmation_popup
          handlePopup={handlePopup2}
          GenererFacture={GenereBL}
        />
      )}
      <div className="backBtnContainer">
        <Button onClick={() => Props.pagehandler(4)} className="backBtn">
          <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faArrowLeft} />
          Revenir
        </Button>
      </div>
      <div className="devis_infos_container">
        <div className="devis_details2">
          <div className="Devis_client1">
            <h1 className="Devis_heading_title">Devis </h1>
            <h1>
              Num : <span>{Devis.ref}</span>{" "}
            </h1>
            <h1>
              Date:{" "}
              <span>
                {" "}
                {JSON.parse(Devis.date).day}/{JSON.parse(Devis.date).month}/
                {JSON.parse(Devis.date).year}{" "}
              </span>{" "}
            </h1>
          </div>

          <div className="Devis_client1 ">
            <h1 className="Devis_heading_title">societe </h1>
            <h1 className="societe_details">
              {" "}
              Nom: <span>{JSON.parse(Devis.societe).nom}</span>
            </h1>
            <h1 className="societe_details">
              {" "}
              Adresse: <span>{JSON.parse(Devis.societe).adresse}</span>
            </h1>
            <h1 className="societe_details">
              {" "}
              Email: <span>{JSON.parse(Devis.societe).email}</span>
            </h1>
            <h1 className="societe_details">
              {" "}
              Numero Du Telephone: <span>{JSON.parse(Devis.societe).num}</span>
            </h1>
          </div>
        </div>

        <div className="ProductsTable">
          <div className="product_column flex_center">
            <div className="productItem">Produit</div>
            <div className="productItem">Categorie</div>

            <div className="productItem">Prix</div>
            <div className="productItem">Quantité</div>
            <div className="productItem">Remise</div>
            <div className="productItem">Prix Total</div>
          </div>
          {Produits.map((p) => (
            <div key={p.id} className="product_column flex_center">
              <div className="productItem">{p.nom}</div>
              <div className="productItem">{p.category}</div>
              <div className="productItem">{p.prixChoisi} DA</div>
              <div className="productItem">{p.quantityAchete} Pieces</div>
              <div className="productItem">{p.remise}%</div>
              <div className="productItem">
                {p.prixChoisi * p.quantityAchete -
                  p.prixChoisi * p.quantityAchete * (p.remise / 100)}{" "}
                DA
              </div>
            </div>
          ))}
        </div>

        <div className="client_details_info">
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

        <div className="devis_details2 DevisFooter">
          <div className="Devis_client3 flex_center">
          Prix HT :{Devis.prix_ht.toFixed(2)} DA
          </div>
          <div
            style={{ justifyContent: "space-around", paddingRight: "20px" }}
            className="Devis_total flex_center"
          >
            <h2 className="Devis_total_title">
              Prix TTC : {parseFloat(Devis.prix_ttc.toFixed(2))} DA
            </h2>
          </div>
        </div>
        <div className="btns_container flex_center">
          <Button onClick={printPage}>
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </Button>
          {Livre == 0 && (
            <Button onClick={() => handlePopup2(true)}>
              {" "}
              <FontAwesomeIcon icon={faFileInvoiceDollar} /> Generer Bon du
              Livraison + Bon Sortie
            </Button>
          )}

          {facturé == 0 && (
            <React.Fragment>
              <Button onClick={() => handlePopup(true)}>
                {" "}
                <FontAwesomeIcon icon={faFileInvoiceDollar} /> Generer facture
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
};

export default Consult_Devis;
