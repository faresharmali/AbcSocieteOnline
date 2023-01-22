import React, {useEffect, useState } from "react";
import Chart from "react-apexcharts";

const Statistiques_Vents = () => {
  const { ipcRenderer } = require("electron");
  let [ProduitsList, setNomsDesProduits] = useState([]);
  let [quantiteList, setquantiteList] = useState([]);
  let [ProductPerMonth, setProductPerMonth] = useState([]);

  useEffect(() => {
    ipcRenderer.on("VentesSending2", (e, result) => {
      let NomsDesProduits = [];
      let quantites = [];
      let ProductPerMonth = [0];
      let Pcounter = 0;
      for (let i = 1; i <= 12; i++) {
        result.forEach((p) => {
          if (JSON.parse(p.date).month === i) {
            Pcounter++;
          }
        });
        ProductPerMonth.push(Pcounter);
        setProductPerMonth(ProductPerMonth);
        Pcounter = 0;
      }
      result.forEach((v) => {
        let found = NomsDesProduits.find(function (element) {
          return element == v.produit;
        });
        if (!found) NomsDesProduits.push(v.produit);
      });
      setNomsDesProduits(NomsDesProduits.slice(0, 5));
      NomsDesProduits.forEach((NP) => {
        let counter = 0;
        result.forEach((P) => {
          if (NP === P.produit) {
            counter += P.quantity;
          }
        });
        quantites.push(counter);
      });
      setquantiteList(quantites.slice(0, 5));
    });
    ipcRenderer.send("sendMeVentes2");

  }, []);
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      id: "basic-bar",
    },
    xaxis: {
      categories: ProduitsList,
    },
    stroke: {
      curve: "smooth",
    },
  };
  const series = [
    {
      name: "ventes",
      data: quantiteList,
    },
  ];
  const options2 = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        "",
        "Jan",
        "Ferv",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Aou",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    stroke: {
      curve: "smooth",
    },
  };
  const series2 = [
    {
      name: "ventes",
      data: ProductPerMonth,
    },
  ];
  return (
    <section className="statistiques_section">
      <h1 className="statistiques_page_title">statistiques Des ventes</h1>
      <div className="statistiques_container">
        <div className="statistic_element_container">
          <div className="stat_element_heading flex_center">
            <h1>Vente Par Mois</h1>
          </div>
          <div className="stat_element_content">
            <Chart
              options={options2}
              series={series2}
              type="line"
              height={screen.width >1400 ? 600 : 390}                  
              />
          </div>
        </div>
        <div className="statistic_element_container">
          <div className="stat_element_heading flex_center">
            <h1>Les Produits Les Plus Vendus</h1>
          </div>
          <div className="stat_element_content">
            <div className="app">
              <div className="row">
                <div className="mixed-chart">
                  <Chart
                    options={options}
                    series={series}
                    type="bar"
                    height={screen.width >1400 ? 600 : 390}                  
                  />
                </div>
              </div>
            </div>
          </div>
      
        </div>
      
      </div>
    </section>
  );
};

export default Statistiques_Vents;
