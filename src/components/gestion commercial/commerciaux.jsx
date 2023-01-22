import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faIdCardAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  Select,
  Button,
  TextInput,
  Collapsible,
  CollapsibleItem,
} from "react-materialize";

const Commerciaux = () => {
  return (
    <div>

    <section className="nv_devis">
      <h1 className="section_title">
        <FontAwesomeIcon icon={faIdCardAlt} /> Commerciaux
      </h1>
      <Collapsible style={{ fontSize: "25px" }} accordion>
        <CollapsibleItem
          expanded={false}
          header="  Ajouter Un Agent Commercial"
          icon={
            <FontAwesomeIcon
              style={{ marginTop: "5px", marginRight: "10px" }}
              icon={faPlusCircle}
            />
          }
          node="div"
          style={{ backgroundColor: "#fff" }}
        >
          <div style={{ border: "none" }} className="nvDevis_container ">
            <div className="add_product_container2">
              <TextInput id="TextInput-4" label="First Name" name="nom" />
              <Select name="category">
                <option disabled value="">
                  {" "}
                  category
                </option>
                <option value="smart phone">smart phones</option>
                <option value="smart phone">smart phones</option>
                <option value="apple">apple Phones</option>
              </Select>

              <input
                name="prixachat"
                style={{ marginTop: "15px" }}
                type="number"
                placeholder="Prix d'achat"
              />
              <input
                name="prixvente"
                style={{ marginTop: "15px" }}
                type="number"
                placeholder="Prix de Vente"
              />
              <input
                name="quantity"
                style={{ marginTop: "15px" }}
                type="number"
                placeholder="Quantité"
              />
              <Button
                style={{ marginTop: "20px", backgroundColor: "#1C5161" }}
                floating
                icon={
                  <FontAwesomeIcon style={{ fontSize: "20px" }} icon={faPlus} />
                }
                large
                node="button"
                waves="light"
              />
            </div>
          </div>
        </CollapsibleItem>
      </Collapsible>
      <div style={{ width: "100%" }} className="clients_table">
        <div className="devis_container flex_center">
          <h1 className="title">
            <FontAwesomeIcon icon={faList} />
            {"  "}
            Liste Des Commerciaux
          </h1>
        </div>

        <div>
          <table id="customers">
            <thead>
              <tr>
                <th>Nom Prenom</th>
                <th>Numero De Telephone</th>
                <th>Addresse</th>
                <th>Date D'ajout</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-th="COUNTRY"></td>
                <td data-th="COUNTRY"></td>
                <td data-th="COUNTRY"> </td>
                <td data-th="COUNTRY"> </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    </div>

  );
};

export default Commerciaux;
