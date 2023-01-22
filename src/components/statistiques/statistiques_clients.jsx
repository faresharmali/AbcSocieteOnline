import React, { Component, useEffect, useState } from "react";
import Chart from "react-apexcharts";

const Statistiques_Clients = () => {
  const { ipcRenderer } = require("electron");
  let [clients, setClientsList] = useState([]);
  let [reglements, setreglements] = useState([]);
  useEffect(() => {
    ipcRenderer.send("getClientsForStats");
    ipcRenderer.on("getClientsForStatsRep", (e, result) => {
      setClientsList(result.slice(0,10));
    });
    ipcRenderer.send("sendMeReglements","client");
    ipcRenderer.on("sendMeReglementsAnswer", (e, result) => {
      setreglements(result);
    });
  }, []);

  let dataarray = [];
  let chiffreArray = [];
  let Labelarray = [];
  let ca
  clients.forEach((c) => {
    let clientname = c.nom + " " + c.prenom;
    Labelarray.push(clientname);
    let s = 0;
    let found = false;
    reglements.forEach((r) => {
      let client = JSON.parse(r.client);
      if (c.nom === client.nom && c.prenom === client.prenom) {
        found = true;
        s++;
        ca=c.chiffreAffaire
      }
    });
    if (found){
      dataarray.push(s);
      chiffreArray.push(ca);
    }
    else{
      dataarray.push(0);
      chiffreArray.push(0);
    } 
  });
  if(dataarray.length<10){
    for(let i =dataarray.length ;i<10;i++){
      Labelarray.push("")
      dataarray.push(0);
      chiffreArray.push(0)
    }
  }

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      id: "basic-bar",
    },
    xaxis: {
      categories:Labelarray,
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
  };
  const series = [
    {
      name: "Achats",
      data: dataarray,
    },
    {
      name: "Chiffre D'affaires",
      data: chiffreArray,
    },
  ];

  return (
    <section className="statistiques_section">
      <h1 className="statistiques_page_title">statistiques Des Clients</h1>
      <div className="statistiques_container">
        <div
          style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          className="statistic_element_container"
        >
          <div className="stat_element_heading flex_center">
            <h1>Achats Par Client</h1>
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

export default Statistiques_Clients;
