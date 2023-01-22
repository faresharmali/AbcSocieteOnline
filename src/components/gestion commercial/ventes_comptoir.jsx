import React, { useState, useEffect } from "react";
import Delete_popup from "../utilities/Delete_popup.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Pagination, Select } from "react-materialize";
import Acceuil_Menu from "../menus/bureau_menu.jsx";

import {
  faList,
  faEye,
  faTrashAlt,
  faPlusCircle,
  faFileInvoice,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

const VentesComptoir = (Props) => {
  let { ipcRenderer } = require("electron");
  let [deleteDevis, ShowDelete] = useState(false);
  let [SelectedDevis, SetSelectedDevis] = useState(null);
  let [DevisList, setDevisList] = useState([]);
  let [DevisAafficher, setDevisAafficher] = useState([]);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  useEffect(() => {
    ipcRenderer.send("sendMeBonAchat");
    ipcRenderer.on("sendMeBonAchatReP", (e, result) => {
      setDevisList(result);
      setDevisAafficher(result.slice(0, 10));
    });
  }, []);

  let SetActivePage = (e) => {
    setDevisAafficher(DevisList.slice((e - 1) * 10, 10 * e));
  };
  let delete_devis = () => {
    ipcRenderer.send("deleteBonAchat", SelectedDevis);
    ipcRenderer.on("BonAchatDeleted", () => {
      ipcRenderer.send("sendMeBonAchat");
      ShowDelete(false);
    });
  };
  let printStuff = (Devis) => {
    Devis.societe = Props.societe;
    ipcRenderer.send("PrintBonAchat", { ...Devis, logo: Props.Logo });
  };

  const setFilterData = (e) => {
    if (e.target.name == "minDate") {
      let date = {
        year: e.target.value.slice(0, 4),
        month: e.target.value.slice(5, 7),
        day: e.target.value.slice(8, 10),
      };
      SetMinDate(date);
    }
    if (e.target.name == "maxDate") {
      let date2 = {
        year: e.target.value.slice(0, 4),
        month: e.target.value.slice(5, 7),
        day: e.target.value.slice(8, 10),
      };
      SetMaxDate(date2);
    }
  };
  const filterTable = () => {
    let DataArray = [...DevisList];
    if (MinDate) {
      let array = [];
      DataArray.forEach((v) => {
        if (JSON.parse(v.date).year > parseInt(MinDate.year)) {
          array.push(v);
        } else if (JSON.parse(v.date).year == parseInt(MinDate.year)) {
          if (JSON.parse(v.date).month > parseInt(MinDate.month)) {
            array.push(v);
          } else if (JSON.parse(v.date).month == parseInt(MinDate.month)) {
            if (JSON.parse(v.date).day >= parseInt(MinDate.day)) {
              array.push(v);
            }
          }
        }
      });
      DataArray = [...array];
    }
    if (MaxDate) {
      let array2 = [];
      DataArray.forEach((v) => {
        if (JSON.parse(v.date).year <= parseInt(MaxDate.year)) {
          if (JSON.parse(v.date).month < parseInt(MaxDate.month)) {
            array2.push(v);
          } else if (JSON.parse(v.date).month == parseInt(MaxDate.month)) {
            if (JSON.parse(v.date).day <= parseInt(MaxDate.day)) {
              array2.push(v);
            }
          }
        }
      });
      DataArray = [...array2];
    }
    setDevisAafficher(DataArray);
  };
  return (
    <section className="Devis_section">
      <Acceuil_Menu LoggedInUser={Props.LoggedInUser} />
      <div className="separator_div"></div>

      {deleteDevis && (
        <Delete_popup
          ShowDelete={ShowDelete}
          delete_devis={delete_devis}
          title={"ce Devis"}
        />
      )}
      <h2 className="section_title">
        <FontAwesomeIcon icon={faFileInvoice} /> Ventes Au Comptoir
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faList} /> Devis
          </h1>
          <h1 onClick={() => Props.pagehandler(12)} className="new_devis">
            <FontAwesomeIcon icon={faPlusCircle} /> Nouvelles Ventes
          </h1>
        </div>
        <div className="table_filter">
          <div>
            De:
            <input
              style={{
                boxSizing: "border-box !important",
                margin: "0 !important",
              }}
              onChange={setFilterData}
              type="date"
              name="minDate"
            />
          </div>
          <div>
            a:
            <input onChange={setFilterData} type="date" name="maxDate" />
          </div>
          <div></div>
          <Button onClick={filterTable}>filtrer</Button>
        </div>
        <div>
          <table id="customers">
            <thead>
              <tr>
                <th>N° </th>
                <th>Prix HT</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {DevisAafficher.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{p.id}</td>

                  <td data-th="COUNTRY"> {p.PrixTotal} DA</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.date).day}/{JSON.parse(p.date).month}/
                    {JSON.parse(p.date).year}{" "}
                  </td>
                  <td data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        printStuff(p);
                      }}
                      style={{
                        backgroundColor: "#f8991c",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>

                    {Props.LoggedInUser.role == "Administrateur" && (
                      <React.Fragment>
                        <Button
                          onClick={() => {
                            ShowDelete(true);
                            SetSelectedDevis(p.id);
                          }}
                          style={{
                            backgroundColor: "rgb(207, 31, 31)",
                            marginLeft: "10px",
                            width: "35px",
                            height: "35px",
                            padding: "0",
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </React.Fragment>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }} className="flex_center">
            <Pagination
              onSelect={SetActivePage}
              activePage={1}
              items={parseInt(DevisList.length / 10) + 1}
              leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
              maxButtons={8}
              rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VentesComptoir;
