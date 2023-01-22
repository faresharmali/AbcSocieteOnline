import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { Pagination, Button, Select } from "react-materialize";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";
import getData from "../../getData";

const HistoriqueVentes = (Props) => {
  const { ipcRenderer } = require("electron");
  let [ventes, setVentes] = useState([]);
  let [ventesAafficher, setVentesAaficher] = useState([]);
  let [ventesList, setVentesList] = useState([]);
  let [clients, setClientList] = useState([]);
  let [SelectedClient, setSelectedCategory] = useState(null);
  let [SelectedSociete, setSelectedSociete] = useState(null);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [Societes, SetSocieteList] = useState([]);
  let [filtered, setfiltered] = useState(false);

  const checkInternetConnected = require("check-internet-connected");
  const { addToast } = useToasts();
  let [Total, SetTotal] = useState(0);
  const setFilterData = (e) => {
    if (e.target.name == "category") {
      setSelectedCategory(e.target.value);
    }
    if (e.target.name == "Societe") {
      setSelectedSociete(e.target.value);
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

  const filterTable = () => {
    let DataArray = [...ventes];
    if (SelectedClient) {
      if (SelectedClient == "tous") {
        DataArray = [...ventes];
      } else {
        let mydata = DataArray.filter(
          (v) => JSON.parse(v.client).identifier == SelectedClient
        );
        DataArray = [...mydata];
      }
    }
    if (SelectedSociete) {
      if (SelectedSociete == "tous") {
        DataArray = [...ventes];
      } else {
        let mydata = DataArray.filter((v) => v.societe == SelectedSociete);
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
    setVentesAaficher(DataArray);
    let count = 0;
    DataArray.forEach((d) => {
      count += d.prix_total;
    });
    SetTotal(count);
    setVentesList(DataArray.slice(0, 15));
  };

  useEffect(() => {
    getData(addToast,"ventes")
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result);
    });

    ipcRenderer.send("sendMeVentes");
    ipcRenderer.on("VentesSending", (e, result) => {
      setVentes(result);
      setVentesAaficher(result);
      let count = 0;
      result.forEach((d) => {
        count += d.prix_total;
      });
      SetTotal(count);
      setVentesList(result.slice(0, 15));
    });
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setClientList(result);
    });
    ipcRenderer.on("ventes", () => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendMeVentes");
    })
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let SetActivePage = (e) => {
    setVentesList(ventesAafficher.slice((e - 1) * 15, 15 * e));
  };
  const PrintData = () => {
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

    ipcRenderer.send("printHistorique", {
      title: "Historiques Des Ventes",
      Data: ventesAafficher,
      periode,
      logo: Props.logo,
      type: "vente",
      total: Total,
    });
  };
  return (
    <section className="nv_devis">
      <h1 className="section_title">
        <FontAwesomeIcon icon={faHistory} /> Historique Des Ventes
      </h1>

      <div style={{ width: "100%" }} className="clients_table">
        <div className="devis_container flex_center">
          <h1 style={{ marginBottom: "20px" }} className="title">
            <FontAwesomeIcon icon={faMoneyBillWave} />
            {"  "}
            Total : {Total.toFixed(2)} Da
          </h1>
          <Button onClick={PrintData} style={{ backgroundColor: "#cf7f17" }}>
            Imprimer
          </Button>
        </div>
        <div className="table_filter">
          <div>
            Societées
            <Select onChange={setFilterData} name="Societe">
              <option disabled value="">
                {" "}
                Societe
              </option>
              <option value="tous">Tous</option>
              {Societes.map((c) => (
                <option key={c.id} value={c.Identifiant}>
                  {c.nom}
                </option>
              ))}
            </Select>
          </div>
          <div>
            Clients
            <Select onChange={setFilterData} name="category">
              <option disabled value="">
                {" "}
                Clients
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
                <th>N°</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Commerciale</th>

                <th>Quantity</th>
                <th>Prix Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ventesList.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{ventesList.indexOf(p) + 1}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.client).nom} {JSON.parse(p.client).prenom}
                  </td>
                  <td data-th="COUNTRY">{p.produit}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.commercial).nom +
                      " " +
                      JSON.parse(p.commercial).prenom}
                  </td>

                  <td data-th="COUNTRY">{p.quantity} Piece </td>
                  <td data-th="COUNTRY">{p.prix_total} Da</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.date).day}/{JSON.parse(p.date).month}/
                    {JSON.parse(p.date).year}{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }} className="flex_center">
            <Pagination
              onSelect={SetActivePage}
              activePage={1}
              items={parseInt(ventesAafficher.length / 15) + 1}
              leftBtn={<FontAwesomeIcon icon={faChevronCircleLeft} />}
              maxButtons={4}
              rightBtn={<FontAwesomeIcon icon={faChevronCircleRight} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoriqueVentes;
