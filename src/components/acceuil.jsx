import React, { useEffect, useState } from "react";
import Bureau_menu from "./menus/bureau_menu.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStore,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "react-apexcharts";
const Acceuil = (props) => {
  let { ipcRenderer } = require("electron");
  let [commerciauxList, setCommerciauxList] = useState([]);
  let [factures, setFacture] = useState([]);
  let [categories, setCategories] = useState([]);
  let [categorystats,setcategorystat]=useState([])
  let [clients,setclient]=useState([])
  let [produits,setproduits]=useState([])
  let [screenW,Setwidth]=useState(screen.width)
  useEffect(() => {
    ipcRenderer.send("sendMeProducts");
    ipcRenderer.on("ProductsSending", (e, result) => {
      setproduits(result.length);
    });
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setclient(result.length);
    });
    ipcRenderer.send("sendMeCommerciaux");
    ipcRenderer.on("CommerciauxSending", (e, result) => {
      setCommerciauxList(result);
    });
    ipcRenderer.send("sendMeFactures");
    ipcRenderer.on("FacturesSending", (e, result) => {
      setFacture(result);
    });
    ipcRenderer.send("sendMeCategories");
    ipcRenderer.on("sendMeCategoriesAnswer", (e, result1) => {
      setCategories(result1);
      ipcRenderer.send("sendMeVentes2");
      ipcRenderer.on("VentesSending2", (e, result) => {
        let categoryStat = [];
        result1.forEach((c) => {
          let s = 0;
          result.forEach((v) => {
            if (c.nom == v.category) {
              s += v.quantity;
            }
          });
          if(s>0) categoryStat.push({ nom: c.nom, qte: s });

        });
        categoryStat.sort((a, b) => {
          if (a.qte < b.qte) {
            return 1;
          }
          if (a.qte > b.qte) {
            return -1;
          }
          return 0;
        });
        setcategorystat(categoryStat.slice(0,5))
      });
    });
  }, []);
  let Labels = [];
  let DataTable = [];
  commerciauxList.forEach((c) => {
    let count = 0;
    Labels.push(c.username);
    factures.forEach((f) => {
      if (c.id == JSON.parse(f.Agent).id) {
        count++;
      }
    });
    DataTable.push(count);
  });
  let categoriesarray = [];
  let categoriesdataarray = [];
  categorystats.forEach((c) => categoriesarray.push(c.nom));
  categorystats.forEach((c) => categoriesdataarray.push(c.qte));
  
  const options = {
    plotOptions: {
      pie: {
        expandOnClick: true,
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
      type: "pie",
    },
    labels: categoriesarray,
  };
  const options2 = {
    chart: {
      toolbar: {
        show: false,
      },
      id: "basic-bar",
    },
    xaxis: {
      categories: Labels,
    },
  };
  const series = categoriesdataarray;
  const series2 = [
    {
      name: "Ventes",
      data: DataTable,
    },
  ];

  return (
    <section className="acceuil">
      <Bureau_menu setpage={props.setpage} />
      <div className="separator_div"></div>
      <div className="Bureau_stat_container flex_center">
        <div className="bureau_stat flex_center">
          <FontAwesomeIcon
            style={{ marginRight: "7px", marginBottom: "3px" }}
            icon={faUsers}
          />{" "}
          Clients : {clients}{" "}
        </div>
        <div className="bureau_stat flex_center">
          <FontAwesomeIcon
            style={{ marginRight: "7px", marginBottom: "3px" }}
            icon={faStore}
          />{" "}
          categories des produits : {categories.length}
        </div>
        <div className="bureau_stat flex_center">
          <FontAwesomeIcon
            style={{ marginRight: "7px", marginBottom: "3px" }}
            icon={faShoppingBasket}
          />{" "}
          Produits : {produits}{" "}
        </div>
      </div>

      <div className="charts_container">
        <div className="chart_Container">
          <div className="chartHeading flex_center">
            <h1>Operation Par Agent Commercial</h1>
          </div>
          <div className="app">
            <div className="row">
              <div className="mixed-chart">
                <Chart
                  options={options2}
                  series={series2}
                  type="bar"
                  width={screenW > 1400 ? "88%" :"95%"}

                />
              </div>
            </div>
          </div>
        </div>
        <div className="chart_Container">
          <div className="chartHeading flex_center">
            <h1>Top 5 Categories</h1>
          </div>
          <div className="app">
            <div className="row">
              <div className="mixed-chart">
                <Chart
                  options={options}
                  series={series}
                  type="donut"
                  
                  width={screenW > 1400 ? "80%" :"90%"}

                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Acceuil;
