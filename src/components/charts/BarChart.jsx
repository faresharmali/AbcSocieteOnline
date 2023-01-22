import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const BarChart = (props) => {
  const  options= {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: props.Labels   }
  }
  const series= [
    {
      name: "series-1",
      data: props.Data
    }
  ]

  return (
    <div className="app">
    <div className="row">
      <div className="mixed-chart">
        <Chart
          options={options}
          series={series}
          type="bar"
          width="500"
        />
      </div>
    </div>
  </div>
  );
};

export default BarChart;
