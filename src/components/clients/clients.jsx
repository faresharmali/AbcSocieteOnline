import React, { Component } from "react";
import Clients_menu from "../menus/clients_menu.jsx";
import Ajouter_client from "./ajouter_client.jsx";
import Clients_List from "./clients_lits.jsx";
import Consulter_client from "./consulter_client.jsx";
import M from "materialize-css";

import { useState } from "react";
const Clients = (props) => {
  let [currentpage, setPage] = useState(1);
  let [clientId, setClientId] = useState(null);

  return (
    <section>
      {currentpage == 1 && (
        <Clients_List
          logo={props.logo}
          setPage={setPage}
          clients={props.clients}
          setClientId={setClientId}
        />
      )}
      {currentpage == 2 && (
        <Ajouter_client setPage={setPage} refreshClient={props.refreshClient} />
      )}
      {currentpage == 3 && (
        <Consulter_client
          refreshClient={props.refreshClient}
          setPage={setPage}
          clientId={clientId}
        />
      )}
    </section>
  );
};

export default Clients;
