import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faFileInvoice,
  faChevronCircleLeft,
  faChevronCircleRight,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Select, Button } from "react-materialize";
import NewReglement from "../../utilities/AjouterReglement.jsx";
import { useToasts } from "react-toast-notifications";
import getData from "../../getData.js";

const Reglements = (Props) => {
  let { ipcRenderer } = require("electron");
  let [Reglements, setReglements] = useState([]);
  let [clients, setClientList] = useState([]);
  let [ReglementsAaficher, setReglementsAaficher] = useState([]);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [SelectedClient, SetSelectedClient] = useState(null);
  let [afficherReglementAdd, show] = useState(false);
  let [PageNumber, setPageNumber] = useState(1);
  let [filtered, setfiltered] = useState(false);
  let [Total, setTotal] = useState(0);
  const { addToast } = useToasts();

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
    getData(addToast, "Reglements");
    ipcRenderer.on("Reglements", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendMeReglements", "client");
    });
    ipcRenderer.send("sendMeReglements", "client");
    ipcRenderer.on("sendMeReglementsAnswer", (e, result) => {
      console.log("called jer", result);
      let count = 0;
      result.forEach((r) => {
        count += r.montant;
      });
      setTotal(count);
      setReglements(result);
      if ((result.length / 20) % 1 == 0) {
        setPageNumber(result.length / 20);
      } else {
        setPageNumber(parseInt(result.length / 20) + 1);
      }
      setReglementsAaficher(result.slice(0, 20));
    });
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setClientList(result);
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let SetActivePage = (e) => {
    setReglementsAaficher(Reglements.slice((e - 1) * 20, 20 * e));
  };
  const refresh = () => {
    console.log("called");
    ipcRenderer.send("sendMeReglements", "client");
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
      console.log(periode);
    }
    ipcRenderer.send("printReglements", {
      title: "Historiques Des Réglements",
      Data: ReglementsAaficher,
      logo: Props.logo,
      periode,
      Total,
      type: "clients",
    });
  };
  return (
    <section className="Devis_section">
      {afficherReglementAdd && (
        <NewReglement refresh={refresh} show={show} user={Props.user} />
      )}
      <h2 className="section_title">
        <FontAwesomeIcon icon={faFileInvoice} /> Reglements Clients
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
            Client
            <Select onChange={setFilterData} name="client">
              <option disabled value="">
                {" "}
                Client
              </option>
              <option value="tous">Tous</option>
              {clients.map((c) => (
                <option key={c.id} value={c.identifier}>
                  {c.nom} {c.prenom}
                </option>
              ))}
            </Select>
          </div>
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
                <th>Client</th>
                <th>Agent Commercial</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Mode De Payement</th>
              </tr>
            </thead>
            <tbody>
              {ReglementsAaficher.map((b) => (
                <tr key={b.id}>
                  <td>
                    {JSON.parse(b.client).nom} {JSON.parse(b.client).prenom}
                  </td>
                  <td>{b.agent}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(b.date).day}/{JSON.parse(b.date).month}/
                    {JSON.parse(b.date).year}{" "}
                  </td>
                  <td>
                    {b.montant.toFixed(2)}
                    {" DA"}
                  </td>
                  <td>{b.ModePayement}</td>
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
