// const { ipcMain } = require("electron");

$(() => {
  let date = new Date();

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

  let DataStore = require("nedb"),
    db = new DataStore({ filename: "data.db", autoload: true });

  const revenusMois = document.getElementById("revenusMois");
  const revenusAn = document.getElementById("revenusAn");
  const depenseMois = document.getElementById("depenseMois");
  const depenseMoisStyle = document.getElementById("depenseMoisStyle");
  const depenseAn = document.getElementById("depenseAn");

  db.find({}, function (err, docs) {
    // console.log("***doc", docs);

    let rec = 0;
    let dep = 0;
    let recm = 0;
    let depm = 0;

    docs.forEach((element) => {
      if (parseInt(element.montant) > 0) {
        rec += parseInt(element.montant);
      } else {
        dep += parseInt(element.montant);
      }

      if (element.date >= minDate && element.date <= maxDate) {
        if (parseInt(element.montant) > 0) {
          recm += parseInt(element.montant);
        } else {
          depm += parseInt(element.montant);
        }
      }
    });
    revenusAn.innerHTML = rec + "€";
    depenseAn.innerHTML = dep + "€";
    revenusMois.innerHTML = recm + "€";

    // calcul % depense
    // formule : v1 * 100 / v2
    let pourcentage = (depm * 100) / recm;

    depenseMois.innerHTML = Math.trunc(pourcentage) * -1 + "%";
    depenseMoisStyle.style.width = pourcentage + "%";
  });
});
