const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path"); //lien
const ipc = ipcMain;
const fs = require("fs");
const { shell } = require("electron");
const { dirname, win32 } = require("path");

let d = new Date();
let filename =
  "DetailCompteDu-" +
  d.getDate() +
  "-" +
  (d.getMonth() + 1) +
  "-" +
  d.getFullYear();

//creation fenetre
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 640,
    // closable: true,
    // darkTheme: true,
    frame: false,
    icon: path.join(__dirname, "./budgeting.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, //true -> sécurité si lier avec web
      devTools: false,
      // devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
  // win.webContents.openDevTools();
  // gestion Ipc
  // top menu

  ipc.on("reduceApp", () => {
    console.log("reduceApp - ok");
    win.minimize();
  });
  ipc.on("sizeApp", () => {
    console.log("sizeApp - ok");
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });
  ipc.on("closeApp", () => {
    console.log("closeApp - ok");
    win.close();
  });

  ipc.on("reload", () => {
    win.reload();
  });

  ipc.on("exportPdf", () => {
    console.log("*** EXPORT PDF");
    // Chemin d'export
    var filepath = path.join(__dirname, "./" + filename + "-export.pdf");
    // Options du PDF
    var options = {
      marginsType: 1,
      pageSize: "A4",
      printBackground: true,
      printSelectionOnly: false,
      landscape: false,
    };

    // realiser export + manip
    win.webContents
      .printToPDF(options)
      .then((data) => {
        fs.writeFile(filepath, data, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("PDF Generated Successfully");
            // win.loadURL(filepath);
            shell.showItemInFolder(filepath);
            shell.openPath(filepath);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // Manipulation BDD
  ipc.on("addLigneToDb", (e, data) => {
    var DataStore = require("nedb"),
      db = new DataStore({ filename: "data.db", autoload: true });

    db.insert(data, function (err, newrec) {
      if (err != null) {
        console.log("*** err = ", err);
      }
      console.log("*** created", newrec);
      win.reload();
    });
  });
}

// electron est prêt
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// gestion fermeture de toute fenetre
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
