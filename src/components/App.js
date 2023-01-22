import React from "react";
import Login from "./login.jsx";
import { useState, useEffect } from "react";
import Dashboard from "./dashboard.jsx";
import { machineId, machineIdSync } from "node-machine-id";
import { ToastProvider } from "react-toast-notifications";

const App = () => {
  let [loggedIn, loggin] = useState(false);
  let [currentPage, setPage] = useState(2);
  const { ipcRenderer } = require("electron");
  useEffect(() => {
    ipcRenderer.send("VerifierCle");
    ipcRenderer.on("VerifierCleRep", (e, result) => {
      if (result.length > 0) {
        ipcRenderer.send("DateAbbonement");
        ipcRenderer.on("DateAbbonementRep", (e, result) => {
          let Ndate = new Date();
          let MyDate = {
            day: Ndate.getDate(),
            month: Ndate.getMonth() + 1,
            year: Ndate.getFullYear(),
          };
          let finDate = JSON.parse(result[0].FinAbonnement);
          let activated = false;
          if (MyDate.year < parseInt(finDate.year)) {
            activated = true;
          } else if (MyDate.year == parseInt(finDate.year)) {
            if (MyDate.month < parseInt(finDate.month)) {
              activated = true;
            } else if (MyDate.month == parseInt(finDate.month)) {
              if (MyDate.day <= parseInt(finDate.day)) {
                activated = true;
              } else {
              }
            } else {
            }
          } else {
          }
          let id = machineIdSync();

          if (result[0].Identifiant != id) {
            activated = false;
          }
          if (activated) {
            ipcRenderer.send("sessionChek");
            ipcRenderer.on("sessionChekRespond", (e, result) => {
              if (result.length > 0) loggin(true);
              setPage(0);
            });
          } else {
            ipcRenderer.send("DesactiverAbonnement");
            ipcRenderer.on("DesactiverAbonnementRep", (e, result) => {
              setPage(3);
              logout();
            });
          }
        });
      } else {
        setPage(3);
        logout();
      }
    });
  }, []);

  let handleChange = (data) => {
    ipcRenderer.send("loginRequest", data);
    ipcRenderer.on("loggedIn", () => {
      loggin(true);
    });
  };
  let logout = () => {
    ipcRenderer.send("logoutRequest");
    ipcRenderer.on("logoutRequestAnswer", () => {
      loggin(false);
    });
  };

  if (!loggedIn) {
    return (
      <Login
        currentPage={currentPage}
        setPage={setPage}
        handleChange={handleChange}
      />
    );
  } else {
    return (
      <ToastProvider PlacementType="bottom-left">
        {" "}
        <Dashboard logout={logout} />
      </ToastProvider>
    );
  }
};

export default App;
