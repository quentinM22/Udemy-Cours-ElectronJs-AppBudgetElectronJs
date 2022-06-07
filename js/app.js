// fix jQuery
window.$ = window.jQuery = require("./vendor/jquery/jquery.min.js");

const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

const reduceBtn = document.getElementById("reduceBtn");
const sizeBtn = document.getElementById("sizeBtn");
const closeBtn = document.getElementById("closeBtn");

reduceBtn.addEventListener("click", () => {
  ipc.send("reduceApp");
});
sizeBtn.addEventListener("click", () => {
  ipc.send("sizeApp");
});
closeBtn.addEventListener("click", () => {
  ipc.send("closeApp");
});

// mise en place bdd via formulaire
const btnAddLigne = document.getElementById("btnSaveLigne");
if (btnAddLigne != null) {
  btnAddLigne.addEventListener("click", () => {
    //  input formulaire
    const dateVal = document.getElementById("dateLigne");
    const montantVal = document.getElementById("montantLigne");
    const infoVal = document.getElementById("infoLigne");
    // preparer pour inserer bdd
    var _myrec = {
      date: dateVal.value,
      montant: montantVal.value,
      info: infoVal.value,
    };
    // console.log(" *** debug : ", _myrec);
    ipc.send("addLigneToDb", _myrec);
  });
}
