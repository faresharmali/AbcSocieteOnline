import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faCogs,
  faEdit,
  faTrashAlt,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-materialize";
import EditAgent from "../utilities/EditAgentC.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";
import Payer_popup from "../utilities/payerPrime.jsx";
import NewAgent from "../utilities/ajouterAgent.jsx";

const parametres_Commerciaux = (props) => {
  let [commerciauxList, setCommerciauxList] = useState([]);
  let [SelectedCommerciaux, setSelectedCommerciaux] = useState([]);
  let [EditPopup, ShowEdit] = useState(false);
  let [DeletePopup, ShowDelete] = useState(false);
  let [AddPopup, Showadd] = useState(false);
  let [PayPopup, showPay] = useState(false);
  let { ipcRenderer } = require("electron");

  useEffect(() => {
    ipcRenderer.send("sendMeAgents");
    ipcRenderer.on("sendMeAgentsRep", (e, result) => {
      setCommerciauxList(result);
      ShowEdit(false);
    });
  }, []);
  const refresh = () => {
    ipcRenderer.send("sendMeAgents");
  };
  const Delete = () => {
    ipcRenderer.send("DeleteAgent", SelectedCommerciaux.id);
    ipcRenderer.on("DeleteAgentRep", (e, result) => {
      refresh();
      ShowDelete(false);
    });
  };
  return (
    <div>
      {AddPopup && <NewAgent show={Showadd} refresh={refresh} />}
      {EditPopup && (
        <EditAgent
          showEdit={ShowEdit}
          client={SelectedCommerciaux}
          refresh={refresh}
        />
      )}
      {DeletePopup && (
        <Delete_popup
          delete_devis={Delete}
          ShowDelete={ShowDelete}
          title={"cet agent"}
        />
      )}
      {PayPopup && (
        <Payer_popup
          SelectedCommerciaux={SelectedCommerciaux}
          showPay={showPay}
          refresh={refresh}
        />
      )}
      <section className="nv_devis">
        <h1 className="section_title">
          <FontAwesomeIcon icon={faCogs} /> Commerciaux
        </h1>
        <div style={{ width: "100%" }} className="clients_table data_table">
          <div className="devis_container flex_center">
            <h1 className="devis_title">
              <FontAwesomeIcon icon={faList} /> Liste Des Commerciaux
            </h1>
            <h1 onClick={() => Showadd(true)} className="new_devis">
              <FontAwesomeIcon icon={faPlusCircle} /> Ajouter Un Agent
              Commercial
            </h1>
          </div>
          <div>
            <div className="devis_container flex_center"></div>
            <table id="customers">
              <thead>
                <tr>
                  <th>Nom Prenom</th>
                  <th>Mobile</th>
                  <th>Produits Vendus</th>
                  <th>Prime</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commerciauxList.map((c) => (
                  <tr key={c.id}>
                    <td data-th="CITY/TOWN/PLACES">
                      {c.nom} {c.prenom}
                    </td>
                    <td data-th="CITY/TOWN/PLACES">{c.num}</td>
                    <td data-th="CITY/TOWN/PLACES">{c.produits_vendu}</td>
                    <td data-th="CITY/TOWN/PLACES">{c.prime} Da</td>

                    <td data-th="COUNTRY">
                      <Button
                        onClick={() => {
                          setSelectedCommerciaux(c);
                          ShowDelete(true);
                        }}
                        style={{
                          backgroundColor: "rgb(207, 31, 31)",
                          marginLeft: "10px",
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedCommerciaux(c);
                          ShowEdit(true);
                        }}
                        style={{ marginLeft: "10px" }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>{" "}
                      {c.prime > 0 && (
                        <Button
                          onClick={() => {
                            setSelectedCommerciaux(c);
                            showPay(true);
                          }}
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#cf7f17",
                          }}
                        >
                          <FontAwesomeIcon icon={faHandHoldingUsd} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default parametres_Commerciaux;
