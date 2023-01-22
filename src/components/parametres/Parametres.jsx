import React, { useState, useEffect } from "react";
import Settings_Menu from "../menus/settings_Menu.jsx";
import Parametres_societes from "./parametres_des_societes.jsx";
import Parametres_Commerciaux from "./parametres_des_commerciaux.jsx";
import Parametres_taxes from "./parametres_des_taxes.jsx";
import Ajouter_societe from "./ajouter_societe.jsx";
import Ajouter_commerciaux from "./ajouter_commerciaux.jsx";
import ConsulterSociete from "./consulterSociete.jsx";

const Parametres = (Props) => {
  let [currentPage, setpage] = useState(2);
  let [SocieteId, setSocieteId] = useState(0);
  return (
    <section>
      <Settings_Menu pagehandler={setpage} />
      <div className="separator_div"></div>
      {currentPage == 2 && (
        <Parametres_societes
          setSocieteId={setSocieteId}
          pagehandler={setpage}
        />
      )}
      {currentPage == 3 && (
        <Parametres_Commerciaux
          LoggedInUser={Props.LoggedInUser}
          pagehandler={setpage}
        />
      )}
      {currentPage == 4 && <Parametres_taxes pagehandler={setpage} />}
      {currentPage == 5 && <Ajouter_societe pagehandler={setpage} />}
      {currentPage == 6 && <Ajouter_commerciaux pagehandler={setpage} />}
      {currentPage == 7 && (
        <ConsulterSociete SocieteId={SocieteId} pagehandler={setpage} />
      )}
    </section>
  );
};

export default Parametres;
