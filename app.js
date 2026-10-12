// OUTFIT MOOD — ordering prototype
// Hash router: #/  #/shop  #/p/:id  #/checkout  #/order/:id
(function () {
  const view = document.getElementById("view");
  const PRODUCTS = window.PRODUCTS;
  const CATEGORIES = window.CATEGORIES;

  // ---------- Helpers ----------
  const fmt = (n) => n.toLocaleString("en-US");
  const money = (n) => `<span class="price"><small>EGP</small>${fmt(n)}</span>`;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  const icon = {
    heart: `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
    cash: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M6 9.5v5M18 9.5v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    truck: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="1.8" fill="var(--surface)" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="17.5" r="1.8" fill="var(--surface)" stroke="currentColor" stroke-width="1.7"/></svg>`,
    swap: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };

  // ---------- Shared components ----------
  function badgeFor(p) {
    if (p.stock <= 5) return `<span class="badge badge-low">Only ${p.stock} left</span>`;
    if (p.badge === "New") return `<span class="badge badge-new">New</span>`;
    if (p.badge) return `<span class="badge">${p.badge}</span>`;
    return "";
  }

  function swatches(p, max = 4) {
    const dots = p.colors.slice(0, max)
      .map((c) => `<span class="swatch-dot" style="background:${c.hex}" title="${c.name}"></span>`).join("");
    const more = p.colors.length > max ? `<span class="swatch-more">+${p.colors.length - max}</span>` : "";
    return `<span class="swatches">${dots}${more}</span>`;
  }

  function productCard(p) {
    return `
      <a class="card" href="#/p/${p.id}">
        <div class="card-media">
          <img src="${p.img}" alt="${p.name}" loading="lazy" style="object-position:${p.focus || "50% 50%"}" />
          ${badgeFor(p)}
          <span class="fav" aria-hidden="true">${icon.heart}</span>
        </div>
        <div class="card-body">
          <p class="card-name">${p.name}</p>
          <div class="card-row">${money(p.price)}${swatches(p)}</div>
        </div>
      </a>`;
  }

  const footer = () => `
    <footer class="footer">
      <span class="wordmark"><span class="wm-outfit">OUTFIT</span><span class="wm-mood">Mood</span></span>
      <p>Menswear for going out · Made for Egypt</p>
      <p>@omclothes2025</p>
    </footer>`;

  // ---------- Pages ----------
  function home() {
    const newIn = ["essential-hoodie", "heather-zip", "cord-mockneck", "fleece-zip"].map(byId);
    return `
      <section class="hero">
        <img src="assets/img/p1-essential-hoodie.jpg" alt="Essential Oversized Hoodie in six colours" />
        <div class="hero-copy">
          <span class="eyebrow">Winter Edit '26</span>
          <h1 class="hero-title">Six colours,<br/>one <em>mood</em></h1>
          <p class="hero-sub">Heavy fleece hoodies from EGP 950.</p>
          <a class="btn btn-light" href="#/shop">Shop the collection</a>
        </div>
      </section>

      <div class="trust">
        <div>${icon.cash}Cash on delivery<span>All governorates</span></div>
        <div>${icon.truck}1–5 day delivery<span>Cairo next day</span></div>
        <div>${icon.swap}Easy exchange<span>Within 14 days</span></div>
      </div>

      <section class="section">
        <div class="section-head">
          <div><span class="eyebrow">Browse</span><h2 class="section-title">Categories</h2></div>
        </div>
        <div class="cats">
          ${CATEGORIES.map((c) => `
            <a class="cat" href="#/shop?c=${c.id}">
              <span class="cat-img"><img src="${c.img}" alt="" /></span>
              ${c.name}
            </a>`).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div><span class="eyebrow">Just landed</span><h2 class="section-title">New in</h2></div>
          <a class="link-more" href="#/shop">View all</a>
        </div>
        <div class="grid">${newIn.map(productCard).join("")}</div>
      </section>

      <section class="promo">
        <span class="eyebrow">Order in a minute</span>
        <h3>Pay cash when it arrives</h3>
        <p>Pick your size, add your address and we deliver to your door anywhere in Egypt.</p>
        <a class="btn btn-light" href="#/shop">Start shopping</a>
        <span class="promo-mark" aria-hidden="true">Mood</span>
      </section>

      ${footer()}`;
  }

  // Placeholder for pages built in later steps
  const stub = (title, note) => `
    <section class="stub">
      <h1>${title}</h1>
      <p>${note}</p>
    </section>`;

  // ---------- Router ----------
  const routes = [
    { tab: "home",     match: /^\/?$/,                    render: home },
    { tab: "shop",     match: /^\/shop(?:\?(.*))?$/,      render: () => stub("Shop", "Built in step 3.") },
    { tab: "shop",     match: /^\/p\/([\w-]+)$/,          render: (id) => stub("Product", `Product “${id}” — built in step 4.`) },
    { tab: "checkout", match: /^\/checkout$/,             render: () => stub("Checkout", "Built in step 5.") },
    { tab: "checkout", match: /^\/order\/([\w-]+)$/,      render: (id) => stub("Order confirmed", `Order ${id} — built in step 5.`) },
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
