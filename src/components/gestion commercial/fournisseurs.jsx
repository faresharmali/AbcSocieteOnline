import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlusCircle,
  faPlus,
  faTruck,
  faTrashAlt,
  faEdit,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  TextInput,
  Collapsible,
  CollapsibleItem,
} from "react-materialize";
import DeletePopup from "../utilities/Delete_popup.jsx";
import EditFPopup from "../utilities/EditFournisseur.jsx";
import { useToasts } from "react-toast-notifications";
import sync from "../sync.js";
const Fournisseurs = (Props) => {
  const { ipcRenderer } = require("electron");
  let [nom, setnom] = useState("");
  let [prenom, setPrenom] = useState("");
  let [num, setnum] = useState("");
  let [RC, setRC] = useState("");
  let [NIS, setNIS] = useState("");
  let [NIF, setNIF] = useState("");
  let [ART, setART] = useState("");
  let [adresse, setAdresse] = useState("");
  let [fournisseurs, setFournisseurs] = useState([]);
  let [popup, showPopup] = useState(false);
  let [EditPopup, showEdit] = useState(false);
  let [SelectedFournisseur, setselectedFournisseur] = useState(null);
  const checkInternetConnected = require("check-internet-connected");
  const { addToast } = useToasts();

  let refresher = () => {
    setnom("");
    setPrenom("");
    setnum("");
    setAdresse("");
    setRC("");
    setNIF("");
    setNIS("");
    setART("");

    ipcRenderer.send("sendMeFournisseurs");
  };
  useEffect(() => {
    ipcRenderer.send("sendMeFournisseurs");
    ipcRenderer.on("FournisseursSending", (e, result) => {
      setFournisseurs(result);
    });
  }, []);

  let addFournisseur = () => {
    const elem = document.querySelector(".collapsible");
    const instance = M.Collapsible.getInstance(elem);
    if (nom.trim() != "") {
      let Product_Obj = {
        nom,
        prenom,
        num,
        adresse,
        NIS,
        NIF,
        RC,
        ART,
      };
      ipcRenderer.send("AddFournisseur", Product_Obj);
      ipcRenderer.on("AddFournisseurAnswer", () => {
        instance.close(0);

        refresher();
      });
      sync(addToast);
    } else {
      alert("Le Champ Nom Est Obligatoire");
    }
  };
  let SetData = (e) => {
    switch (e.target.name) {
      case "nom":
        setnom(e.target.value);
        break;
      case "prenom":
        setPrenom(e.target.value);
        break;
      case "num":
        setnum(e.target.value);
        break;
      case "adresse":
        setAdresse(e.target.value);
        break;
      case "RC":
        setRC(e.target.value);
        break;
      case "NIS":
        setNIS(e.target.value);
        break;
      case "NIF":
        setNIF(e.target.value);
        break;
      case "ART":
        setART(e.target.value);
        break;
    }
  };
  const deleteFournisseur = () => {
    ipcRenderer.send("SendToTrash", {
      id: SelectedFournisseur.id,
      table: "fournisseurs",
    });
    ipcRenderer.on("SendToTrashAnswer", (e, result) => {
      ipcRenderer.send("sendMeDevis");

      showPopup(false);
      refresher();
    });
  };
  const refresh = () => {
    ipcRenderer.send("sendMeFournisseurs");
  };
  const printData = () => {
    ipcRenderer.send("printFournisseurs", {Data:fournisseurs,logo:Props.logo});
  };
  return (
    <section className="nv_devis">
      {EditPopup && (
        <EditFPopup
          showEdit={showEdit}
          refresh={refresh}
          Fournisseur={SelectedFournisseur}
        />
      )}
      {popup && (
        <DeletePopup
          delete_devis={deleteFournisseur}
          ShowDelete={showPopup}
          title={"ce fournisseur"}
        />
      )}
      <h1 className="section_title">
        <FontAwesomeIcon icon={faTruck} /> Fournisseurs
      </h1>
      <Collapsible style={{ fontSize: "25px" }} accordion>
        <CollapsibleItem
          expanded={false}
          header="  Ajouter Un Fournisseur"
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
            <div className="add_product_container3">
              <TextInput
                onChange={SetData}
                id="input1"
                label="Raison Social / Nom Prenom"
                name="nom"
                value={nom}
              />

              <TextInput
                onChange={SetData}
                id="input4"
                label="Numero de telephone"
                name="num"
                value={num}
              />
              <TextInput
                onChange={SetData}
                id="input2"
                label="Adresse"
                name="adresse"
                value={adresse}
              />
            </div>
            <div className="add_product_container3">
              <TextInput
                onChange={SetData}
                id="RC"
                label="N.R.C"
                name="RC"
                value={RC}
              />
              <TextInput
                onChange={SetData}
                id="NIS"
                label="NIS"
                name="NIS"
                value={NIS}
              />
              <TextInput
                onChange={SetData}
                id="NIF"
                label="NIF"
                name="NIF"
                value={NIF}
              />
              <TextInput
                onChange={SetData}
                id="ART"
                label="N° Article"
                name="ART"
                value={ART}
              />

              <Button
                onClick={addFournisseur}
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
            Liste Des Fournisseurs
          </h1>
        <Button
              onClick={printData}
              style={{
                backgroundColor: "#f8991c",
                marginBottom: "15px",
                marginLeft: "10px",
              }}
            >
              <FontAwesomeIcon icon={faPrint} />
              Imprimer
            </Button>{" "}
        </div>
        <div>
          <table id="customers">
            <thead>
              <tr>
                <th>Nom Prenom</th>
                <th>Numero De Telephone</th>
                <th>Addresse</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((x) => (
                <tr key={x.id}>
                  <td data-th="COUNTRY">
                    {x.Nom} {x.prenom}
                  </td>
                  <td data-th="COUNTRY">{x.num}</td>
                  <td data-th="COUNTRY"> {x.adresse}</td>
                  <td data-th="COUNTRY">
                    <Button
                      onClick={() => {
                        showEdit(true);
                        setselectedFournisseur(x);
                      }}
                      style={{
                        marginLeft: "10px",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>{" "}
                    <Button
                      onClick={() => {
                        showPopup(true);
                        setselectedFournisseur(x);
                      }}
                      style={{
                        backgroundColor: "rgb(207, 31, 31)",
                        marginLeft: "10px",
                        width: "35px",
                        height: "35px",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Fournisseurs;
