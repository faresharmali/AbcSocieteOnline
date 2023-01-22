import React, {  useState } from "react";
import Stat_Menu from "../menus/stat_menu.jsx";
import Statistiques_Achats from "./statistiques_achats.jsx";
import Statistiques_clients from "./statistiques_clients.jsx";
import Statistiques_fournisseurs from "./statistiques_fournisseurs.jsx";
import Statistiques_Vents from "./statistiques_vents.jsx";

const Statestiques = () => {
  let [page, setPage] = useState(3);
  return (
    <section>
      <Stat_Menu pagehandler={setPage} />
      <div className="separator_div"></div>
      {page == 1 && <Statistiques_Achats />}
      {page == 2 && <Statistiques_Vents />}
      {page == 3 && <Statistiques_clients />}
      {page == 4 && <Statistiques_fournisseurs />}
    </section>
  );
};

export default Statestiques;
