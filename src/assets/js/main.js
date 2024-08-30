window.addEventListener("DOMContentLoaded", (() => {
  let search;

  function initSearch() {
    void 0 === search && (search = new PagefindUI({
      element: "#pagefind",
      showSubResults: !0,
      autofocus: true
    }),
    document.addEventListener("keydown", keydownHandler))
  }

  function getSearch() {
    return document.querySelector("search")
  }

  function keydownHandler(event) {
    "Escape" !== event.key && "Escape" !== event.code || void 0 === search || (getSearch().disabled = !1,
    search.destroy(),
    search = void 0);
    const isCmdOrCtrlPressed = (navigator?.userAgentData?.platform || navigator?.userAgent).toLowerCase().indexOf("mac") >= 0 ? event.metaKey : event.ctrlKey;
    "k" === event.key.toLowerCase() && isCmdOrCtrlPressed && (event.preventDefault(),
    initSearch(),
    console.log("Command + K was pressed"))
  }
  document.addEventListener("keydown", keydownHandler),
  // document.getElementById("show-search").onclick = initSearch
  getSearch().onclick = initSearch
}));
