import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faDollarSign,
  faMoneyBill,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Select, Button } from "react-materialize";
import NewReglement from "../../utilities/ajouterCharge.jsx";
import DeletePopup from "../../utilities/Delete_popup.jsx";
const Reglements = (Props) => {
  let { ipcRenderer } = require("electron");
  let [Reglements, setReglements] = useState([]);
  let [ReglementsAaficher, setReglementsAaficher] = useState([]);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [SelectedClient, SetSelectedClient] = useState(null);
  let [afficherReglementAdd, show] = useState(false);
  let [PageNumber, setPageNumber] = useState(1);
  let [filtered, setfiltered] = useState(false);
  let [showDelete, setShowDelete] = useState(false);
  let [Total, setTotal] = useState(0);
  let [SelectedChagre, setCharge] = useState(null);

  let delete_charge = () => {
    console.log("saha", SelectedChagre.id);
    ipcRenderer.send("deleteCharge", SelectedChagre.id);
    ipcRenderer.on("deleteChargeRep", () => {
      refresh();
      setShowDelete(false);
    });
  };
  const setFilterData = (e) => {
    if (e.target.name == "client") {
      SetSelectedClient(e.target.value);
    }
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
  useEffect(() => {
    ipcRenderer.on("charges", () => {
      ipcRenderer.send("sendMeCharges");
    });
    ipcRenderer.send("sendMeCharges");
    ipcRenderer.on("sendMeChargesAnwswer", (e, result) => {
      setReglements(result);
      let count = 0;
      result.forEach((r) => {
        count += r.montant;
      });
      setTotal(count);
      if ((result.length / 20) % 1 == 0) {
        setPageNumber(result.length / 20);
      } else {
        setPageNumber(parseInt(result.length / 20) + 1);
      }
      setReglementsAaficher(result.slice(0, 20));
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let SetActivePage = (e) => {
    setReglementsAaficher(Reglements.slice((e - 1) * 20, 20 * e));
  };
  const refresh = () => {
    ipcRenderer.send("sendMeCharges");
  };
  const filterTable = () => {
    let DataArray = [...Reglements];
    if (SelectedClient) {
      if (SelectedClient == "tous") {
        DataArray = [...Reglements];
      } else {
        let mydata = DataArray.filter(
          (v) => JSON.parse(v.client).identifier == SelectedClient
        );
        DataArray = [...mydata];
      }
    }
    if (MinDate) {
      setfiltered(true);
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
      setfiltered(true);

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
    let count = 0;
    DataArray.forEach((r) => {
      count += r.montant;
    });
    setTotal(count);
    setReglementsAaficher(DataArray);
  };
  const printData = () => {
    let periode;
    if (!filtered) {
      periode = "Tous Les Periodes";
    } else {
      if (MinDate && MaxDate) {
        periode =
          "De " +
          MinDate.day +
          "/" +
          MinDate.month +
          "/" +
          MinDate.year +
          " à " +
          MaxDate.day +
          "/" +
          MaxDate.month +
          "/" +
          MaxDate.year;
      } else if (MinDate) {
        periode =
          "A partir De " +
          MinDate.day +
          "/" +
          MinDate.month +
          "/" +
          MinDate.year;
      } else {
        periode =
          "Avant Le " + MaxDate.day + "/" + MaxDate.month + "/" + MaxDate.year;
      }
    }
    ipcRenderer.send("printCharges", {
      title: "Historiques Des Charges",
      Data: ReglementsAaficher,
      logo: Props.logo,
      periode,
      type: "fournisseurs",
      Total,
    });
  };
  return (
    <section className="Devis_section">
      {showDelete && (
        <DeletePopup
          ShowDelete={setShowDelete}
          title="Cette Charge"
          delete_devis={delete_charge}
        />
      )}
      {afficherReglementAdd && (
        <NewReglement refresh={refresh} show={show} user={Props.user} />
      )}
      <h2 className="section_title">
        <FontAwesomeIcon icon={faMoneyBill} /> Charges
      </h2>

      <div className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="devis_title">
            <FontAwesomeIcon icon={faDollarSign} /> Total : {Total.toFixed(2)}{" "}
            Da
          </h1>
          <div>
            <Button
              onClick={() => {
                show(true);
              }}
              style={{ backgroundColor: "#cf7f17", marginRight: "10px" }}
            >
              Ajouter
            </Button>
            <Button onClick={printData} style={{ backgroundColor: "#cf7f17" }}>
              Imprimer
            </Button>
          </div>
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
          <Button onClick={filterTable}>filtrer</Button>
        </div>
        <div>
          <table id="customers">
            <thead>
              <tr>
                <th>Bénéficier</th>
                <th>Montant</th>
                <th>Remarque</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ReglementsAaficher.map((b) => (
                <tr key={b.id}>
                  <td>{b.benificier}</td>
                  <td>
                    {b.montant}
                    {" DA"}
                  </td>
                  <td>{b.remarque}</td>
                  <td data-th="COUNTRY">
                    <td data-th="COUNTRY">
                      {JSON.parse(b.date).day}/{JSON.parse(b.date).month}/
                      {JSON.parse(b.date).year}{" "}
                    </td>
                  </td>

                  <td>
                    <Button
                      onClick={() => {
                        setShowDelete(true);
                        setCharge(b);
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }} className="flex_center">
            <Pagination
              onSelect={SetActivePage}
              activePage={1}
              items={PageNumber}
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

export default Reglements;
