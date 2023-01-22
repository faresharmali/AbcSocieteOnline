import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const PyChar = (props) => {
 
const  options= {
    chart: {
      type: 'donut'
    },
    labels: ['Apple', 'Mango'],
    
  }
  const series= [44, 55]



  return (
    <div className="app">
    <div className="row">
      <div className="mixed-chart">
        <Chart
          options={options}
          series={series}
          type="donut"
          width="450"
        />
      </div>
    </div>
  </div>
  );
};

export default PyChar;
