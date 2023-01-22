import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { Pagination, Select, Button } from "react-materialize";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "react-toast-notifications";
import getData from "../../getData";

const HistoriqueAchats = (Props) => {
  const { ipcRenderer } = require("electron");
  let [Achats, setAchats] = useState([]);
  let [AchatsAafficher, setAchatsAafficher] = useState([]);
  let [achatsList, setAchatList] = useState([]);
  let [categories, setCategoryList] = useState([]);
  let [Fournisseurs, setFournisseurs] = useState([]);
  let [selectedCategory, setSelectedCategory] = useState(null);
  let [MinDate, SetMinDate] = useState(null);
  let [MaxDate, SetMaxDate] = useState(null);
  let [Total, SetTotal] = useState(0);
  let [filtered, setfiltered] = useState(false);
  let [Societes, SetSocieteList] = useState([]);
  let [SelectedSociete, setSelectedSociete] = useState(null);
  const checkInternetConnected = require("check-internet-connected");
  const { addToast } = useToasts();
  useEffect(() => {
    getData(addToast,"Achats")
    ipcRenderer.send("sendMeSocietes");
    ipcRenderer.on("societesSending", (e, result) => {
      SetSocieteList(result);
    });
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setFournisseurs(result);
    });
    ipcRenderer.send("sendMeAchats2");
    ipcRenderer.on("AchatsSending2", (e, result) => {
      setAchats(result);
      setAchatsAafficher(result);
      let count = 0;
      result.forEach((d) => {
        count += d.prix_total;
      });
      SetTotal(count);
      setAchatList(result.slice(0, 20));
      ipcRenderer.on("Achats", () => {
        addToast("Données Synchronisées Avec Succes", {
          appearance: "success",
          autoDismiss: true,
          placement: "bottom-left",
        });
        ipcRenderer.send("sendMeAchats2");
      })
    });

    ipcRenderer.on("refreshRequest", () => {
      ipcRenderer.send("sendMeAchats");
    });
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result) => {
      setCategoryList(result);
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);
  let SetActivePage = (e) => {
    setAchatList(Achats.slice((e - 1) * 20, 20 * e));
  };

  const setFilterData = (e) => {
    if (e.target.name == "Societe") {
      setSelectedSociete(e.target.value);
    }
    if (e.target.name == "category") {
      setSelectedCategory(e.target.value);
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
    let DataArray = [...Achats];
    if (selectedCategory) {
      if (selectedCategory == "tous") {
        DataArray = [...Achats];
      } else {
        let mydata = DataArray.filter(
          (v) => JSON.parse(v.fournisseur).identifier == selectedCategory
        );
        DataArray = [...mydata];
      }
    }
    if (SelectedSociete) {
      if (SelectedSociete == "tous") {
        DataArray = [...Achats];
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

    setAchatsAafficher(DataArray);

    let count = 0;
    DataArray.forEach((d) => {
      count += d.prix_total;
    });
    SetTotal(count);
    setAchatList(DataArray.slice(0, 20));
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
      title: "Historiques Des Achats",
      Data: AchatsAafficher,
      periode,
      logo: Props.logo,
      total: Total,
    });
  };
  return (
    <section className="nv_devis">
      <h1 className="section_title">
        <FontAwesomeIcon icon={faHistory} /> Historique Des Achats
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
            Foursnisseurs
            <Select onChange={setFilterData} name="category">
              <option disabled value="">
                {" "}
                Foursnisseurs
              </option>
              <option value="tous">Tous</option>
              {Fournisseurs.map((c) => (
                <option key={c.id} value={c.identifier}>
                  {c.Nom} {c.prenom}
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
                <th>Fournisseur</th>
                <th>Produit</th>
                <th>Quantity</th>
                <th>Prix Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {AchatsAafficher.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{AchatsAafficher.indexOf(p) + 1}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.fournisseur).Nom}{" "}
                    {JSON.parse(p.fournisseur).prenom}
                  </td>
                  <td data-th="COUNTRY">{p.produit}</td>
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
              items={parseInt(Achats.length / 20) + 1}
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

export default HistoriqueAchats;
