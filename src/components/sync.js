const checkInternetConnected = require("check-internet-connected");
const sync = (addToast) => {
  let { ipcRenderer } = require("electron");
  setTimeout(() => {
    checkInternetConnected()
      .then((result) => {
        addToast("Données Envoyées Avec Succes !", {
          appearance: "success",
          autoDismiss: true,
          placement: "bottom-left",
        });
        ipcRenderer.send("Sync");
      })
      .catch((ex) => {
        addToast("Verifier Votre Connection Internet !", {
          appearance: "error",
          autoDismiss: true,
          placement: "bottom-left",
        });
      });
  }, 2000);
};
export default sync;
