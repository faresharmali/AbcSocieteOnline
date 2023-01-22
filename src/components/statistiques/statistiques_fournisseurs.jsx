import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const Statistiques_Fournisseurs = () => {
  const { ipcRenderer } = require("electron");
  let [fournisseurs, setfournisseurs] = useState([]);
  let [bonEntre, setBonsEntre] = useState([]);
  useEffect(() => {
    ipcRenderer.send("sendMeFournisseursForStats");
    ipcRenderer.on("FournisseursSendingForStats", (e, result) => {
      setfournisseurs(result.slice(0,10));
    });
    ipcRenderer.send("sendMeBonEntre");
    ipcRenderer.on("BonsEntreSending", (e, result) => {
      setBonsEntre(result);
    });
  }, []);

  let dataarray = [];
  let Labelarray = [];
  let chiffreArray = [];
  let ca
  fournisseurs.forEach((c) => {
    let fournisseurName = c.Nom + " " + c.prenom;
    Labelarray.push(fournisseurName);
    let s = 0;
    let found = false;
    bonEntre.forEach((r) => {
      let fourni = JSON.parse(r.fournisseur);
      if (c.Nom === fourni.Nom && c.prenom === fourni.prenom) {
        found = true;
        s++;
        ca=c.chiffreAffaire
        console.log("affaire",ca)
      }
    });
    if (found){
      dataarray.push(s);
      chiffreArray.push(ca)
    }
    else{
      dataarray.push(0);
      chiffreArray.push(0)

    }
  });
  if(dataarray.length<10){
    for(let i =dataarray.length ;i<10;i++){
      Labelarray.push("")
      dataarray.push(0);
      chiffreArray.push(0)
    }
  }
console.log()
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      id: "basic-bar",
    },
    xaxis: {
      categories: Labelarray,
    },
    yaxis: [
      {
        title: {
          text: "Achats"
        },
      },
      {
        opposite: true,
        title: {
          text: "Chiffres D'affaires"
        }
      }
    ],
    stroke: {
      curve: "smooth",
    },
  };
  const series = [
    {
      name: "Achats",
      data: dataarray,
    },
    {
      name: "chiffre D'affaire",
      data: chiffreArray,
    },
  ];
  return (
    <section className="statistiques_section">
      <h1 className="statistiques_page_title">statistiques Des Fournisseurs</h1>
      <div className="statistiques_container">
        <div
          style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          className="statistic_element_container"
        >
          <div className="stat_element_heading flex_center">
            <h1>Commandes Par Fournisseur</h1>
          </div>
          <div className="stat_element_content">
            <Chart
              options={options}
              series={series}
              type="bar"
              height={screen.width > 1400 ? 600 : 390}
            />{" "}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistiques_Fournisseurs;
