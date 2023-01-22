const checkInternetConnected = require("check-internet-connected");
const { ipcRenderer } = require("electron");

const getData = (addToast, table) => {
  checkInternetConnected()
    .then((result) => {
      ipcRenderer.send("getData", table);
    })
    .catch((ex) => {
      console.log(ex);
      addToast("Verifier Votre Connection Internet !", {
        appearance: "error",
        autoDismiss: true,
        placement: "bottom-left",
      });
    });
};
export default getData;
