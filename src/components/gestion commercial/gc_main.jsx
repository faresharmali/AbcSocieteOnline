import React, { useState, useEffect } from "react";
import Acceuil_Menu from "../menus/acceuil_menu.jsx";
import Produits from "./produits.jsx";
import Nv_produit from "./nv_produit.jsx";
import Fournisseurs from "./fournisseurs.jsx";
import Categories from "./categories.jsx";
import Commerciaux from "./commerciaux.jsx";
import Devis from "./ventes/devis.jsx";
import Avoirs from "./ventes/avoirs.jsx";
import Nv_devis from "./ventes/nv_devis.jsx";
import Nv_Avoir from "./ventes/nv_avoir.jsx";
import Consult_Devis from "./ventes/consult_Devis.jsx";
import Consult_Avoir from "./ventes/consult_Avoir.jsx";
import Edit_Devis from "./ventes/edit_Devis.jsx";
import Factures from "./ventes/factures.jsx";
import BonsLivraison from "./ventes/BonsLivraison.jsx";
import Consult_Facture from "./ventes/Consult_Facture.jsx";
import Bons_commande from "./ventes/bons_commande.jsx";
import Nv_bon_commande from "./ventes/nv_bon_commande.jsx";
import Consult_BonLivraison from "./ventes/Consult_BonLivraison.jsx";
import HistoriqueVentes from "./etat/historique_des_ventes.jsx";
import HistoriqueAchats from "./etat/historique_des_achats.jsx";
import Bon_entre from "./stocks/bon_entre.jsx";
import Bon_sortie from "./stocks/bon_sortie.jsx";
import Etat_des_stocks from "./stocks/etat_des_stock.jsx";
import Parametrer_produits from "./stocks/parametrer_produits.jsx";
import Movement_stock from "./stocks/mouvement_stock.jsx";
import Consult_BonEntre from "./stocks/consult_bonEntre.jsx";
import Consult_BonSortie from "./stocks/consult_bonSortie.jsx";
import Nv_bon_sortie from "./stocks/nv_bon_sortie.jsx";
import Nv_bon_entre from "./stocks/nv_bon_entre.jsx";
import Reglements from "./reglements/reglements.jsx";
import Encheantier_Clients from "./reglements/Encheantier_clients.jsx";
import Remise_en_banque from "./reglements/Remise_en_banque.jsx";
import Importer from "../utilitaires/Importer.jsx";
import Exporter from "../utilitaires/exporter.jsx";
import Consult_BonCommande from "./ventes/consult_bonCommande.jsx";
import EditFacture from "./ventes/EditFacture.jsx";
import EcheantierFournisseurs from "./reglements/Encheantier_fournisseurs.jsx";
import Clients from "../clients/clients.jsx";
import ReglementsFournisseurs from "./reglements/reglementsFournisseurs.jsx";
import EditBl from "./ventes/EditBl.jsx";
import Charges from "./reglements/charges.jsx";
import Lots from "./Lots.jsx";
import Depots from "./Depots.jsx";
import Inventaire from "./inventaire.jsx";
import Utilisateurs from "./Utilisateurs.jsx";
const Gc_main = (Props) => {
  let { ipcRenderer } = require("electron");
  let [currentPage, setpage] = useState(2);
  let [productList, setProducts] = useState([]);
  let [DevisList, SetDevisList] = useState([]);
  let [DevisId, SetDevisId] = useState("");
  let [BonEntreId, SetBonEntreId] = useState("");
  let [AvoirId, SetAvoirId] = useState("");
  let [FactureId, SeFacutreId] = useState("");
  let [FactureList, SeFacutre] = useState("");
  let [BonLivraisonList, SetBonLivraison] = useState("");
  let [BonLivraisonID, SetBonId] = useState("");
  let [BonCommandeId, SetBonCId] = useState("");
  let [FacturesList, setFacture] = useState("");
  let [societe, setSociete] = useState("");
  let [BLList, setBLList] = useState("");
  useEffect(() => {
    ipcRenderer.send("sendMeDevis2");
    ipcRenderer.on("DevisSending2", (e, result) => {
      SetDevisList(result);
    });
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      setProducts(result);
    });

    ipcRenderer.send("sendMeFactures");
    ipcRenderer.on("FacturesSending", (e, result) => {
      setFacture(result);
    });
    ipcRenderer.send("getSociete");
    ipcRenderer.on("SocieteSending", (e, result) => {
      setSociete(result[0]);
    });
    ipcRenderer.send("sendMeBonsLivraison");
    ipcRenderer.on("BonsLivraisonSending", (e, result) => {
      setBLList(result);
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  let updateDevis = () => {
    ipcRenderer.send("sendMeDevis2");
    ipcRenderer.send("sendMeFactures");
    ipcRenderer.send("sendMeBonsLivraison");
  };
  let updateDevisData = (data) => {
    SetDevisList(data);
  };
  useEffect(() => {
    Props.updateHistoryCount();
  }, [currentPage]);
  const updateProductList = () => {
    ipcRenderer.send("sendMeProducts");
  };
  return (
    <section>
      <Acceuil_Menu LoggedInUser={Props.LoggedInUser} pagehandler={setpage} />
      <div className="separator_div"></div>
      {currentPage == 1 && <h1>gestion commercial</h1>}
      {currentPage == 2 && (
        <Produits
          logo={societe.profileImage}
          UserId={Props.UserId}
          pagehandler={setpage}
        />
      )}
      {currentPage == 3 && <Fournisseurs logo={societe.profileImage} />}
      {currentPage == 4 && (
        <Devis
          LoggedInUser={Props.LoggedInUser}
          UserId={Props.UserId}
          pagehandler={setpage}
          productList={productList}
          SetDevisId={SetDevisId}
          updateDevis={updateDevis}
          updateDevisData={updateDevisData}
        />
      )}
      {currentPage == 5 && (
        <Nv_devis
          SetDevisId={SetDevisId}
          updateDevis={updateDevis}
          pagehandler={setpage}
          productList={productList}
          clients={Props.clients}
          DevisList={DevisList}
        />
      )}

      {currentPage == 6 && (
        <Consult_Devis
          logo={societe.profileImage}
          refreshClient={Props.refreshClient}
          pagehandler={setpage}
          updateProductList={updateProductList}
          LoggedInUser={Props.LoggedInUser}
          DevisId={DevisId}
          DevisList={DevisList}
        />
      )}
      {currentPage == 7 && <Nv_produit />}
      {currentPage == 8 && <Categories />}
      {currentPage == 9 && <Commerciaux />}
      {currentPage == 10 && (
        <Factures
          UserId={Props.UserId}
          LoggedInUser={Props.LoggedInUser}
          SeFacutre={SeFacutre}
          SeFacutreId={SeFacutreId}
          pagehandler={setpage}
        />
      )}
      {currentPage == 11 && (
        <Consult_Facture
          logo={societe.profileImage}
          pagehandler={setpage}
          FactureList={FactureList}
          FactureId={FactureId}
        />
      )}
      {currentPage == 12 && (
        <HistoriqueVentes logo={societe.profileImage} UserId={Props.UserId} />
      )}
      {currentPage == 13 && (
        <BonsLivraison
          UserId={Props.UserId}
          LoggedInUser={Props.LoggedInUser}
          SetBonLivraison={SetBonLivraison}
          SetBonId={SetBonId}
          pagehandler={setpage}
        />
      )}
      {currentPage == 14 && (
        <Consult_BonLivraison
          logo={societe.profileImage}
          pagehandler={setpage}
          BonLivraisonList={BonLivraisonList}
          BonLivraisonID={BonLivraisonID}
        />
      )}
      {currentPage == 15 && (
        <Edit_Devis
          updateDevis={updateDevis}
          productList={productList}
          pagehandler={setpage}
          DevisId={DevisId}
          DevisList={DevisList}
        />
      )}
      {currentPage == 16 && (
        <Avoirs
          LoggedInUser={Props.LoggedInUser}
          UserId={Props.UserId}
          pagehandler={setpage}
          SetAvoirId={SetAvoirId}
        />
      )}
      {currentPage == 17 && (
        <Nv_Avoir
          pagehandler={setpage}
          LoggedInUser={Props.LoggedInUser}
          productList={productList}
          clients={Props.clients}
        />
      )}
      {currentPage == 18 && (
        <Consult_Avoir
          logo={societe.profileImage}
          pagehandler={setpage}
          AvoirId={AvoirId}
        />
      )}
      {currentPage == 19 && (
        <Bon_entre
          UserId={Props.UserId}
          SetBonEntreId={SetBonEntreId}
          LoggedInUser={Props.LoggedInUser}
          pagehandler={setpage}
        />
      )}
      {currentPage == 20 && (
        <Bon_sortie
          UserId={Props.UserId}
          SetBonEntreId={SetBonEntreId}
          LoggedInUser={Props.LoggedInUser}
          pagehandler={setpage}
        />
      )}
      {currentPage == 21 && <Etat_des_stocks />}
      {currentPage == 22 && <Parametrer_produits />}
      {currentPage == 23 && <Movement_stock />}
      {currentPage == 24 && (
        <Nv_bon_entre
          UserId={Props.UserId}
          pagehandler={setpage}
          LoggedInUser={Props.LoggedInUser}
          productList={productList}
        />
      )}
      {currentPage == 25 && (
        <Consult_BonEntre
          logo={societe.profileImage}
          pagehandler={setpage}
          BonEntreId={BonEntreId}
        />
      )}
      {currentPage == 26 && (
        <Nv_bon_sortie
          UserId={Props.UserId}
          SetBonEntreId={SetBonEntreId}
          updateProductList={updateProductList}
          pagehandler={setpage}
          LoggedInUser={Props.LoggedInUser}
          productList={productList}
        />
      )}
      {currentPage == 27 && (
        <Bons_commande
          UserId={Props.UserId}
          SetBonCId={SetBonCId}
          LoggedInUser={Props.LoggedInUser}
          pagehandler={setpage}
        />
      )}
      {currentPage == 28 && (
        <Nv_bon_commande
          pagehandler={setpage}
          LoggedInUser={Props.LoggedInUser}
          productList={productList}
        />
      )}
      {currentPage == 29 && (
        <HistoriqueAchats logo={societe.profileImage} UserId={Props.UserId} />
      )}
      {currentPage == 30 && (
        <Reglements logo={societe.profileImage} user={Props.LoggedInUser} />
      )}
      {currentPage == 31 && <Encheantier_Clients />}
      {currentPage == 32 && <Remise_en_banque />}
      {currentPage == 33 && (
        <Consult_BonSortie
          logo={societe.profileImage}
          pagehandler={setpage}
          BonEntreId={BonEntreId}
        />
      )}
      {currentPage == 34 && <Importer />}
      {currentPage == 35 && <Exporter />}
      {currentPage == 36 && (
        <Consult_BonCommande
          logo={societe.profileImage}
          pagehandler={setpage}
          BonCommandeId={BonCommandeId}
        />
      )}
      {currentPage == 37 && (
        <EditFacture
          pagehandler={setpage}
          updateDevis={updateDevis}
          productList={productList}
          FacturesList={FactureList}
          FactureId={FactureId}
        />
      )}
      {currentPage == 38 && <EcheantierFournisseurs />}
      {currentPage == 39 && (
        <Clients
          logo={societe.profileImage}
          refreshClient={Props.refreshClient}
          clients={Props.clients}
        />
      )}
      {currentPage == 40 && (
        <ReglementsFournisseurs
          logo={societe.profileImage}
          user={Props.LoggedInUser}
          refreshClient={Props.refreshClient}
          clients={Props.clients}
        />
      )}
      {currentPage == 41 && (
        <EditBl
          updateDevis={updateDevis}
          productList={productList}
          BLList={BonLivraisonList}
          pagehandler={setpage}
          BLID={BonLivraisonID}
        />
      )}
      {currentPage == 42 && <Charges logo={societe.profileImage} />}
      {currentPage == 43 && <Lots logo={societe.profileImage} />}
      {currentPage == 44 && <Inventaire logo={societe.profileImage} />}
      {currentPage == 45 && (
        <Utilisateurs
          LoggedInUser={Props.LoggedInUser}
          logo={societe.profileImage}
        />
      )}
      {currentPage == 46 && <Depots logo={societe.profileImage} />}
    </section>
  );
};

export default Gc_main;
