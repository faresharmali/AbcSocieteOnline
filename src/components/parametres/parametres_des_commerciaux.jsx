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
import EditAgent from "../utilities/EditAgent.jsx";
import Delete_popup from "../utilities/Delete_popup.jsx";
import Payer_popup from "../utilities/payerPrime.jsx";

const parametres_Commerciaux = (props) => {
  let [commerciauxList, setCommerciauxList] = useState([]);
  let [SelectedCommerciaux, setSelectedCommerciaux] = useState([]);
  let [EditPopup, ShowEdit] = useState(false);
  let [DeletePopup, ShowDelete] = useState(false);
  let [PayPopup, showPay] = useState(false);
  let { ipcRenderer } = require("electron");

  useEffect(() => {
    ipcRenderer.send("sendMeCommerciaux");
    ipcRenderer.on("CommerciauxSending", (e, result) => {
      setCommerciauxList(result);
      ShowEdit(false);

    });
  }, []);
  const refresh = () => {
    ipcRenderer.send("sendMeCommerciaux");
    };
  const Delete = () => {
    ipcRenderer.send("DeleteCommerciaux", SelectedCommerciaux.id);
    ipcRenderer.on("DeleteCommerciauxRep", (e, result) => {
      refresh();
      ShowDelete(false);
    });
  };
  return (
    <section className="nv_devis">
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
      <h1 className="section_title">
        <FontAwesomeIcon icon={faCogs} /> Parametres Des Utilisateurs
      </h1>
      <div style={{ width: "100%" }} className="clients_table data_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Liste Des Commerciaux
          </h1>
          <h1 onClick={() => props.pagehandler(6)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Ajouter Un Utilisateur
          </h1>
        </div>
        <div>
          <div className="devis_container flex_center"></div>
          <table id="customers">
            <thead>
              <tr>
                <th>Nom Prenom</th>
                <th>Role</th>
        
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commerciauxList.map((c) => (
                <tr key={c.id}>
                  <td data-th="CITY/TOWN/PLACES">
                    {c.nom} {c.prenom}
                  </td>
                  <td data-th="CITY/TOWN/PLACES">{c.role}</td>
               
                  <td data-th="COUNTRY">
                    {props.LoggedInUser.id!=c.id && (
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
                    )}
                    
                    <Button
                      onClick={() => {
                        setSelectedCommerciaux(c);
                        ShowEdit(true);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>{" "}
              
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default parametres_Commerciaux;
