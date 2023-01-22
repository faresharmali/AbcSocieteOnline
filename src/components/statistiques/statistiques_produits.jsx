import React, { Component } from 'react';
import BarChart from "../charts/BarChart.jsx";
import LineCHart from "../charts/LineCHart.jsx";

const Statistiques_produits = () => {
    return (  <section className="statistiques_section">
    <h1 className="statistiques_page_title">statistiques Des Produits</h1>
    <div className="statistiques_container">
      <div className="statistic_element_container">
        <div className="stat_element_heading flex_center">
          <h1>Achats Par Mois</h1>
        </div>
        <div className="stat_element_content">
          <LineCHart id={"chart2"} />
        </div>
      </div>
      <div className="statistic_element_container">
        <div className="stat_element_heading flex_center">
          <h1>Achats Par Mois</h1>
        </div>
        <div className="stat_element_content">
          <LineCHart id={"chart3"} />
        </div>
      </div>
      <div style={{gridColumnStart:"1",gridColumnEnd:"3"}} className="statistic_element_container">
        <div className="stat_element_heading flex_center">
          <h1>Les Produits Les Plus Achetés</h1>
        </div>
        <div className="stat_element_content">
          <BarChart id={"chart1"} />
        </div>
      </div>
    </div>
  </section> );
}
 
export default Statistiques_produits;