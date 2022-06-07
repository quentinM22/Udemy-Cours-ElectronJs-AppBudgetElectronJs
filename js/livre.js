const { ipcMain } = require("electron");

$(() => {
  let mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  let selectedDate = new Date();
  // gestion mois en cour
  let dateShowed = document.getElementById("dateShowed");
  dateShowed.innerHTML =
    mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();

  // gestion btn prev next
  let prevMonth = document.getElementById("prevMonth");
  let nextMonth = document.getElementById("nextMonth");
  //   gestion click + modif mois
  prevMonth.addEventListener("click", () => {
    selectedDate = new Date(selectedDate.setMonth(selectedDate.getMonth() - 1));
    dateShowed.innerHTML =
      mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();
    loadTableLines(selectedDate);
  });
  nextMonth.addEventListener("click", () => {
    selectedDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + 1));
    dateShowed.innerHTML =
      mois[selectedDate.getMonth()] + " " + selectedDate.getFullYear();
    loadTableLines(selectedDate);
  });

  loadTableLines(selectedDate);

  const exportPdfBtn = document.getElementById("genPdf");
  exportPdfBtn.addEventListener("click", () => {
    ipc.send("exportPdf");
  });
});

// charger bdd
loadTableLines = function (date) {
  let mois = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  let minDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-01";
  let maxDate = date.getFullYear() + "-" + mois[date.getMonth()] + "-31";

  // charger bdd
  let DataStore = require("nedb"),
    db = new DataStore({ filename: "data.db", autoload: true });
  // recup contenu bdd
  //   db.find({}, function (err, docs) {
  // filtre par date
  db.find(
    { $and: [{ date: { $gte: minDate } }, { date: { $lte: maxDate } }] },
    function (err, docs) {
      // console.log("***doc", docs);

      let tableRegistre = document.getElementById("tableRegistre");
      let tableRows = tableRegistre.querySelectorAll("thead > tr");
      // supprime le contenu du tableau
      tableRows.forEach((el, i) => {
        if (i > 0) {
          el.parentNode.removeChild(el);
        }
      });
      // on construit le contenu tab
      docs.forEach((el, i) => {
        // creation ligne
        let row = tableRegistre.insertRow(1);
        // creation cellules
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);

        // injecter cellules
        cell1.innerHTML = el.date;
        cell2.innerHTML =
          el.montant > 0
            ? '<span class="badge badge-success text-white">' +
              el.montant +
              " €</span>"
            : '<span class="badge badge-danger text-white">' +
              el.montant +
              " €</span>";
        cell3.innerHTML = el.info;
        cell4.innerHTML =
          '<button id="' +
          el._id +
          '" class="btn btn-danger" ><i class="fa fa-trash"></i></button>';
        // gestion btn action
        let btn = document.getElementById(el._id);
        btn.addEventListener("click", () => {
          console.log("***Demande de supp de ", el._id);
          db.remove({ _id: el._id }, function (err, nbRemoved) {
            if (err != null) {
              console.log("***err = ", err);
            }
            console.log(nbRemoved + "lines removed!");
            ipc.send("reload");
          });
        });
      });
    }
  );
};
