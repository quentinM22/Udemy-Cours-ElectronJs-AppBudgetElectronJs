// contenu est chargé
window.addEventListener("DOMContentLoaded", () => {
  // fonction injecter text
  const replaceText = (selector, text) => {
    const el = document.getElementById(selector);
    if (el) {
      el.innerHTML = text;
    }
  };
  // boucle outils remplace text
  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
