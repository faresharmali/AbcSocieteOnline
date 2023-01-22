import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../assets/logo.png";
import User from "../../assets/user.png";
import notif from "../../assets/notification.svg";
import NoStock from "../../assets/outstock.png";
import LowStock from "../../assets/lowStock.png";
import {
  faSignOutAlt,
  faChevronRight,
  faChevronDown,
  faStore,
  faChartPie,
  faChartBar,
  faUsers,
  faCogs,
  faUser,
  faTrashRestoreAlt,
  faStoreAlt,
  faWifi,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Sync from "./utilities/Sync.jsx";
import { Dropdown, Button } from "react-materialize";
import Parametres from "./parametres/Parametres.jsx";
import Statestiques from "./statistiques/statestiques.jsx";
import Acceuil from "./acceuil.jsx";
import Gc_main from "./gestion commercial/gc_main.jsx";
import Contoire from "./gestion commercial/contoire.jsx";
import VentesComptoir from "./gestion commercial/ventes_comptoir.jsx";

import Profile from "./Profile.jsx";
import Abonnement from "./Abonnement.jsx";
import Error from "./utilities/error.jsx";
import Etat_des_stocks from "./gestion commercial/stocks/etat_des_stock.jsx";
import Corbeille from "./corbeille/corbeille.jsx";
import Notifications from "react-notifications-menu";

const Dashboard = (props) => {
  let [page, setpage] = useState(1);
  const { ipcRenderer } = require("electron");
  let [clients, setClients] = useState([]);
  let [LoggedInUser, setLoggedInUser] = useState([]);
  let [UserId, setUserId] = useState([]);
  let [Synch, ShowSynch] = useState(false);
  let [errorPP, ShowerrorPP] = useState(false);
  let [showNotif, setShowNotif] = useState(false);
  let [societe, setSociete] = useState(false);

  let [Dataset, setDataset] = useState([
    {
      image: User,
      message: " Est En Rupture De Stock",
    },
  ]);
  useEffect(() => {
    let sidebar = document.querySelector(".sidebar");
    let dashboard = document.querySelector(".main");
    let btn = document.querySelector(".menu");
    btn.addEventListener("click", (e) => {
      sidebar.classList.toggle("closeMenu");
      btn.classList.toggle("active");

      dashboard.classList.toggle("expand");
    });
    ipcRenderer.send("getSociete");
    ipcRenderer.on("SocieteSending", (e, result) => {
      setSociete(result[0]);
    });
    ipcRenderer.send("sendInventoryForStats");
    ipcRenderer.on("inventorySendigForStat", (e, result) => {
      console.log("inventa", result);
      let data = [];
      result.forEach((p) => {
        if (p.p == 0) {
          data.push({
            image: NoStock,
            message: p.nom + " Est En Rupture De Stock",
          });
        } else if (p.MinQte > p.p) {
          data.push({
            image: LowStock,
            message: p.nom + " Est En Faible Stock",
          });
        }
      });
      setDataset(data);
      setTimeout(() => {
        setShowNotif(false);
      }, 100);
      setTimeout(() => {
        setShowNotif(true);
      }, 200);
    });

    updateHistoryCount();
  }, [page]);

  const updateHistoryCount = () => {};
  ipcRenderer.on("SyncTermine", () => {
    ShowSynch(false);
  });
  ipcRenderer.on("SyncError", () => {
    ShowSynch(false);
    ShowerrorPP(true);
  });
  useEffect(() => {
    ipcRenderer.on("refreshRequest", () => {
      refreshClient();
    });
    ipcRenderer.send("windowReady");
    ipcRenderer.on("resultsent", (e, result) => {
      setClients(result);
    });
    ipcRenderer.send("GetUserId");
    ipcRenderer.on("GetUserIdAns", (e, result) => {
      setUserId(result[0].identifiant);
    });
    ipcRenderer.send("sessionChek");
    ipcRenderer.on("sessionChekRespond", (e, result) => {
      ipcRenderer.send(
        "getOnlineUser",
        JSON.parse(result[0].username).username
      );
      ipcRenderer.on("OnlineUserSending", (e, result) => {
        setLoggedInUser(result[0]);
      });
    });
  }, []);

  const refreshClient = () => {
    ipcRenderer.send("sendMeDevis2");
    ipcRenderer.send("windowReady");
  };
  const refreshLoggedInUser = (user) => {
    setLoggedInUser(user);
  };
  let selectnav = (i) => {
    let menuitems = document.querySelectorAll(".sideBar_item");
    menuitems.forEach((i) => i.classList.remove("navItemSelected"));
    menuitems[i].classList.add("navItemSelected");
  };

  return (
    <React.Fragment>
      {errorPP && <Error ShowerrorPP={ShowerrorPP} />}
      <nav className="navbar flex_center">
        <img className="logo" src={Logo} alt="" />
        <div className="user_details flex_center">
          <div style={{ marginRight: "20px" }}>
            {showNotif && <Notifications icon={notif} data={Dataset} />}
          </div>
          <img src={User} className="user_img"></img>
          <Dropdown
            style={{ width: "300px " }}
            id="Dropdown_6"
            trigger={
              <Button
                node="button"
                style={{ backgroundColor: "transparent", boxShadow: "none" }}
              >
                {LoggedInUser && LoggedInUser.username} {"  "}
                <FontAwesomeIcon
                  style={{ fontSize: "14px" }}
                  icon={faChevronDown}
                />
              </Button>
            }
          >
            <h1 className="username flex_center" onClick={() => setpage(8)}>
              <FontAwesomeIcon style={{ fontSize: "18px" }} icon={faUser} />{" "}
              Profile
            </h1>
            <h1 className="username flex_center" onClick={() => setpage(9)}>
              <FontAwesomeIcon style={{ fontSize: "18px" }} icon={faUser} />{" "}
              Abonnement
            </h1>

            <h1 className="username flex_center" onClick={props.logout}>
              {" "}
              <FontAwesomeIcon
                style={{ fontSize: "18px" }}
                icon={faSignOutAlt}
              />{" "}
              Deconnecter
            </h1>
          </Dropdown>
        </div>
      </nav>

      <section className="dashboard">
        <div className="sidebar">
          <div
            onClick={() => {
              setpage(1);
              selectnav(0);
            }}
            className="sideBar_item navItemSelected flex_center"
          >
            <span className="item_title ">
              <FontAwesomeIcon icon={faChartBar} /> Bureau{" "}
            </span>{" "}
            <FontAwesomeIcon className="icon" icon={faChevronRight} />
          </div>
          <div
            onClick={() => {
              setpage(2);
              selectnav(1);
            }}
            className="sideBar_item flex_center"
          >
            <span className="item_title">
              <FontAwesomeIcon icon={faUsers} /> Gestion Commercial{" "}
            </span>{" "}
            <FontAwesomeIcon className="icon" icon={faChevronRight} />
          </div>
          <div
            onClick={() => {
              setpage(11);
              selectnav(2);
            }}
            className="sideBar_item flex_center"
          >
            <span className="item_title">
              <FontAwesomeIcon icon={faStoreAlt} /> Ventes Au Comptoir{" "}
            </span>{" "}
            <FontAwesomeIcon className="icon" icon={faChevronRight} />
          </div>
          <div
            onClick={() => {
              setpage(7);
              selectnav(3);
            }}
            className="sideBar_item flex_center"
          >
            <span className="item_title">
              <FontAwesomeIcon icon={faChartPie} /> Statistiques{" "}
            </span>{" "}
            <FontAwesomeIcon className="icon" icon={faChevronRight} />
          </div>

          <div
            onClick={() => {
              setpage(4);
              selectnav(4);
            }}
            className="sideBar_item flex_center"
          >
            <span className="item_title">
              <FontAwesomeIcon icon={faStore} /> Etat De Stock{" "}
            </span>{" "}
            <FontAwesomeIcon className="icon" icon={faChevronRight} />
          </div>
          {LoggedInUser && LoggedInUser.role == "Administrateur" && (
            <div
              onClick={() => {
                setpage(5);
                selectnav(5);
              }}
              className="sideBar_item flex_center"
            >
              <span className="item_title">
                <FontAwesomeIcon icon={faCogs} /> Paramétres{" "}
              </span>{" "}
              <FontAwesomeIcon className="icon" icon={faChevronRight} />
            </div>
          )}
          <div
            onClick={() => {
              setpage(10);
              if (LoggedInUser.role == "Administrateur") {
                selectnav(6);
              } else {
                selectnav(5);
              }
            }}
            className="sideBar_item flex_center"
          >
            <span className="item_title">
              <FontAwesomeIcon icon={faTrashRestoreAlt} /> Corbeille{" "}
            </span>{" "}
            <FontAwesomeIcon className="icon" icon={faChevronRight} />
          </div>
          <div className="sidebarInfos">
            <div className="networkStatus"></div>
            <div className="clientService flex_center">
              <h1>
                {" "}
                <FontAwesomeIcon icon={faUsers} /> Service Clients
              </h1>
              <h1>
                <FontAwesomeIcon icon={faPhoneAlt} /> 0561847050
              </h1>
              <h1>
                {" "}
                <FontAwesomeIcon icon={faEnvelope} />{" "}
                contact@abc-communication.dz
              </h1>
            </div>
          </div>
        </div>
        <div className="main">
          {page == 1 && (
            <Acceuil
              setpage={setpage}
              clientsTotal={clients.length}
              LoggedInUser={LoggedInUser}
            />
          )}
          {page == 2 && (
            <Gc_main
              refreshClient={refreshClient}
              updateHistoryCount={updateHistoryCount}
              UserId={UserId}
              clients={clients}
              LoggedInUser={LoggedInUser}
            />
          )}
          {page == 4 && <Etat_des_stocks />}
          {page == 5 && <Parametres LoggedInUser={LoggedInUser} />}
          {page == 7 && <Statestiques />}
          {page == 8 && (
            <Profile
              refreshLoggedInUser={refreshLoggedInUser}
              LoggedInUser={LoggedInUser}
            />
          )}
          {page == 9 && <Abonnement LoggedInUser={LoggedInUser} />}
          {page == 10 && (
            <Corbeille
              Logo={societe.profileImage}
              LoggedInUser={LoggedInUser}
            />
          )}

          {page == 11 && (
            <VentesComptoir
              pagehandler={setpage}
              clients={clients}
              LoggedInUser={LoggedInUser}
              Logo={societe.profileImage}
              societe={societe}
            />
          )}
          {page == 12 && (
            <Contoire
              pagehandler={setpage}
              clients={clients}
              LoggedInUser={LoggedInUser}
              Logo={societe.profileImage}
              Societe={societe}
            />
          )}
        </div>
      </section>
    </React.Fragment>
  );
};

export default Dashboard;
