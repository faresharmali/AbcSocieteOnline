import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faStore,
  faChevronCircleLeft,
  faChevronCircleRight,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Button } from "react-materialize";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import getData from "../getData";

const Produits = (Props) => {
  const { ipcRenderer } = require("electron");

  let [produits, setproduits] = useState([]);
  let [Depots, setDepots] = useState([]);
  let [DepotsAffiche, setDepotsAffiche] = useState([]);
  let [ListAffiche, setListAffiche] = useState([]);
  let [selectedSociete, setSelectedSociete] = useState("tt");
  let [Societes, setSociete] = useState([]);
  const { addToast } = useToasts();

  let SetActivePage = (e) => {
    setListAffiche(produits.slice((e - 1) * 10, 10 * e));
  };

  useEffect(() => {
    getData(addToast, "Lots");

    ipcRenderer.on("Lots", (e, result) => {
      addToast("Données Synchronisées Avec Succes", {
        appearance: "success",
        autoDismiss: true,
        placement: "bottom-left",
      });
      ipcRenderer.send("sendInventory");
    });
    ipcRenderer.send("getSociete");
    ipcRenderer.on("SocieteSending", (e, result) => {
      setSociete(result);
    });
    ipcRenderer.send("getDepots");
    ipcRenderer.on("DepotsSent", (e, result) => {
      setDepots(result);
      setDepotsAffiche(result);
    });
    ipcRenderer.send("sendInventory");
    ipcRenderer.on("inventorySendig", (e, result) => {
      setproduits(result);
      setListAffiche(result.slice(0, 10));
    });
    ipcRenderer.on("produit", () => {
      ipcRenderer.send("sendMeProducts");
    });

    ipcRenderer.on("depotinventorySendig", (e, result) => {
      setproduits(result);
      setListAffiche(result.slice(0, 10));
    });
    ipcRenderer.on("OnlysocieteinventorySendig", (e, result) => {
      setproduits(result);
      setListAffiche(result.slice(0, 10));
    });
    ipcRenderer.on("societeinventorySendig", (e, result) => {
      setproduits(result);
      setListAffiche(result.slice(0, 10));
    });
    return function cleanup() {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  let filterData = (e) => {
    if (e.target.name === "nomProduitFilter") {
      setListAffiche(
        produits
          .filter((x) =>
            x.nom.toUpperCase().includes(e.target.value.toUpperCase())
          )
          .slice(0, 10)
      );
    } else if (e.target.name === "Barcode") {
      setListAffiche(produits.filter((x) => x.BarCode == e.target.value));
    } else {
      if (e.target.value == "tt") {
        setListAffiche(produits.slice(0, 10));
      } else {
        setListAffiche(produits.filter((x) => x.category == e.target.value));
      }
    }
  };
  const filterparDepot = (e) => {
    if (selectedSociete == "tt") {
      if (e.value == "tt") ipcRenderer.send("sendInventory");
      else ipcRenderer.send("sendDepotInventory", e.value);
    } else {
      if (e.value == "tt")
        ipcRenderer.send("getOnlySocieteInventory", selectedSociete);
      else
        ipcRenderer.send("getSocieteInventory", {
          depot: e.value,
          societe: selectedSociete,
        });
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      minHeight: "40px",
      height: "45px",
      marginTop: "5px",
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      marginTop: "5px",
      height: "40px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
    }),
  };

  const Depotlist = [{ value: "tt", label: "tous" }];
  DepotsAffiche.forEach((c) =>
    Depotlist.push({ value: c.identifier, label: c.nom })
  );
  const SocieteList = [{ value: "tt", label: "tous" }];
  Societes.forEach((c) =>
    SocieteList.push({ value: c.Identifiant, label: c.nom })
  );

  const printData = () => {
    ipcRenderer.send("PrintInventory", {
      title: "Inventaire",
      Data: produits,
      logo: Props.logo,
    });
  };

  return (
    <section className="nv_devis">
      <h1 className="section_title">
        <FontAwesomeIcon icon={faStore} /> Inventaire
      </h1>

      <div
        style={{ width: "100%", marginTop: "0" }}
        className="clients_table data_table"
      >
        <div className="filter_section">
          <div className="devis_container flex_center">
            <h1 className="title">
              <FontAwesomeIcon icon={faList} />
              {"  "}
              Liste Des Produits
            </h1>
          </div>

          <div
            style={{ gridTemplateColumns: "repeat(4,1fr) .4fr", gap: "10px" }}
            className="table_filter"
          >
            <Select
              placeholder="Depot"
              onChange={filterparDepot}
              styles={customStyles}
              options={Depotlist}
            />

            <input
              style={{ marginTop: "40px !important" }}
              onChange={filterData}
              type="Text"
              name="nomProduitFilter"
              placeholder="Nom Du Produit"
            />
            <input
              style={{ marginTop: "40px !important" }}
              onChange={filterData}
              type="text"
              name="Barcode"
              placeholder="Code Barre"
            />
            <Button onClick={printData} style={{ backgroundColor: "#cf7f17" }}>
              Imprimer
            </Button>
          </div>
        </div>
        <div>
          <div className="devis_container flex_center"></div>
          <table id="customers">
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Marque</th>
                <th>Prix d'achat</th>
                <th>quantité</th>
              </tr>
            </thead>
            <tbody>
              {ListAffiche.map((p) => (
                <tr key={p.id}>
                  <td data-th="COUNTRY">{p.nom}</td>
                  <td data-th="COUNTRY">{p.Marque}</td>
                  <td data-th="COUNTRY">
                    {JSON.parse(p.prix_achat).prix.reduce((a, b) => a + b) /
                      JSON.parse(p.prix_achat).prix.length}{" "}
                    Da
                  </td>
                  <td data-th="COUNTRY">{p.p ? p.p : 0} </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }} className="flex_center">
            <Pagination
              onSelect={SetActivePage}
              activePage={1}
              items={parseInt(produits.length / 10) + 1}
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

export default Produits;
