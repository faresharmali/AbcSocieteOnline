const path = require("path");
const url = require("url");
var fs = require("fs");
var WriteLock = require("rwlock");
const axios = require("axios").default;
const api = "https://dry-anchorage-71650.herokuapp.com";
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
var admin = require("firebase-admin");
var serviceAccount = require("./abc-gestion-offline-firebase-adminsdk-e24ng-c3ac6c9e16");
var lock = new WriteLock();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const FireBase = admin.firestore();
FireBase.settings({ timestampsInSnapshots: true });

require("events").EventEmitter.defaultMaxListeners = 5000000;
const dbPath = path.join(__dirname, "/gestioncommercial2.sqlite");

let knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: dbPath,
  },
});

let mainWindow;
let isDev = false;
if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  isDev = true;
}

const template = [];
const menu = Menu.buildFromTemplate(template);
//Menu.setApplicationMenu(menu);

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Abc gestion commerciale",
    width: 1100,
    height: 800,
    show: false,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => (mainWindow = null));
}
app.on("ready", () => {
  //send clients data
  createMainWindow();

  ipcMain.on("windowReady", () => {
    let result = knex
      .select()
      .table("clients")
      .where("deleted", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("resultsent", rows);
    });
  });

  ipcMain.on("getClientsForStats", () => {
    let result = knex
      .select()
      .table("clients")
      .where("deleted", 0)
      .orderBy("chiffreAffaire", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("getClientsForStatsRep", rows);
    });
  });
  ipcMain.on("GiveMeClients", () => {
    let result = knex.select().table("clients").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("ClientsBack", rows);
    });
  });

  // Importer Des Produits
  ipcMain.on("importProducts", (e, options) => {
    let found = false;
    let result = knex.select().table("produit");
    result.then((rows) => {
      options.forEach((p) => {
        found = false;
        rows.forEach((r) => {
          if (p[0].trim().toUpperCase() == r.nom.trim().toUpperCase()) {
            found = true;
          }
        });
        if (!found) {
          if (p.length > 1) {
            knex("produit")
              .insert([
                {
                  nom: p[0],
                  category: p[1],
                  Marque: p[2],
                  prix_achat: p[3],
                  prix_vente: p[4],
                  prix_gros: p[5],
                  prix_semi: p[6],
                  MinQte: p[7],
                  profit: p[8],
                  BarCode: p[9],
                  quantity: p[10],
                  deleted: 0,
                },
              ])
              .then(function (result) {
                console.log("added");
              });
          }
        }
      });
    });
  });
  // Importer Des Clients
  ipcMain.on("importClients", (e, options) => {
    let found = false;
    let result = knex.select().table("clients");
    result.then((rows) => {
      options.forEach((p) => {
        found = false;
        rows.forEach((r) => {
          if (
            p[0].trim().toUpperCase() == r.nom.trim().toUpperCase() &&
            p[1].trim().toUpperCase() == r.prenom.trim().toUpperCase()
          ) {
            found = true;
            let result = knex("clients")
              .where("id", "=", r.id)
              .update({ adresse: p[2], num: p[3] });
            result.then((rows) => {});
          }
        });
        if (!found) {
          if (p.length > 1) {
            knex("clients")
              .insert([
                {
                  nom: p[0],
                  prenom: p[1],
                  adresse: p[2],
                  num: p[3],
                },
              ])
              .then(function (result) {});
          }
        }
      });
    });
  });
  // Importer Des fournisseurs
  ipcMain.on("importFournisseurs", (e, options) => {
    let found = false;
    let result = knex.select().table("fournisseurs");
    result.then((rows) => {
      options.forEach((p) => {
        found = false;
        rows.forEach((r) => {
          if (
            p[0].trim().toUpperCase() == r.Nom.trim().toUpperCase() &&
            p[1].trim().toUpperCase() == r.prenom.trim().toUpperCase()
          ) {
            found = true;
            let result = knex("clients")
              .where("id", "=", r.id)
              .update({ adresse: p[2], num: p[3] });
            result.then((rows) => {});
          }
        });
        if (!found) {
          if (p.length > 1) {
            knex("fournisseurs")
              .insert([
                {
                  nom: p[0],
                  prenom: p[1],
                  adresse: p[2],
                  num: p[3],
                },
              ])
              .then(function (result) {});
          }
        }
      });
    });
  });
  //insert new client
  ipcMain.on("newUser", (e, options) => {
    let Ndate = new Date();
    let MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      nom: options.nom,
      prenom: options.Prenom,
      num: options.Num,
      adresse: options.Adress,
      type: options.Type,
      nrc: options.NRC,
      Narticle: options.ART,
      nif: options.Nis,
      Nis: options.Nif,
      DateAjout: JSON.stringify(MyDate),
      identifier: IdentifierN,
      solde: 0,
      chiffreAffaire: 0,
      deleted: 0,
    };
    knex("clients")
      .insert([{ ...infos }])

      .then(function (result) {
        let mydata = {
          targetTable: "clients",
          change: "insert",
          data: JSON.stringify(infos),
        };
        addToHistory(mydata);
        mainWindow.webContents.send("addUserResult");
      });
  });
  //insert new Agent
  ipcMain.on("NewAgent", (e, options) => {
    let infos = {
      nom: options.Nom,
      prenom: options.Prenom,
      num: options.Mobile,
      produits_vendu: 0,
      prime: 0,
      deleted: 0,
      identifier: Math.random().toString(36).substr(2, 9),
    };
    knex("Agents")
      .insert([
        {
          ...infos,
        },
      ])
      .then(function (result) {
        let data = {
          targetTable: "Agents",
          change: "insert",
          data: JSON.stringify({
            ...infos,
          }),
        };
        addToHistory(data);
        mainWindow.webContents.send("addcommerciauxResult");
      });
  });
  //insert new commerciaux
  ipcMain.on("newCommercieaux", (e, options) => {
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      nom: options.nom,
      prenom: options.Prenom,
      num: options.Num,
      adresse: options.Adress,
      username: options.UserName,
      password: options.Password,
      role: options.role,
      deleted: 0,
      identifier: IdentifierN,
    };
    knex("commerciaux")
      .insert([{ ...infos }])
      .then(function (result) {
        let data = {
          targetTable: "Commerciaux",
          change: "insert",
          data: JSON.stringify({
            ...infos,
          }),
        };
        addToHistory(data);
        mainWindow.webContents.send("addcommerciauxResult");
      });
  });
  //insert new Societe
  ipcMain.on("newSociete", (e, options) => {
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      nom: options.nom,
      email: options.email,
      num: options.Num,
      adresse: options.Adress,
      profileImage: "",
      NRC: options.NRC,
      NIF: options.NIF,
      ART: options.ART,
      description: options.Description,
      identifier: IdentifierN,
      deleted: 0,
      Identifiant: options.identifier,
      Password: options.password,
    };
    knex("societes")
      .insert([{ ...infos }])

      .then(function (result) {
        let data = {
          targetTable: "Societes",
          change: "insert",
          data: JSON.stringify({
            ...infos,
          }),
        };
        addToHistory(data);
        mainWindow.webContents.send("addSocieterResult");
      });
  });

  //sending bons de sortie from db
  ipcMain.on("sendTaxes", () => {
    let result = knex.select().table("taxes");
    result.then((rows) => {
      mainWindow.webContents.send("taxesSending", rows);
    });
  });
  //sending bons de sortie from db
  ipcMain.on("sendMeCharges", () => {
    let result = knex
      .select()
      .table("charges")
      .where("deleted", "=", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("sendMeChargesAnwswer", rows);
    });
  });
  //sending bons de sortie from db
  ipcMain.on("sendMeBonSortie3", () => {
    let result = knex
      .select()
      .table("BonSortie")
      .where("deleted", "=", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("BonSortieSending3", rows);
    });
  });
  //sending bons de sortie from db
  ipcMain.on("sendMeBonSortie2", () => {
    let result = knex.select().table("BonSortie").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("BonSortieSending2", rows);
    });
  });
  //sending history number
  ipcMain.on("HistoryNumber", () => {
    let result = knex.select().table("ChangeHistory");
    result.then((rows) => {
      mainWindow.webContents.send("HistoryNumberRep", rows.length);
    });
  });
  //sending bons de sortie from db
  ipcMain.on("sendMeBonSortie", () => {
    let result = knex
      .select()
      .table("BonSortie")
      .where("deleted", "=", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("BonSortieSending", rows);
    });
  });
  //sending bons de commande from db
  ipcMain.on("sendMeBonCommande", () => {
    let result = knex
      .select()
      .table("Bons_commande")
      .where("deleted", "=", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("BonCommandeSending", rows);
    });
  });
  //sending reglements non paye
  ipcMain.on("sendMeReglementsNonPaye", () => {
    let result = knex("Reglements").where("paye", 0).orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("sendMeReglementsNonPayeRep", rows);
    });
  });
  //sending reglements
  ipcMain.on("sendMeReglements", (e, options) => {
    console.log(options);
    let result = knex
      .select()
      .table("Reglements")
      .where("type", "=", options)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("sendMeReglementsAnswer", rows);
    });
  });
  ipcMain.on("sendMeBonEntre", () => {
    let result = knex
      .select()
      .table("BonsEntre")
      .where("deleted", "=", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("BonsEntreSending", rows);
    });
  });
  ipcMain.on("GetUserId", () => {
    let result = knex.select().table("utilisateur");
    result.then((rows) => {
      mainWindow.webContents.send("GetUserIdAns", rows);
    });
  });
  //sending commerciaux from db
  ipcMain.on("sendMeCommerciaux", () => {
    let result = knex.select().table("commerciaux").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("CommerciauxSending", rows);
    });
  });
  //sending agents from db
  ipcMain.on("sendMeAgents", () => {
    let result = knex.select().table("Agents").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("sendMeAgentsRep", rows);
    });
  });
  //get inventory

  async function getInventory() {
    const result = knex
      .select("*")
      .from("produit")
      .join("Lots", "Lots.product", "=", "produit.identifier")
      .sum({ p: "Lots.quantity" })
      .groupBy("Lots.product");

    const result2 = knex
      .select("*")
      .from("produit")
      .leftJoin("Lots", "Lots.product", "=", "produit.identifier")
      .havingNull("Lots.quantity")
      .groupBy("produit.identifier");
    const results = await Promise.all([result, result2]);
    console.log(results[1]);
    return results[0].concat(results[1]).sort((a, b) => a.id - b.id);
  }
  async function getDepotInventory(depot) {
    const result = knex
      .select("*")
      .from("produit")
      .join("Lots", "Lots.product", "=", "produit.identifier")
      .where("depot", depot)
      .sum({ p: "Lots.quantity" })
      .groupBy("Lots.product");
    const result2 = knex
      .select("*")
      .from("produit")
      .leftJoin("Lots", "Lots.product", "=", "produit.identifier")
      .where("depot", depot)
      .groupBy("produit.identifier")
      .havingNull("Lots.quantity");
    const results = await Promise.all([result, result2]);
    return results[0].concat(results[1]).sort((a, b) => a.id - b.id);
  }
  async function getOnlySocieteInventory(societe) {
    const result = knex
      .select("*")
      .from("produit")
      .join("Lots", "Lots.product", "=", "produit.identifier")
      .where("societe", societe)
      .sum({ p: "Lots.quantity" })
      .groupBy("Lots.product");
    const result2 = knex
      .select("*")
      .from("produit")
      .leftJoin("Lots", "Lots.product", "=", "produit.identifier")
      .where("societe", societe)
      .groupBy("produit.identifier")
      .havingNull("Lots.quantity");
    const results = await Promise.all([result, result2]);
    return results[0].concat(results[1]).sort((a, b) => a.id - b.id);
  }
  async function getSocieteInventory(depot, societe) {
    const result = knex
      .select("*")
      .from("produit")
      .join("Lots", "Lots.product", "=", "produit.identifier")
      .where("depot", depot)
      .where("societe", societe)
      .sum({ p: "Lots.quantity" })
      .groupBy("Lots.product");
    const result2 = knex
      .select("*")
      .from("produit")
      .leftJoin("Lots", "Lots.product", "=", "produit.identifier")
      .where("depot", depot)
      .where("societe", societe)
      .groupBy("produit.identifier")
      .havingNull("Lots.quantity");
    const results = await Promise.all([result, result2]);
    return results[0].concat(results[1]).sort((a, b) => a.id - b.id);
  }
  ipcMain.on("sendInventory", async () => {
    let result = await getInventory();
    mainWindow.webContents.send("inventorySendig", result);
  });
  ipcMain.on("sendDepotInventory", async (e, option) => {
    let result = await getDepotInventory(option);
    mainWindow.webContents.send("depotinventorySendig", result);
  });
  ipcMain.on("sendSocieteInventory", async (e, option) => {
    let result = await getDepotInventory(option);
    mainWindow.webContents.send("depotinventorySendig", result);
  });

  ipcMain.on("getOnlySocieteInventory", async (e, option) => {
    let result = await getOnlySocieteInventory(option);
    mainWindow.webContents.send("OnlysocieteinventorySendig", result);
  });
  ipcMain.on("getSocieteInventory", async (e, option) => {
    let result = await getSocieteInventory(option.depot, option.societe);
    mainWindow.webContents.send("societeinventorySendig", result);
  });
  ipcMain.on("sendInventoryForStats", async () => {
    let result = await getInventory();
    mainWindow.webContents.send("inventorySendigForStat", result);
  });
  ipcMain.on("sendMeCommerciaux2", () => {
    let result = knex.select().table("commerciaux").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("CommerciauxSending2", rows);
    });
  });
  //sending products from db
  ipcMain.on("sendMeProducts", () => {
    let result = knex.select().table("produit").where("deleted", "=", 0);
    result.then((rows) => {
      mainWindow.webContents.send("ProductsSending", rows);
    });
  });
  //sending products from db
  ipcMain.on("sendMeProductsForStat", () => {
    let result = knex.select().table("produit").where("deleted", "=", 0);
    result.then((rows) => {
      mainWindow.webContents.send("sendMeProductsForStatRep", rows);
    });
  });
  //sending societes from db
  ipcMain.on("sendMeSocietes", () => {
    let result = knex.select().table("societes");
    result.then((rows) => {
      mainWindow.webContents.send("societesSending", rows);
    });
  });

  //sending factures from db

  ipcMain.on("sendMeFactures", () => {
    let result = knex
      .select()
      .table("Factures")
      .where("deleted", "!=", 1)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("FacturesSending", rows);
    });
  });
  //sending Bons Du Livraison from db

  ipcMain.on("sendMeBonsLivraison", () => {
    let result = knex
      .select()
      .table("BonsLivraison")
      .where("deleted", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("BonsLivraisonSending", rows);
    });
  });
  //sending deleted devis from db

  ipcMain.on("SendDeletedData", (e, options) => {
    let result = knex.select().table(options.table).where("deleted", 1);
    result.then((rows) => {
      mainWindow.webContents.send("SendDeletedDataRep", rows);
    });
  });
  //sending Fournisseurs from db

  ipcMain.on("sendMeFournisseurs", () => {
    let result = knex.select().table("fournisseurs").where("deleted", 0);
    result.then((rows) => {
      mainWindow.webContents.send("FournisseursSending", rows);
    });
  });
  ipcMain.on("sendMeFournisseursForStats", () => {
    let result = knex
      .select()
      .table("fournisseurs")
      .orderBy("chiffreAffaire", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("FournisseursSendingForStats", rows);
    });
  });
  //sending avoirs from db
  ipcMain.on("sendMeAvoirs", () => {
    let result = knex.select().table("Avoirs").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("avoirsSending", rows);
    });
  });
  //sending Devis from db
  ipcMain.on("sendMeDevis2", () => {
    let result = knex
      .select()
      .table("Devis")
      .where("deleted", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("DevisSending2", rows);
    });
  });
  //sending Devis from db
  ipcMain.on("sendMeBonAchat", () => {
    let result = knex
      .select()
      .table("BonsAchats")
      .where("deleted", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("sendMeBonAchatReP", rows);
    });
  });
  //sending Devis from db
  ipcMain.on("sendMeDevis", () => {
    let result = knex
      .select()
      .table("Devis")
      .where("deleted", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("DevisSending", rows);
    });
  });
  //sending achats from db
  ipcMain.on("sendMeAchats", () => {
    let result = knex.select().table("Achats").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("AchatsSending", rows);
    });
  });

  ipcMain.on("sendMeAchats2", () => {
    let result = knex.select().table("Achats").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("AchatsSending2", rows);
    });
  });
  //sending Ventes from db
  ipcMain.on("sendMeVentes2", () => {
    let result = knex.select().table("ventes").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("VentesSending2", rows);
    });
  });
  //sending sync date
  ipcMain.on("GetDerniereSynchronisation", () => {
    let result = knex.select().table("DerniereSynchronisation");
    result.then((rows) => {
      mainWindow.webContents.send("GetDerniereSynchronisationRep", rows);
    });
  });
  //sending Ventes from db
  ipcMain.on("sendMeVentes", () => {
    let result = knex.select().table("ventes").orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("VentesSending", rows);
    });
  });
  //sending Categories from db
  ipcMain.on("sendMeCategories", () => {
    let result = knex.select().table("categories");
    result.then((rows) => {
      mainWindow.webContents.send("sendMeCategoriesAnswer", rows);
    });
  });
  //get online user
  ipcMain.on("getOnlineUser", (e, option) => {
    let result = knex.select().table("commerciaux").where("username", option);
    result.then((rows) => {
      mainWindow.webContents.send("OnlineUserSending", rows);
    });
  });
  //get online user
  ipcMain.on("getOnlineUser2", (e, option) => {
    let result = knex.select().table("commerciaux").where("username", option);
    result.then((rows) => {
      mainWindow.webContents.send("OnlineUserSending2", rows);
    });
  });
  //get societe
  ipcMain.on("getSociete", (e, option) => {
    let result = knex.select().table("societes");
    result.then((rows) => {
      mainWindow.webContents.send("SocieteSending", rows);
    });
  });
  //get societe
  ipcMain.on("getSocieteForConsultation", (e, option) => {
    let result = knex.select().table("societes");
    result.then((rows) => {
      mainWindow.webContents.send("SocieteSendingForConsultation", rows);
    });
  });
  //get  client
  ipcMain.on("sendClient", (e, option) => {
    let result = knex
      .select()
      .table("clients")
      .where("deleted", 0)
      .where("id", option);
    result.then((rows) => {
      mainWindow.webContents.send("sendClientAnswer", rows);
    });
  });
  //get avoir
  ipcMain.on("getAvoir", (e, option) => {
    let result = knex.select().table("Avoirs").where("id", option);
    result.then((rows) => {
      mainWindow.webContents.send("getAvoirAnswer", rows);
    });
  });
  //checking sessions
  ipcMain.on("sessionChek", () => {
    let result = knex.select().table("session").where("statu", 1);
    result.then((rows) => {
      mainWindow.webContents.send("sessionChekRespond", rows);
    });
  });
  //Payer Fournisseur
  ipcMain.on("PayerFournisseur", (e, options) => {
    let result = knex
      .select()
      .table("fournisseurs")
      .where("id", options.ReglementId);
    result.then((rows) => {
      fournisseur = rows[0];
      let result3 = knex("fournisseurs")
        .where("id", "=", options.ReglementId)
        .update({
          solde: rows[0].solde - parseFloat(options.Montant),
          chiffreAffaire: rows[0].chiffreAffaire + parseFloat(options.Montant),
        });
      result3.then(() => {
        let mydata = {
          change: "updateChiffres",
          targetTable: "fournisseurs",
          data: JSON.stringify({
            identifier: rows[0].identifier,
            solde: -parseFloat(options.Montant),
            chiffreAffaire: parseFloat(options.Montant),
          }),
        };
        addToHistory(mydata);
        mainWindow.webContents.send("PayerFournisseurRep");
      });
    });
  });
  //Payer prime
  ipcMain.on("payPrime", (e, options) => {
    let MyRes = knex("Agents").where("identifier", "=", options.identifier);
    MyRes.then((results) => {
      newCharge({
        Benificier: results[0].nom + " " + results[0].prenom,
        Montant: results[0].prime,
        Remarque: "Prime",
      });
      let result3 = knex("Agents")
        .where("id", "=", results[0].id)
        .update({ prime: 0 });
      result3.then(() => {
        let data = {
          targetTable: "Agents",
          change: "update",
          data: JSON.stringify({ identifier: options.identifier, prime: 0 }),
        };
        addToHistory(data);
        mainWindow.webContents.send("primePayed");
      });
    });
  });
  //Modifier produits
  ipcMain.on("updateInventaire", (e, options) => {
    options.forEach((p) => {
      delete p.changed;
      let result3 = knex("produit")
        .where("id", p.id)
        .update({ ...p });
      result3.then(() => {});
    });
  });
  //PayerReglement
  ipcMain.on("PayerReglement", (e, options) => {
    let result = knex
      .select()
      .table("clients")
      .where("id", options.ReglementId);
    result.then((rows) => {
      client = rows[0];
      let result3 = knex("clients")
        .where("id", "=", options.ReglementId)
        .update({ solde: rows[0].solde - parseInt(options.Montant) });
      result3.then((rows) => {
        let mydata = {
          change: "updateChiffres",
          targetTable: "clients",
          data: JSON.stringify({
            identifier: client.identifier,
            solde: -parseFloat(options.Montant),
          }),
        };
        addToHistory(mydata);
        mainWindow.webContents.send("PayerReglementRep");
      });
    });
  });
  //logout sessions
  ipcMain.on("logoutRequest", () => {
    let result = knex("session").where("statu", "=", 1).update({ statu: 0 });
    result.then((rows) => {
      mainWindow.webContents.send("logoutRequestAnswer");
    });
  });
  ipcMain.on("UpdateSessionUser", (e, option) => {
    let result = knex("session")
      .where("statu", "=", 1)
      .update({ username: option });
    result.then((rows) => {
      mainWindow.webContents.send("UpdateSessionUserRep");
    });
  });
  //update category
  ipcMain.on("UpdateCategory", (e, options) => {
    let result = knex("categories")
      .where("id", "=", options.id)
      .update({ nom: options.nom });
    result.then((rows) => {
      let data = {
        targetTable: "categories",
        change: "update",
        data: JSON.stringify(options),
      };
      addToHistory(data);
      mainWindow.webContents.send("UpdateCategoryAnswer");
    });
  });
  //update sync date
  ipcMain.on("DerniereSynchronisation", (e, options) => {
    let result = knex("DerniereSynchronisation")
      .where("id", "=", 1)
      .update({ date: options });
    result.then((rows) => {
      mainWindow.webContents.send("DerniereSynchronisationRep", rows);
    });
  });
  //update taxe
  ipcMain.on("UpdateTaxe", (e, options) => {
    let result = knex("taxes")
      .where("id", "=", options.id)
      .update({ nom: options.nom, pourcentage: options.pourcentage });
    result.then((rows) => {
      mainWindow.webContents.send("UpdateTaxeAnswer");
    });
  });
  //update Societe
  ipcMain.on("Updatesociete", (e, options) => {
    knex("societes")
      .where("id", options.id)
      .then((rows) => console.log("db", rows));
    let myData = {
      nom: options.nom,
      adresse: options.adresse,
      num: options.num,
      email: options.email,
      NRC: options.NRC,
      NIF: options.NIF,
      ART: options.ART,
      description: options.description,
    };
    if (options.imgPath.trim() != "") {
      const pathToFile = options.imgPath;
      const pathToNewDestination = path.join(
        __dirname,
        "dist/img",
        options.nom + ".png"
      );
      fs.copyFile(pathToFile, pathToNewDestination, function (err) {
        if (err) {
        } else {
          let result2 = knex("societes")
            .where("id", "=", options.id)
            .update({ profileImage: pathToNewDestination });
          result2.then((rows) => {
            console.log("updated pic");
          });
        }
      });
    }

    let result = knex("societes")
      .where("id", "=", options.id)
      .update({ ...myData });
    result.then((rows) => {
      console.log("from update", myData);
      mainWindow.webContents.send("UpdateSocieteAnswer");
    });
  });
  //update Product
  ipcMain.on("UpdateProduct", (e, options) => {
    let result = knex("produit")
      .where("identifier", options.identifier)
      .update({
        ...options,
      });
    result.then((rows) => {
      let mydata = {
        targetTable: "produit",
        change: "update",
        data: JSON.stringify(options),
      };
      addToHistory(mydata);
      mainWindow.webContents.send("UpdateProductAnswer");
    });
  });
  //update facture
  ipcMain.on("UpdateFacture", (e, options) => {
    let result = knex("Factures")
      .where("id", "=", options.id)
      .update({
        ...options,
      });
    result.then((rows) => {
      mainWindow.webContents.send("UpdateFactureAnswer");
    });
  });
  ipcMain.on("UpdateBL", (e, options) => {
    let result = knex("bonsLivraison")
      .where("id", "=", options.id)
      .update({
        ...options,
      });
    result.then((rows) => {
      mainWindow.webContents.send("UpdateBLRep");
    });
  });
  //update Devis
  ipcMain.on("UpdateDevis", (e, options) => {
    let result = knex("Devis")
      .where("id", "=", options.id)
      .update({
        ...options,
      });
    result.then((rows) => {
      mainWindow.webContents.send("UpdateDevisAnswer");
    });
  });
  //Devis facturé
  ipcMain.on("devisFacture", (e, options) => {
    let result = knex("Devis").where("id", "=", options).update({ facture: 1 });
    result.then((rows) => {});
  });
  ipcMain.on("devisLivre", (e, options) => {
    let result = knex("Devis").where("id", "=", options).update({ livre: 1 });
    result.then((rows) => {});
  });
  // update User Info
  ipcMain.on("UpdateUserInfo", (e, options) => {
    let result = knex("commerciaux")
      .where("id", "=", options.id)
      .update(options);
    result.then((rows) => {
      mainWindow.webContents.send("UpdateUserInfoRep", rows);
    });
  });
  // update Agents Info
  ipcMain.on("UpdateAgentInfos", (e, options) => {
    let result = knex("Agents").where("id", "=", options.id).update(options);
    result.then((rows) => {
      mainWindow.webContents.send("UpdateAgentInfosRep", rows);
    });
  });
  // update Agents Info
  ipcMain.on("UpdateAgentInfo", (e, options) => {
    let result = knex("commerciaux")
      .where("id", "=", options.id)
      .update(options);
    result.then((rows) => {
      mainWindow.webContents.send("UpdateAgentInfoRep", rows);
    });
  });
  // update Client Info
  ipcMain.on("UpdateClientInfo", (e, options) => {
    let result = knex("clients").where("id", "=", options.id).update(options);
    result.then((rows) => {
      mainWindow.webContents.send("UpdateClientInfoRep", rows);
    });
  });
  ipcMain.on("UpdateFournisseur", (e, options) => {
    let result = knex("fournisseurs")
      .where("id", "=", options.id)
      .update(options);
    result.then((rows) => {
      let Mydata = {
        targetTable: "fournisseurs",
        change: "update",
        data: JSON.stringify(options),
      };
      addToHistory(Mydata);
      mainWindow.webContents.send("UpdateFournisseurRep", rows);
    });
  });

  //Update Stock apres un edit
  ipcMain.on("AvoirUpdateStock", (e, option) => {
    let result = knex("produit").where("id", "=", option.id);
    result.then((rows) => {
      let quantite = rows[0].quantity + option.qts;
      let result2 = knex("produit")
        .where("id", "=", option.id)
        .update({ quantity: quantite });
      result2.then((rows) => {
        mainWindow.webContents.send("AvoirUpdateStockAnswer");
      });
    });
  });
  //Update Stock apres un bon Edit
  ipcMain.on("updateStockAfterChange", (e, option) => {
    option.forEach((p) => {
      let result = knex("Lots").where("Lotid", "=", p.Lot);
      result.then((rows) => {
        let quantite = rows[0].quantity - p.qte;
        let result2 = knex("Lots")
          .where("Lotid", "=", p.Lot)
          .update({ quantity: quantite });
        result2.then((rows) => {});
      });
    });
    mainWindow.webContents.send("AvoirUpdateStockAnswer");
  });
  //Update Stock apres un bon entre
  ipcMain.on("updateLots", (e, option) => {
    option.forEach((p) => {
      let result = knex("Lots").where("Lotid", "=", p.LotChoisi.Lotid);
      result.then((rows) => {
        let quantite = rows[0].quantity + p.quantityAchete;
        let result2 = knex("Lots")
          .where("Lotid", "=", p.LotChoisi.Lotid)
          .update({ quantity: quantite });
        result2.then((rows) => {
          let MyData = {
            targetTable: "Lots",
            change: "updateChiffres",
            data: JSON.stringify({
              identifier: p.LotChoisi.identifier,
              quantity: p.quantityAchete,
            }),
          };
          addToHistory(MyData);
        });
      });
    });
    mainWindow.webContents.send("AvoirUpdateStockAnswer");
  });

  //Update Stock
  ipcMain.on("UpdateStock", (e, option) => {
    let result = knex("produit").where("id", "=", option.id);
    result.then((rows) => {
      let quantite = rows[0].quantity - option.qts;
      let result2 = knex("produit")
        .where("id", "=", option.id)
        .update({ quantity: quantite });
      result2.then((rows) => {
        mainWindow.webContents.send("UpdateStockAnswer");
      });
    });
  });
  //add new Achat
  ipcMain.on("AddAchat", async (e, data) => {
    let societe = await knex.select().table("societes");
    let Ndate = new Date();
    let MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    data.produitsChoisi.forEach((options) => {
      let identifierN = Math.random().toString(36).substr(2, 9);
      let infos = {
        produit: options.nom,
        date: JSON.stringify(MyDate),
        quantity: options.quantityAchete,
        prix_total: options.prix_achat * options.quantityAchete,
        identifier: identifierN,
        fournisseur: data.fournisseur,
        societe: societe[0].Identifiant,
      };
      knex("Achats")
        .insert([{ ...infos }])

        .then(function (result) {
          let MyData = {
            data: JSON.stringify({ ...infos }),
            targetTable: "Achats",
            change: "insert",
          };
          addToHistory(MyData);
          mainWindow.webContents.send("AddAchatAnswer");
        });
    });
  });

  //add new tax
  ipcMain.on("AddPrimes", (e, options) => {
    let totalProduits = 0;
    let totalPrimes = 0;
    options.Produits.forEach((p) => {
      totalProduits += p.quantityAchete;
      totalPrimes += (p.profit / 100) * p.prixChoisi * p.quantityAchete;
    });
    let result2 = knex
      .select()
      .table("Agents")
      .where("id", JSON.parse(options.commercial).id);
    result2.then((res) => {
      knex("Agents")
        .where("id", res[0].id)
        .update({
          produits_vendu: res[0].produits_vendu + totalProduits,
          prime: res[0].prime + totalPrimes,
        })
        .then((x) => {});
    });
  });
  //add new vente
  ipcMain.on("AddVente", (e, options) => {
    let Ndate = new Date();
    let MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let identifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      produit: options.nom,
      date: JSON.stringify(MyDate),
      quantity: options.quantityAchete,
      prix_total: options.prixChoisi * options.quantityAchete,
      identifier: identifierN,
      category: options.category,
      client: options.client,
      commercial: options.commercial,
      societe: options.societe,
    };
    knex("ventes")
      .insert([{ ...infos }])
      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "ventes",
          change: "insert",
        };
        addToHistory(MyData);
      });
  });

  //add new tax
  ipcMain.on("addCharge", (e, options) => {
    newCharge(options);
  });
  const newCharge = (options) => {
    let IdentifierN = Math.random().toString(36).substr(2, 9);

    let Ndate = new Date();
    let MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let infos = {
      benificier: options.Benificier,
      montant: options.Montant,
      remarque: options.Remarque,
      date: JSON.stringify(MyDate),
      identifier: IdentifierN,
      deleted: 0,
    };
    knex("charges")
      .insert([
        {
          ...infos,
        },
      ])
      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "charges",
          change: "insert",
        };
        addToHistory(MyData);
      });
  };
  //add new Lot
  ipcMain.on("AddLot", async (e, options) => {
    let societe = await knex.select().table("societes");

    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      numero: options.num,
      product: options.Produit,
      depot: options.depot,
      date_fabrication: options.DF,
      date_pre: options.DP,
      quantity: 0,
      identifier: IdentifierN,
      societe: societe[0].Identifiant,
      deleted: 0,
    };
    knex("Lots")
      .insert([
        {
          ...infos,
        },
      ])
      .then(function (result) {
        mainWindow.webContents.send("AddLotRep");
        let data = {
          targetTable: "Lots",
          change: "insert",
          data: JSON.stringify({ ...infos }),
        };
        addToHistory(data);
      });
  });
  //add new depot
  ipcMain.on("AddDepot", async (e, options) => {
    let societe = await knex.select().table("societes");
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      identifier: IdentifierN,
      nom: options.nom,
      societe: societe[0].Identifiant,
      deleted: false,
    };
    knex("depots")
      .insert([
        {
          ...infos,
        },
      ])
      .then(function (result) {
        mainWindow.webContents.send("AddDepotRep");
        let data = {
          targetTable: "depots",
          change: "insert",
          data: JSON.stringify({ ...infos }),
        };
        addToHistory(data);
      });
  });
  ipcMain.on("getLots", (e) => {
    let result = knex
      .select()
      .table("Lots")
      .where("deleted", 0)
      .orderBy("Lotid", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("lotSent", rows);
    });
  });
  ipcMain.on("getDepots", (e) => {
    let result = knex
      .select()
      .table("depots")
      .where("deleted", 0)
      .orderBy("id", "desc");
    result.then((rows) => {
      mainWindow.webContents.send("DepotsSent", rows);
    });
  });
  //add new category
  ipcMain.on("AddCategory", (e, options) => {
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      nom: options,
      identifier: IdentifierN,
      deleted: 0,
    };
    knex("categories")
      .insert([{ ...infos }])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "categories",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("AddCategoryAnswer");
      });
  });
  //add new fournisseur
  ipcMain.on("AddFournisseur", (e, options) => {
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      Nom: options.nom,
      prenom: options.prenom,
      num: options.num,
      adresse: options.adresse,
      identifier: IdentifierN,
      solde: 0,
      chiffreAffaire: 0,
      deleted: 0,
      RC: options.RC,
      NIF: options.NIF,
      NIS: options.NIS,
      ART: options.ART,
    };
    knex("fournisseurs")
      .insert([{ ...infos }])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "fournisseurs",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("AddFournisseurAnswer");
      });
  });
  //add new avoir
  ipcMain.on("AddAvoir", async (e, options) => {
    let Ndate = new Date();
    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let result = await knex
      .select()
      .table("sqlite_sequence")
      .where("name", "Avoirs");
    let Myref;
    if (result[0].seq + 1 < 10) {
      Myref = "BR-00" + (result[0].seq + 1);
    } else if (result[0].seq < 100) {
      Myref = "BR-0" + (result[0].seq + 1);
    } else {
      Myref = "BR-" + (result[0].seq + 1);
    }
    let identifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      produits: options.Produits,
      client: options.clientID,
      prix_htt: options.prixT,
      prix_ttc: options.prixT + options.prixT * 0.19,
      agent: options.user,
      date: JSON.stringify(MyDate),
      identifier: identifierN,
      deleted: 0,
      societe: options.societe,
      ref: Myref + "-" + Ndate.getFullYear(),
    };
    knex("Avoirs")
      .insert([{ ...infos }])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "Avoirs",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("AvoirInsertAnswer");
      });
  });
  //add new devis
  ipcMain.on("addbonachat", (e, options) => {
    const Ndate = new Date();
    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let infos = {
      produits: options.Produits,
      date: JSON.stringify(MyDate),
      deleted: 0,
      PrixTotal: options.PrixTotal,
      societe: options.societe,
    };
    knex("bonsAchats")
      .insert([{ ...infos }])
      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "bonsAchats",
          change: "insert",
        };
        addToHistory(MyData);

        let result2 = knex
          .select()
          .table("bonsAchats")
          .where("deleted", 0)
          .orderBy("id", "desc");
        result2.then((rows) => {
          win = new BrowserWindow({
            width: 900,
            height: 1100,
            show: false,
            webPreferences: {
              webSecurity: false,
              plugins: true,
              nodeIntegration: true,
            },
          });
          let dbPath = __dirname + "/src/formulaires/bonAchat.html";
          win.loadURL("file://" + dbPath);

          win.once("ready-to-show", () => {
            let prod = { ...rows[0] };
            prod.societe = options.societe;
            win.webContents.send("proforma", prod);
            win.show();
          });
        });
      });
  });
  ipcMain.on("printFournisseurs", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/fournisseurs.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  ipcMain.on("printClients", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/Clients.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  //add new devis
  ipcMain.on("PrintBonAchat", (e, options) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/bonAchat.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.webContents.send("proforma", options);
      win.show();
    });
  });
  ipcMain.on("AddDevis", async (e, options) => {
    const Ndate = new Date();
    let result = await knex
      .select()
      .table("sqlite_sequence")
      .where("name", "Devis");
    let Myref;
    if (result[0].seq + 1 < 10) {
      Myref = "FP-00" + (result[0].seq + 1);
    } else if (result[0].seq < 100) {
      Myref = "FP-0" + (result[0].seq + 1);
    } else {
      Myref = "FP-" + (result[0].seq + 1);
    }
    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      produits: options.Produits,
      client_id: options.clientID,
      prix_ht: options.prixT,
      prix_ttc: options.prixTTC,
      facture: 0,
      date: JSON.stringify(MyDate),
      societe: JSON.stringify(options.societe),
      identifier: IdentifierN,
      deleted: 0,
      livre: 0,
      commercial: options.commercial,
      ref: Myref + "-" + Ndate.getFullYear(),
    };
    knex("Devis")
      .insert([
        {
          ...infos,
        },
      ])
      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "Devis",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("DevisInsertAnswer");
      });
  });
  //add new bon entre
  ipcMain.on("AddBonSortie", async (e, options) => {
    console.log(options);
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let result = await knex
      .select()
      .table("sqlite_sequence")
      .where("name", "BonSortie");
    let Myref;
    if (result[0].seq + 1 < 10) {
      Myref = "BS-00" + (result[0].seq + 1);
    } else if (result[0].seq < 100) {
      Myref = "BS-0" + (result[0].seq + 1);
    } else {
      Myref = "BS-" + (result[0].seq + 1);
    }
    let Ndate = new Date();
    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let infos = {
      produits: options.produits,
      date: JSON.stringify(MyDate),
      agent: options.agent,
      Societe: options.SelectedSociete,
      identifier: IdentifierN,
      deleted: 0,
      client: options.Client,
      ref: Myref + "-" + Ndate.getFullYear(),
    };
    knex("BonSortie")
      .insert([
        {
          ...infos,
        },
      ])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "BonSortie",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("AddBonSortieAnswer");
      });
  });
  ipcMain.on("AddBonCommande", async (e, options) => {
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let result = await knex
      .select()
      .table("sqlite_sequence")
      .where("name", "Bons_commande");
    let Myref;
    if (result[0].seq + 1 < 10) {
      Myref = "BC-00" + (result[0].seq + 1);
    } else if (result[0].seq < 100) {
      Myref = "BC-0" + (result[0].seq + 1);
    } else {
      Myref = "BC-" + (result[0].seq + 1);
    }
    let Ndate = new Date();
    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let infos = {
      produits: options.produits,
      date: JSON.stringify(MyDate),
      agent: options.agent,
      Fournisseur: JSON.stringify(options.fournisseur),
      identifier: IdentifierN,
      deleted: 0,
      societe: JSON.stringify(options.societe),
      ref: Myref + "-" + Ndate.getFullYear(),
    };
    knex("Bons_commande")
      .insert([
        {
          ...infos,
        },
      ])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "Bons_commande",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("AddBonCommandeAnswer");
      });
  });
  ipcMain.on("AddBonEntre", async (e, options) => {
    let societe = await knex.select().table("societes");
    let resul3 = await knex
      .select()
      .table("sqlite_sequence")
      .where("name", "BonsEntre");
    let Myref;
    if (resul3[0].seq + 1 < 10) {
      Myref = "BE-00" + (resul3[0].seq + 1);
    } else if (resul3[0].seq < 100) {
      Myref = "BE-0" + (resul3[0].seq + 1);
    } else {
      Myref = "BE-" + (resul3[0].seq + 1);
    }
    let Ndate = new Date();
    let result = knex
      .select()
      .table("fournisseurs")
      .where("id", options.fournisseur.id);
    result.then((rows) => {
      let fournisseur = rows[0];
      if (options.reglement.trim() == "à Terme") {
        let result3 = knex("fournisseurs")
          .where("id", "=", fournisseur.id)
          .update({ solde: rows[0].solde + parseInt(options.Total) });
        result3.then((row2s) => {
          let mydata = {
            change: "updateChiffres",
            targetTable: "fournisseurs",
            data: JSON.stringify({
              identifier: rows[0].identifier,
              solde: parseFloat(options.Total),
            }),
          };
          addToHistory(mydata);
        });
      } else {
        let result3 = knex("fournisseurs")
          .where("id", fournisseur.id)
          .update({
            chiffreAffaire: rows[0].chiffreAffaire + parseInt(options.Total),
          });
        result3.then((rows2) => {
          let mydata = {
            change: "updateChiffres",
            targetTable: "fournisseurs",
            data: JSON.stringify({
              identifier: rows[0].identifier,
              chiffreAffaire: parseFloat(options.Total),
            }),
          };
          addToHistory(mydata);
        });
      }
    });

    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let identifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      produits: options.produits,
      date: JSON.stringify(MyDate),
      agent: options.agent,
      fournisseur: JSON.stringify(options.fournisseur),
      Societe: JSON.stringify(societe[0]),
      identifier: identifierN,
      total: options.Total,
      reglement: options.reglement,
      deleted: 0,
      ref: Myref + "-" + Ndate.getFullYear(),
    };
    knex("BonsEntre")
      .insert([
        {
          ...infos,
        },
      ])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "BonsEntre",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("AddBonEntreAnswer");
      });
  });
  ipcMain.on("deleteCharge", (e, options) => {
    knex("charges")
      .where("id", options)
      .del()
      .then(function (result) {
        mainWindow.webContents.send("deleteChargeRep");
      });
  });
  // delete fournisseurs
  ipcMain.on("deleteFournisseurs", (e, options) => {
    knex("fournisseurs")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("fournisseurDeleted");
      });
  });
  // delete societe
  ipcMain.on("DeleteSociete", (e, options) => {
    knex("societes")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteSocieteRep");
      });
  });
  // delete Agent
  ipcMain.on("DeleteAgent", (e, options) => {
    knex("Agents")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteAgentRep");
      });
  });
  // delete Agent
  ipcMain.on("DeleteCommerciaux", (e, options) => {
    knex("commerciaux")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteCommerciauxRep");
      });
  });
  // delete Client
  ipcMain.on("DeleteClient", (e, options) => {
    knex("clients")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteClientRep");
      });
  });
  // delete categorie
  ipcMain.on("deletecategory", (e, options) => {
    knex("categories")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("deletecategoryAnswer");
      });
  });
  // delete Lot
  ipcMain.on("deleteLot", (e, options) => {
    knex("Lots")
      .where("Lotid", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("deleteLotRep");
      });
  });
  // delete Lot
  ipcMain.on("deleteDepot", (e, options) => {
    knex("depots")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("deleteDepotRep");
      });
  });
  // delete taxe
  ipcMain.on("deleteTaxe", (e, options) => {
    knex("taxes")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("deleteTaxeAnswer");
      });
  });
  // delete bonlivraison
  ipcMain.on("DeleteBonLivraison", (e, options) => {
    knex("BonsLivraison")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteBonLivraisonAnswer");
      });
  });

  // delete avoir
  ipcMain.on("DeleteAvoir", (e, options) => {
    knex("Avoirs")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteAvoirAnswer");
      });
  });
  // delete Bon sortie
  ipcMain.on("SendToTrash2", (e, options) => {
    knex(options.table)
      .where("Lotid", options.id)
      .update({ deleted: 1 })
      .then(function (result) {
        mainWindow.webContents.send("SendToTrashAnswer2");
      });
  });
  // delete Bon sortie
  ipcMain.on("SendToTrash", (e, options) => {
    knex(options.table)
      .where("id", options.id)
      .update({ deleted: 1 })
      .then(function (result) {
        mainWindow.webContents.send("SendToTrashAnswer");
      });
  });
  // delete Bon sortie
  ipcMain.on("DeleteBonSortie", (e, options) => {
    knex("BonSortie")
      .where("id", options)
      .del()
      .then(function (result) {
        mainWindow.webContents.send("DeleteBonSortieAnswer");
      });
  });
  // delete Bon achat
  ipcMain.on("deleteBonAchat", (e, options) => {
    knex("BonsAchats")
      .where("id", options)
      .del()
      .then(function (result) {
        mainWindow.webContents.send("BonAchatDeleted");
      });
  });
  // delete bon entre
  ipcMain.on("DeleteBonEntre", (e, options) => {
    knex("BonsEntre")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteBonEntreAnswer");
      });
  });
  // delete Product
  ipcMain.on("DeleteProduct", (e, options) => {
    knex("produit")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteProductAnswer");
      });
  });
  // delete Facture
  ipcMain.on("DeleteFactures", (e, options) => {
    knex("Factures")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteFacturesAnswer");
      });
  });
  // Activer abonnement
  ipcMain.on("ActiverAbonnement", (e, options) => {
    let Ndate = new Date();
    const MyDate1 = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    var newDate = new Date(Ndate.setMonth(Ndate.getMonth() + options.dure));
    const MyDate2 = {
      day: newDate.getDate(),
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    };

    let result = knex("abonnement")
      .where("statu", "=", 0)
      .update({
        dateActivation: JSON.stringify(MyDate1),
        statu: 1,
        FinAbonnement: JSON.stringify(MyDate2),
        Identifiant: options.MachineId,
        cle: options.cle,
      });
    result.then((rows) => {
      FireBase.collection("cles")
        .doc(options.id)
        .update({ statu: 1 })
        .then(() => {
          mainWindow.webContents.send("ActiverAbonnementAnswer", rows);
        });
    });
  });
  // Desactiver abonnement
  ipcMain.on("DesactiverAbonnement", (e, options) => {
    let result = knex("abonnement").where("statu", "=", 1).update({ statu: 0 });
    result.then((rows) => {
      mainWindow.webContents.send("DesactiverAbonnementRep", rows);
    });
  });
  // add account abonnement
  ipcMain.on("recuperer", (e, options) => {
    let result = knex(options.table)
      .where("id", options.id)
      .update({ deleted: 0 });
    result.then((rows) => {
      mainWindow.webContents.send("recupererRep", rows);
    });
  });
  // add account abonnement
  ipcMain.on("addAccountUser", (e, options) => {
    console.log("hello ?", options);
  });
  // renouveler abonnement
  ipcMain.on("renouvelerAbonnement", (e, options) => {
    let result = knex("abonnement")
      .where("statu", "=", 1)
      .update({ FinAbonnement: JSON.stringify(options.date) });
    result.then((rows) => {
      FireBase.collection("cles")
        .doc(options.key.keyId)
        .update({ statu: 1 })
        .then(() => {
          mainWindow.webContents.send("renouvelerAbonnementRep", rows);
        });
    });
  });
  // Check key
  ipcMain.on("CheckKey", async (e, options) => {
    let table = [];
    const result = await FireBase.collection("cles")
      .where("cle", "==", options.key)
      .get()
      .then(async (snapchot) => {
        snapchot.docs.forEach((doc) => {
          table.push({ ...doc.data(), id: doc.id });
        });
        if (table.length > 0) {
          if (table[0].statu == 0) {
            try {
              const response = await axios.post(
                api + "/login",
                JSON.stringify(options.user),
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              await knex("utilisateur")
                .where("id", 1)
                .update({ identifiant: response.data.token });

              console.log(response.data.Societe);
              await knex("societes").insert({ ...response.data.Societe });
              mainWindow.webContents.send("LogginSucces", table[0]);
            } catch (err) {
              console.log(err);
              mainWindow.webContents.send("WrongData");
            }
          } else {
            mainWindow.webContents.send("usedKey");
          }
        } else {
          mainWindow.webContents.send("wrongKey");
        }
      })
      .catch((e) => {
        console.log("eror", e);
      });
  });
  // Check Activation
  ipcMain.on("VerifierCle", (e, options) => {
    let result = knex("abonnement").where("statu", "=", 1);
    result.then((rows) => {
      mainWindow.webContents.send("VerifierCleRep", rows);
    });
  });
  // Chech DateAbbonement
  ipcMain.on("DateAbbonement", (e, options) => {
    let result = knex("abonnement");
    result.then((rows) => {
      mainWindow.webContents.send("DateAbbonementRep", rows);
    });
  });
  // delete Devis
  ipcMain.on("DeleteBonCommande", (e, options) => {
    knex("bons_commande")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteBonCommandeAnswer");
      });
  });
  // delete Devis
  ipcMain.on("DeleteDevis", (e, options) => {
    knex("Devis")
      .where("id", options)
      .del()

      .then(function (result) {
        mainWindow.webContents.send("DeleteDevisAnswer");
      });
  });
  // print page
  ipcMain.on("printReglements", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/Reglements.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  ipcMain.on("printCharges", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/charges.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  ipcMain.on("PrintProduits", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/produits.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  ipcMain.on("PrintLots", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/Lots.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  ipcMain.on("PrintInventory", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/inventaire.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  // print page
  ipcMain.on("printHistorique", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/Historique.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();
      win.webContents.send("History", option);
    });
  });
  // print page
  ipcMain.on("PrintBonSortie", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/BonSortie.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.webContents.send("proforma", option);
      win.show();
    });
  });

  ipcMain.on("PrintBonCommande", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/BonCommande.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.webContents.send("proforma", option);
      win.show();
    });
  });
  ipcMain.on("PrintBonAvoir", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/bonAvoir.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.webContents.send("proforma", option);
      win.show();
    });
  });
  // print page
  ipcMain.on("PrintBonEntre", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/BonEntre.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();

      win.webContents.send("proforma", option);
    });
  });
  // print page
  ipcMain.on("PrintBonLivraison", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/bonLivraison.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();

      win.webContents.send("proforma", option);
    });
  });
  // print page
  ipcMain.on("PrintFacture", (e, option) => {
    win2 = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,

      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });
    let dbPath = __dirname + "/src/formulaires/facture.html";
    win2.loadURL("file://" + dbPath);
    win2.once("ready-to-show", () => {
      win2.show();

      win2.webContents.send("factureDetails", option);
    });
  });
  // print page
  ipcMain.on("CheckIdentifiers", async (e, option) => {});
  // print page
  ipcMain.on("PrintPage", (e, option) => {
    win = new BrowserWindow({
      width: 900,
      height: 1100,
      show: false,
      webPreferences: {
        webSecurity: false,
        plugins: true,
        nodeIntegration: true,
      },
    });

    let dbPath = __dirname + "/src/formulaires/devis.html";
    win.loadURL("file://" + dbPath);

    win.once("ready-to-show", () => {
      win.show();

      win.webContents.send("proforma", option);
    });
  });
  //add new Reglement
  ipcMain.on("AddReglement", async (e, options) => {
    let payed = 1;
    let Ndate = new Date();
    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    if (options.type == "client") {
      let result = knex
        .select()
        .table("clients")
        .where("id", options.Client.id);
      result.then((rows) => {
        if (options.reglement.trim() == "à Terme") {
          let result3 = knex("clients")
            .where("id", "=", options.Client.id)
            .update({ solde: rows[0].solde + parseInt(options.montant) });
          result3.then((rows2) => {
            let mydata = {
              change: "updateChiffres",
              targetTable: "clients",
              data: JSON.stringify({
                identifier: rows[0].identifier,
                solde: parseFloat(options.montant),
              }),
            };
            addToHistory(mydata);
          });
          payed = 0;
        } else {
          let result3 = knex("clients")
            .where("id", "=", options.Client.id)
            .update({
              chiffreAffaire:
                rows[0].chiffreAffaire + parseInt(options.montant),
            });
          result3.then((rows2) => {
            let mydata = {
              change: "updateChiffres",
              targetTable: "clients",
              data: JSON.stringify({
                identifier: rows[0].identifier,
                chiffreAffaire: parseFloat(options.montant),
              }),
            };
            addToHistory(mydata);
          });
          payed = 0;
        }
      });
    }
    let societe = await knex.select().table("societes");

    let IdentifierN = Math.random().toString(36).substr(2, 9);
    infos = {
      date: JSON.stringify(MyDate),
      client: JSON.stringify(options.Client),
      Agent: options.user,
      ModePayement: options.reglement,
      montant: options.montant,
      paye: payed,
      identifier: IdentifierN,
      type: options.type,
      societe: societe[0].Identifiant,
    };
    knex("Reglements")
      .insert([
        {
          ...infos,
        },
      ])
      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "Reglements",
          change: "insert",
        };
        addToHistory(MyData);
      });
  });
  //add new facture
  ipcMain.on("AddFacture", async (e, options) => {
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let result = await knex
      .select()
      .table("sqlite_sequence")
      .where("name", "Factures");
    let Myref;
    if (result[0].seq + 1 < 10) {
      Myref = "F-00" + (result[0].seq + 1);
    } else if (result[0].seq + 1 < 100) {
      Myref = "F-0" + (result[0].seq + 1);
    } else {
      Myref = "F-" + (result[0].seq + 1);
    }
    const Ndate = new Date();
    const MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let infos = {
      date: JSON.stringify(MyDate),
      Devis: options.Devis,
      Reglement: options.reglement,
      Agent: options.user,
      societe: options.societe,
      identifier: IdentifierN,
      deleted: 0,
      ref: Myref + "-" + Ndate.getFullYear(),
    };
    knex("Factures")
      .insert([
        {
          ...infos,
        },
      ])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "Factures",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("FacturesInsertAnswer");
      });
  });
  //add new Bon Du Livraison
  ipcMain.on("AddBonLivraison", async (e, options) => {
    let result = await knex
      .select()
      .table("sqlite_sequence")
      .where("name", "BonsLivraison");
    let Myref;
    if (result[0].seq + 1 < 10) {
      Myref = "BL-00" + (result[0].seq + 1);
    } else if (result[0].seq + 1 < 100) {
      Myref = "BL-0" + (result[0].seq + 1);
    } else {
      Myref = "BL-" + (result[0].seq + 1);
    }
    let Ndate = new Date();
    let MyDate = {
      day: Ndate.getDate(),
      month: Ndate.getMonth() + 1,
      year: Ndate.getFullYear(),
    };
    let IdentifierN = Math.random().toString(36).substr(2, 9);
    let infos = {
      date: JSON.stringify(MyDate),
      Devis: options.Devis,
      Reglement: options.reglement,
      Agent: options.user,
      societe: options.societe,
      identifier: IdentifierN,
      deleted: 0,
      ref: Myref + "-" + Ndate.getFullYear(),
    };
    knex("BonsLivraison")
      .insert([
        {
          ...infos,
        },
      ])

      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "BonsLivraison",
          change: "insert",
        };
        addToHistory(MyData);
      });
  });
  ipcMain.on("updatePrixAchat", (e, option) => {
    option.forEach(async (p) => {
      let product = await knex
        .select()
        .table("produit")
        .where("identifier", p.identifier);
      let prices = [...JSON.parse(product[0].prix_achat).prix];
      prices.push(p.prix_achat);
      let result = await knex("produit")
        .where("identifier", "=", p.identifier)
        .update({ prix_achat: JSON.stringify({ prix: [...prices] }) });
      let Mydata = {
        targetTable: "produit",
        change: "update",
        data: JSON.stringify({
          identifier: p.identifier,
          prix_achat: JSON.stringify({ prix: [...prices] }),
        }),
      };
      console.log("mydata", Mydata);
      addToHistory(Mydata);
    });
  });
  ipcMain.on("getData", async (e, table) => {
    await getData(table);
    await getupdates(table);
    mainWindow.webContents.send(table);
  });
  // ajouter un produit
  ipcMain.on("SendProductToDB", (e, options) => {
    let identifierN = Math.random().toString(36).substr(2, 9);
    let identifier2 = Math.random().toString(36).substr(2, 9);
    let infos = {
      nom: options.ProductName,
      prix_achat: options.PrixAchat,
      prix_vente: parseFloat(options.PrixVente),
      prix_gros: parseFloat(options.PrixGros),
      prix_semi: parseFloat(options.PrixSemi),
      category: options.Category,
      BarCode: options.Barcode,
      identifier: identifierN,
      deleted: 0,
      MinQte: options.MinQte,
      Marque: options.Marque,
      profit: options.Profit,
    };
    knex("produit")
      .insert([{ ...infos }])
      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos }),
          targetTable: "produit",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("ProductToDbAnswer");
      });
    let infos2 = {
      product: identifierN,
      identifier: identifier2,
      numero: options.ProductName + " Lot initial",
      societe: "",
      date_fabrication: JSON.stringify({
        day: 1,
        month: 1,
        year: new Date().getFullYear(),
      }),
      date_pre: JSON.stringify({
        day: 1,
        month: 1,
        year: new Date().getFullYear(),
      }),
      deleted: 0,
      quantity: parseInt(options.qte),
      initial: 1,
    };
    knex("Lots")
      .insert([{ ...infos2 }])
      .then(function (result) {
        let MyData = {
          data: JSON.stringify({ ...infos2 }),
          targetTable: "Lots",
          change: "insert",
        };
        addToHistory(MyData);
        mainWindow.webContents.send("ProductToDbAnswer");
      });
  });

  //login request
  ipcMain.on("loginRequest", (e, options) => {
    let result = knex
      .select()
      .table("commerciaux")
      .where("username", options.username);
    result.then((rows) => {
      if (rows.length > 0) {
        if (rows[0].password === options.Password) {
          knex("session")
            .insert([
              {
                username: JSON.stringify(rows[0]),
                statu: 1,
              },
            ])
            .then(function (result) {});
          mainWindow.webContents.send("loggedIn", rows);
        } else {
          mainWindow.webContents.send("WrongPassword");
        }
      } else {
        mainWindow.webContents.send("UserNotFound");
      }
    });
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

ipcMain.on("login", (e, options) => {
  console.log(options);
});
ipcMain.on("Sync", (e, options) => {
  console.log("Sync Called");
  SyncData();
});

const SyncData = () => {
  lock.writeLock(async function (release) {
    console.log("syncdataCalled");
    const token = await getToken();
    let result = await knex
      .select()
      .table("ChangeHistory")
      .where("change", "insert");
    if (result.length > 0) {
      try {
        await axios.post(api + "/addDocument", JSON.stringify(result), {
          headers: {
            token: token,

            "Content-Type": "application/json",
          },
        });

        await knex("ChangeHistory").where("change", "insert").del();
      } catch (err) {
        console.log("something went wrong");
        console.log(err);
      }
    }
    await release();
    pushQunatitiesUpdates();
  });
};
const pushUpdates = () => {
  lock.writeLock(async function (release) {
    const token = await getToken();
    let result = await knex
      .select()
      .table("ChangeHistory")
      .where("change", "update");
    if (result.length > 0) {
      try {
        await axios.post(api + "/update", JSON.stringify(result), {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });
        await knex("ChangeHistory").where("change", "update").del();
      } catch (err) {
        console.log("something went wrong");
        console.log(err);
      }
    }
    release();
  });
};
const pushQunatitiesUpdates = async () => {
  lock.writeLock(async function (release) {
    const token = await getToken();
    let result = await knex
      .select()
      .table("ChangeHistory")
      .where("change", "updateChiffres");
    if (result.length > 0) {
      try {
        await axios.post(api + "/updateChiffres", JSON.stringify(result), {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        });
        await knex("ChangeHistory").where("change", "updateChiffres").del();
        await release();
      } catch (err) {
        console.log("something went wrong");
        console.log(err);
      }
    }
    await release();
    pushUpdates();
  });
};
const getData = async (table) => {
  const Tables = [
    "ventes",
    "Lots",
    "Achats",
    "factures",
    "Devis",
    "BonsLivraison",
    "produit",
    "depots",
  ];
  let Endpoint;
  if (Tables.find((t) => t == table)) {
    Endpoint = api + "/getAlldata";
  } else {
    Endpoint = api + "/getdata";
  }
  const token = await getToken();
  const result = await knex.select("identifier").from(table);
  const identifiers = result.map((e) => e.identifier);
  try {
    const response = await axios.get(Endpoint, {
      headers: {
        token: token,
      },
      params: { collection: table, identifiers: [...identifiers] },
    });
    await insertData(table, response.data.result);
  } catch (err) {
    console.log("something went wrong man !");
    console.log(err);
  }
};
const getupdates = async (table) => {
  const token = await getToken();
  const result = await knex
    .select("lastUpdate")
    .from("DerniereSynchronisation")
    .where("table", table);
  try {
    const response = await axios.get(api + "/getupdates", {
      headers: {
        token: token,
      },
      params: { collection: table, lastUpdate: result[0].lastUpdate },
    });
    await updateData(table, response.data.result,response.data.updateTime);
  } catch (err) {
    console.log("something went wrong man !");
    console.log(err);
  }
};
const insertData = async (table, data) => {
  try {
    for (let i = 0; i < data.length; i++) {
      delete data[i].added;
      delete data[i].lastUpdate;
      delete data[i]._id;
      delete data[i].user;
      delete data[i].SocieteMere;
      await knex(table).insert([{ ...data[i] }]);
    }
  } catch (err) {
    console.log(err);
  }
};
const updateData = async (table, data,time) => {
  try {
    for (let i = 0; i < data.length; i++) {
      delete data[i].added;
      delete data[i].lastUpdate;
      delete data[i]._id;
      delete data[i].user;
      delete data[i].SocieteMere;
      await knex(table)
        .where("identifier", "=", data[i].identifier)
        .update({ ...data[i] });
    }
    await updateSynchronisationTime(table,time);
  } catch (err) {
    console.log(err);
  }
};
const updateSynchronisationTime = async (table,time) => {
  await knex("DerniereSynchronisation")
    .where("table", table)
    .update({ lastUpdate: time });
};
const getToken = async () => {
  const result = await knex("utilisateur").where("id", 1);
  return result[0].identifiant;
};
const addToHistory = (infos) => {
  knex("ChangeHistory")
    .insert([
      {
        ...infos,
        status: 0,
      },
    ])
    .then(function (result) {
      console.log("infos frpù add hist", infos);
    });
}; // Stop error
app.allowRendererProcessReuse = true;
