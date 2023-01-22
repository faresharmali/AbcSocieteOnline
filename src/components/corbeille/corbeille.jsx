import React, { useState, useEffect } from "react";
import Devis_Corbeille from "./devis_corbeille.jsx"
import Facture_Corbeille from "./factureCorbeille.jsx"
import Bl_Corbeille from "./Bl_corbeille.jsx"
import Corbeille_Menu from "../menus/corbeille_menu.jsx";


const Corbeille = (props) => {
    let [currentPage,setpage]=useState(1);
    let [SocieteId,setSocieteId]=useState(0);


    return ( 
    <section>
      <Corbeille_Menu setpage={setpage} />
      <div className="separator_div"></div>

               {currentPage == 1 && <Devis_Corbeille Logo={props.Logo}/>}
               {currentPage == 2 && <Facture_Corbeille Logo={props.Logo}/>}
               {currentPage ==3 && <Bl_Corbeille Logo={props.Logo}/>}
            
    </section>
    )
}
 
export default Corbeille;