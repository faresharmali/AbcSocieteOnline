import React, { useEffect, useState } from "react";

const LineCHart = (props) => {
  let Chart = require("chart.js");
  
  useEffect(() => {
  
      var ctx = document.getElementById(props.id).getContext("2d");
      var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["","Jan","Ferv","Mar","Avr","Mai","Juin","Juil","Aou","Sep","Oct","Nov","Dec"],
          datasets: [{ 
              data: props.Data,
              label: "Produits Vendus",
              borderColor: "#3e95cd",
              fill: false
            }, 
          ]
        },
  
  
    });
  });

  return <canvas className="ChartCanvas" id={props.id}></canvas>;
};

export default LineCHart;
