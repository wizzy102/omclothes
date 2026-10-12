// OUTFIT MOOD — ordering prototype
// Hash router: #/  #/shop  #/p/:id  #/checkout  #/order/:id
(function () {
  const view = document.getElementById("view");

  // ---- Routes (each returns an HTML string) ----
  const stub = (title, note) => `
    <section class="stub">
      <h1>${title}</h1>
      <p>${note}</p>
    </section>`;

  const routes = [
    { tab: "home",     match: /^\/?$/,              render: () => stub("Home", "Built in step 2.") },
    { tab: "shop",     match: /^\/shop$/,           render: () => stub("Shop", "Built in step 3.") },
    { tab: "shop",     match: /^\/p\/([\w-]+)$/,    render: (id) => stub("Product", `Product “${id}” — built in step 4.`) },
    { tab: "checkout", match: /^\/checkout$/,       render: () => stub("Checkout", "Built in step 5.") },
    { tab: "checkout", match: /^\/order\/([\w-]+)$/, render: (id) => stub("Order confirmed", `Order ${id} — built in step 5.`) },
  ];

  function router() {
    const path = location.hash.replace(/^#/, "") || "/";
    let hit = null, params = [];
    for (const r of routes) {
      const m = path.match(r.match);
      if (m) { hit = r; params = m.slice(1); break; }
    }
    if (!hit) { location.hash = "#/"; return; }

    view.innerHTML = hit.render(...params);
    document.querySelectorAll(".tabbar a").forEach((a) =>
      a.classList.toggle("active", a.dataset.tab === hit.tab)
    );
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", router);
  router();
})();
