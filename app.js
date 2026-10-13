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
    back: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    close: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    ruler: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 15.5 15.5 3 21 8.5 8.5 21zM7 12l2 2M10 9l2 2M13 6l2 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="9.8" r="2.3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>`,
    bag: `<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/></svg>`,
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
        <p class="card-name">${p.name}</p>
        <div class="card-row">${money(p.price)}${swatches(p)}</div>
      </a>`;
  }

  const footer = () => `
    <footer class="footer">
      <span class="wordmark"><span class="wm-outfit">OUTFIT</span><span class="wm-mood">Mood</span></span>
      <p>Menswear for going out · Made for Egypt</p>
      <p>@omclothes2025</p>
    </footer>`;

  // ---------- Bag (persisted in localStorage) ----------
  const STORE = window.STORE;
  const GOVERNORATES = window.GOVERNORATES;
  const CART_KEY = "om_bag_v1";
  const GOV_KEY = "om_gov_v1";

  const store = {
    get(key, fallback) {
      try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: keep in memory only */ }
    },
  };

  let bag = store.get(CART_KEY, []).filter((i) => byId(i.id) && i.qty > 0);
  const lineKey = (i) => `${i.id}|${i.color}|${i.size}`;
  const bagCount = () => bag.reduce((n, i) => n + i.qty, 0);
  const bagSubtotal = () => bag.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
  const MAX_QTY = 10;

  function saveBag() {
    store.set(CART_KEY, bag);
    renderBadges();
    if (!drawer.hidden) drawer.innerHTML = drawerHTML();
  }
  function addToBag(id, color, size, qty = 1) {
    const key = lineKey({ id, color, size });
    const line = bag.find((i) => lineKey(i) === key);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
    else bag.push({ id, color, size, qty });
    saveBag();
  }
  function setLineQty(key, qty) {
    bag = qty <= 0
      ? bag.filter((i) => lineKey(i) !== key)
      : bag.map((i) => (lineKey(i) === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i));
    saveBag();
  }
  function renderBadges() {
    const n = bagCount();
    document.querySelectorAll(".bag-count").forEach((el) => { el.textContent = n; el.hidden = !n; });
  }

  // ---------- Delivery estimate ----------
  const govByName = (name) => GOVERNORATES.find((g) => g.name === name) || GOVERNORATES[0];
  const preferredGov = () => govByName(store.get(GOV_KEY, "Cairo"));

  function addWorkingDays(from, n) {
    const d = new Date(from);
    while (n > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== STORE.noDeliveryDay) n--;
    }
    return d;
  }
  function arrivalText(gov) {
    const f = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    const a = addWorkingDays(new Date(), gov.days[0]);
    const b = addWorkingDays(new Date(), gov.days[1]);
    return `${f(a)} – ${f(b)}`;
  }

  // ---------- Overlays: drawer, sheet, toast ----------
  const scrim = document.querySelector(".scrim");
  const drawer = document.getElementById("drawer");
  const sheet = document.getElementById("sheet");

  function openOverlay(el) {
    el.hidden = false; scrim.hidden = false;
    document.body.classList.add("locked");
    requestAnimationFrame(() => { el.classList.add("open"); scrim.classList.add("open"); });
  }
  function closeOverlays() {
    // If the bag was edited from the checkout page, refresh the order summary and totals
    if (drawer.classList.contains("open") && document.body.dataset.page === "checkout") {
      const y = window.scrollY;
      view.innerHTML = checkout();
      mountCheckout();
      window.scrollTo(0, y);
    }
    [drawer, sheet].forEach((el) => el.classList.remove("open"));
    scrim.classList.remove("open");
    document.body.classList.remove("locked");
    setTimeout(() => {
      [drawer, sheet].forEach((el) => { if (!el.classList.contains("open")) el.hidden = true; });
      if (!drawer.classList.contains("open") && !sheet.classList.contains("open")) scrim.hidden = true;
    }, 260);
  }

  function drawerHTML() {
    const n = bagCount();
    const sub = bagSubtotal();
    const left = STORE.freeShippingOver - sub;
    const pct = Math.min(100, Math.round((sub / STORE.freeShippingOver) * 100));

    const head = `
      <header class="drawer-head">
        <h2>Your bag <span>(${n})</span></h2>
        <button class="icon-btn" data-close aria-label="Close">${icon.close}</button>
      </header>`;

    if (!n) {
      return `${head}
        <div class="drawer-empty">
          ${icon.bag}
          <p class="empty-title">Your bag is empty</p>
          <p>Find your mood in the new winter edit.</p>
          <a class="btn btn-primary" href="#/shop" data-close>Start shopping</a>
        </div>`;
    }

    return `${head}
      <div class="ship-meter">
        <p>${left > 0
          ? `Add <strong>EGP ${fmt(left)}</strong> more for <strong>free delivery</strong>`
          : `${icon.check} You've unlocked <strong>free delivery</strong>`}</p>
        <div class="meter"><span style="width:${pct}%"></span></div>
      </div>

      <ul class="lines">
        ${bag.map((i) => {
          const p = byId(i.id);
          const key = lineKey(i);
          return `
            <li class="line">
              <a href="#/p/${p.id}" data-close class="line-img"><img src="${p.img}" alt="" style="object-position:${p.focus}" /></a>
              <div class="line-info">
                <p class="line-name">${p.name}</p>
                <p class="line-meta">${i.color} · ${i.size}</p>
                <div class="line-row">
                  <div class="stepper stepper-sm">
                    <button data-dec="${key}" aria-label="Decrease">${icon.minus}</button>
                    <span>${i.qty}</span>
                    <button data-inc="${key}" aria-label="Increase" ${i.qty >= MAX_QTY ? "disabled" : ""}>${icon.plus}</button>
                  </div>
                  ${money(p.price * i.qty)}
                </div>
                <button class="line-remove" data-remove="${key}">Remove</button>
              </div>
            </li>`;
        }).join("")}
      </ul>

      <footer class="drawer-foot">
        <div class="sum-row"><span>Subtotal</span>${money(sub)}</div>
        <p class="drawer-note">${icon.cash} Delivery calculated at checkout · Cash on delivery</p>
        <a class="btn btn-primary btn-block" href="#/checkout" data-close>Checkout</a>
        <button class="btn-text" data-close>Continue shopping</button>
      </footer>`;
  }

  function openDrawer() {
    closeSheetOnly();
    drawer.innerHTML = drawerHTML();
    openOverlay(drawer);
  }
  function closeSheetOnly() { sheet.classList.remove("open"); sheet.hidden = true; }

  drawer.addEventListener("click", (e) => {
    const t = e.target.closest("[data-dec],[data-inc],[data-remove],[data-close]");
    if (!t) return;
    const line = (k) => bag.find((i) => lineKey(i) === k);
    if (t.dataset.dec) setLineQty(t.dataset.dec, line(t.dataset.dec).qty - 1);
    else if (t.dataset.inc) setLineQty(t.dataset.inc, line(t.dataset.inc).qty + 1);
    else if (t.dataset.remove) setLineQty(t.dataset.remove, 0);
    else closeOverlays();   // links with data-close still navigate
  });

  function openSizeGuide() {
    const g = window.SIZE_GUIDE;
    sheet.innerHTML = `
      <div class="sheet-grip"></div>
      <header class="drawer-head">
        <h2>Size guide</h2>
        <button class="icon-btn" data-close aria-label="Close">${icon.close}</button>
      </header>
      <p class="sheet-intro">Our pieces have a relaxed, oversized fit. Measurements are in cm. Between sizes? Take the smaller one for a cleaner fit.</p>
      <table class="size-table">
        <thead><tr>${g.cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
        <tbody>${g.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
      <p class="sheet-intro">Still unsure? Send us your height and weight on Instagram and we'll pick your size.</p>`;
    openOverlay(sheet);
  }
  sheet.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeOverlays(); });
  scrim.addEventListener("click", closeOverlays);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeOverlays(); });

  // Any [data-action=cart] (top bar bag, Bag tab) opens the drawer
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-action=cart]");
    if (!t) return;
    e.preventDefault();
    openDrawer();
  });

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

  // ---------- Shop ----------
  const SIZES = ["S", "M", "L", "XL", "XXL"];
  const SORTS = [
    { id: "featured",   label: "Featured" },
    { id: "new",        label: "Newest" },
    { id: "price-asc",  label: "Price: low to high" },
    { id: "price-desc", label: "Price: high to low" },
  ];

  function shopState(query) {
    const q = new URLSearchParams(query || "");
    return {
      c: CATEGORIES.some((c) => c.id === q.get("c")) ? q.get("c") : "all",
      size: SIZES.includes(q.get("size")) ? q.get("size") : "",
      sort: SORTS.some((s) => s.id === q.get("sort")) ? q.get("sort") : "featured",
    };
  }

  function shopQuery(st) {
    const q = new URLSearchParams();
    if (st.c !== "all") q.set("c", st.c);
    if (st.size) q.set("size", st.size);
    if (st.sort !== "featured") q.set("sort", st.sort);
    const s = q.toString();
    return s ? `?${s}` : "";
  }

  function shopResults(st) {
    const list = PRODUCTS.filter((p) =>
      (st.c === "all" || p.category === st.c) && (!st.size || p.sizes.includes(st.size))
    );
    if (st.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (st.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (st.sort === "new") list.sort((a, b) => (b.badge === "New") - (a.badge === "New"));
    return list;
  }

  function shop(query) {
    const st = shopState(query);
    const list = shopResults(st);
    const cat = CATEGORIES.find((c) => c.id === st.c);
    const tabs = [{ id: "all", name: "All" }, ...CATEGORIES];

    return `
      <header class="page-head">
        <span class="eyebrow">Winter Edit '26</span>
        <h1 class="page-title">${cat ? cat.name : "Shop all"}</h1>
      </header>

      <nav class="tabs" aria-label="Categories">
        ${tabs.map((t) => `
          <button class="tab ${st.c === t.id ? "active" : ""}" data-cat="${t.id}">${t.name}</button>`).join("")}
      </nav>

      <div class="filters">
        <div class="chips" role="group" aria-label="Filter by size">
          <span class="chips-label">Size</span>
          ${SIZES.map((s) => `
            <button class="chip ${st.size === s ? "active" : ""}" data-size="${s}" aria-pressed="${st.size === s}">${s}</button>`).join("")}
        </div>
        <div class="results-bar">
          <span class="count">${list.length} ${list.length === 1 ? "piece" : "pieces"}</span>
          <label class="sort">
            <span class="sr-only">Sort by</span>
            <select data-sort>
              ${SORTS.map((s) => `<option value="${s.id}" ${st.sort === s.id ? "selected" : ""}>${s.label}</option>`).join("")}
            </select>
          </label>
        </div>
      </div>

      <section class="section section-tight">
        ${list.length
          ? `<div class="grid">${list.map(productCard).join("")}</div>`
          : `<div class="empty">
               <p class="empty-title">Nothing in size ${st.size} here yet</p>
               <p>New pieces drop every week.</p>
               <button class="btn btn-primary" data-clear>Clear filters</button>
             </div>`}
      </section>

      <p class="shop-note">New drops every week · Follow <strong>@omclothes2025</strong></p>
      ${footer()}`;
  }

  function mountShop(query) {
    let st = shopState(query);
    const update = (patch) => {
      st = { ...st, ...patch };
      const y = window.scrollY;
      view.innerHTML = shop(shopQuery(st).slice(1));
      history.replaceState(null, "", `#/shop${shopQuery(st)}`);
      window.scrollTo(0, y);
    };
    view.onclick = (e) => {
      const t = e.target.closest("[data-cat],[data-size],[data-clear]");
      if (!t) return;
      if (t.dataset.cat) update({ c: t.dataset.cat });
      else if (t.dataset.size) update({ size: st.size === t.dataset.size ? "" : t.dataset.size });
      else update({ size: "", c: "all" });
    };
    view.onchange = (e) => {
      if (e.target.matches("[data-sort]")) update({ sort: e.target.value });
    };
  }

  // ---------- Product page ----------
  let pdp = null;   // { id, color, size, qty, error }

  const DETAILS = {
    fit: ["Relaxed, oversized fit", "Dropped shoulders", "Take your usual size"],
    care: ["Machine wash cold, inside out", "Do not tumble dry", "Iron on low heat"],
  };

  function product(id) {
    const p = byId(id);
    if (!p) return `<section class="stub"><h1>Not found</h1><p>This piece is no longer available.</p><a class="btn btn-primary" href="#/shop" style="margin-top:16px">Back to shop</a></section>`;
    if (!pdp || pdp.id !== id) pdp = { id, color: p.colors[0].name, size: "", qty: 1, error: false };
    const st = pdp;
    const cat = CATEGORIES.find((c) => c.id === p.category);
    const gov = preferredGov();
    const freeShip = p.price * st.qty >= STORE.freeShippingOver;
    const related = PRODUCTS.filter((x) => x.id !== p.id)
      .sort((a, b) => (b.category === p.category) - (a.category === p.category))
      .slice(0, 4);

    return `
      <article class="pdp">
        <div class="gallery">
          <div class="slides" data-slides>
            <div class="slide"><img src="${p.img}" alt="${p.name}" style="object-position:${p.focus}" /></div>
            <div class="slide slide-zoom"><img src="${p.img}" alt="${p.name} close-up" style="transform-origin:${p.detail}" /></div>
          </div>
          <button class="g-btn g-back" data-back aria-label="Back">${icon.back}</button>
          <span class="g-btn g-fav" aria-hidden="true">${icon.heart}</span>
          <div class="dots" aria-hidden="true"><span class="active"></span><span></span></div>
        </div>

        <div class="pdp-body">
          <span class="eyebrow">${cat.name}</span>
          <h1 class="pdp-title">${p.name}</h1>
          <div class="pdp-price">
            ${money(p.price)}
            ${p.stock <= 5
              ? `<span class="stock stock-low">Only ${p.stock} left</span>`
              : `<span class="stock">${icon.check} In stock</span>`}
          </div>
          <p class="pdp-desc">${p.desc}</p>

          <div class="opt">
            <div class="opt-head"><span>Colour: <strong>${st.color}</strong></span><span class="opt-sub">${p.colors.length} ${p.colors.length === 1 ? "colour" : "colours"}</span></div>
            <div class="color-row">
              ${p.colors.map((c) => `
                <button class="color-btn ${c.name === st.color ? "active" : ""}" data-color="${c.name}" aria-label="${c.name}" aria-pressed="${c.name === st.color}">
                  <span style="background:${c.hex}"></span>
                </button>`).join("")}
            </div>
          </div>

          <div class="opt ${st.error ? "opt-error" : ""}" id="size-opt">
            <div class="opt-head">
              <span>Size: <strong>${st.size || "Select"}</strong></span>
              <button class="link-guide" data-guide>${icon.ruler} Size guide</button>
            </div>
            <div class="size-row">
              ${SIZES.map((s) => {
                const ok = p.sizes.includes(s);
                return `<button class="size-btn ${st.size === s ? "active" : ""}" ${ok ? `data-pick="${s}"` : "disabled"} aria-pressed="${st.size === s}">${s}</button>`;
              }).join("")}
            </div>
            ${st.error ? `<p class="opt-hint">Please choose your size</p>` : ""}
          </div>

          <div class="opt opt-inline">
            <span class="opt-label">Quantity</span>
            <div class="stepper">
              <button data-qty="-1" aria-label="Decrease" ${st.qty <= 1 ? "disabled" : ""}>${icon.minus}</button>
              <span>${st.qty}</span>
              <button data-qty="1" aria-label="Increase" ${st.qty >= MAX_QTY ? "disabled" : ""}>${icon.plus}</button>
            </div>
          </div>

          <div class="info-card">
            <label class="info-row">
              ${icon.pin}
              <span class="info-text"><span class="info-title">Deliver to</span>
                <select data-gov>
                  ${GOVERNORATES.map((g) => `<option ${g.name === gov.name ? "selected" : ""}>${g.name}</option>`).join("")}
                </select>
              </span>
            </label>
            <div class="info-row">
              ${icon.truck}
              <span class="info-text"><span class="info-title">Arrives ${arrivalText(gov)}</span>
                <span class="info-sub">${freeShip ? "Free delivery on this order" : `Delivery EGP ${gov.fee} · free over EGP ${fmt(STORE.freeShippingOver)}`}</span></span>
            </div>
            <div class="info-row">
              ${icon.cash}
              <span class="info-text"><span class="info-title">Cash on delivery</span>
                <span class="info-sub">Or pay by InstaPay / Vodafone Cash</span></span>
            </div>
            <div class="info-row">
              ${icon.swap}
              <span class="info-text"><span class="info-title">Free exchange in ${STORE.exchangeDays} days</span>
                <span class="info-sub">Wrong size? We swap it at your door</span></span>
            </div>
          </div>

          <details class="acc" open>
            <summary>Details &amp; fit</summary>
            <ul>${DETAILS.fit.map((d) => `<li>${d}</li>`).join("")}</ul>
          </details>
          <details class="acc">
            <summary>Care</summary>
            <ul>${DETAILS.care.map((d) => `<li>${d}</li>`).join("")}</ul>
          </details>
        </div>

        <section class="section">
          <div class="section-head">
            <div><span class="eyebrow">Complete the look</span><h2 class="section-title">You may also like</h2></div>
          </div>
          <div class="rail">${related.map(productCard).join("")}</div>
        </section>

        <div class="buybar">
          <div class="buybar-price">
            ${money(p.price * st.qty)}
            <span>${st.size ? `${st.color} · ${st.size}` : "Cash on delivery"}</span>
          </div>
          <button class="btn btn-primary" data-add>Add to bag</button>
        </div>
      </article>`;
  }

  function mountProduct(id) {
    const p = byId(id);
    if (!p) return;

    const rerender = () => {
      const y = window.scrollY;
      view.innerHTML = product(id);
      wireGallery();
      window.scrollTo(0, y);
    };

    function wireGallery() {
      const slides = view.querySelector("[data-slides]");
      const dots = view.querySelectorAll(".dots span");
      slides.addEventListener("scroll", () => {
        const i = Math.round(slides.scrollLeft / slides.clientWidth);
        dots.forEach((d, j) => d.classList.toggle("active", i === j));
      }, { passive: true });
    }
    wireGallery();

    view.onclick = (e) => {
      const t = e.target.closest("[data-color],[data-pick],[data-qty],[data-guide],[data-add],[data-back]");
      if (!t) return;
      if (t.dataset.color) { pdp.color = t.dataset.color; rerender(); }
      else if (t.dataset.pick) { pdp.size = t.dataset.pick; pdp.error = false; rerender(); }
      else if (t.dataset.qty) { pdp.qty = Math.max(1, Math.min(MAX_QTY, pdp.qty + Number(t.dataset.qty))); rerender(); }
      else if (t.hasAttribute("data-guide")) openSizeGuide();
      else if (t.hasAttribute("data-back")) {
        if (history.length > 1) history.back(); else location.hash = "#/shop";
      }
      else if (t.hasAttribute("data-add")) {
        if (!pdp.size) {
          pdp.error = true;
          rerender();
          view.querySelector("#size-opt").scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        addToBag(p.id, pdp.color, pdp.size, pdp.qty);   // the drawer opening is the confirmation
        pdp.qty = 1;
        rerender();
        openDrawer();
      }
    };
    view.onchange = (e) => {
      if (e.target.matches("[data-gov]")) { store.set(GOV_KEY, e.target.value); rerender(); }
    };
  }

  // Simple message page (not found, empty states)
  const stub = (title, note, cta = "") => `
    <section class="stub">
      <h1>${title}</h1>
      <p>${note}</p>
      ${cta}
    </section>`;

  // ---------- Checkout ----------
  const ORDERS_KEY = "om_orders_v1";
  const CUSTOMER_KEY = "om_customer_v1";
  const PROMOS = { MOOD10: 0.1 };            // prototype promo code: 10% off
  const PAYMENTS = [
    { id: "cod",      name: "Cash on delivery", sub: "Pay when your order arrives" },
    { id: "instapay", name: "InstaPay",         sub: "Transfer after we confirm your order" },
    { id: "vfcash",   name: "Vodafone Cash",    sub: "Transfer after we confirm your order" },
  ];
  let co = null;   // checkout form state, kept across re-renders

  function freshCheckout() {
    const saved = store.get(CUSTOMER_KEY, {});
    return {
      name: saved.name || "", phone: saved.phone || "",
      gov: saved.gov || preferredGov().name,
      area: saved.area || "", address: saved.address || "", landmark: saved.landmark || "",
      payment: "cod", promo: "", promoApplied: "", promoError: "",
      errors: {},
    };
  }

  const normPhone = (v) => v.replace(/\D/g, "").replace(/^(20)?0?/, "");
  const validPhone = (v) => /^1[0125]\d{8}$/.test(normPhone(v));
  const prettyPhone = (v) => normPhone(v).replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");   // 122 345 6789

  function validate(f) {
    const e = {};
    if (f.name.trim().length < 3) e.name = "Please enter your full name";
    if (!validPhone(f.phone)) e.phone = "Enter a valid Egyptian mobile, e.g. 010 1234 5678";
    if (f.area.trim().length < 2) e.area = "Please enter your city or area";
    if (f.address.trim().length < 5) e.address = "Please enter street, building and apartment";
    return e;
  }

  function totals(f) {
    const sub = bagSubtotal();
    const discount = Math.round(sub * (PROMOS[f.promoApplied] || 0));
    const gov = govByName(f.gov);
    const delivery = sub - discount >= STORE.freeShippingOver ? 0 : gov.fee;
    return { sub, discount, delivery, total: sub - discount + delivery, gov };
  }

  const field = (f, key, label, attrs = "", optional = false) => `
    <label class="field ${f.errors[key] ? "has-error" : ""}">
      <span class="field-label">${label}${optional ? ` <em>Optional</em>` : ""}</span>
      <input name="${key}" value="${escapeAttr(f[key])}" ${attrs} />
      ${f.errors[key] ? `<span class="field-err">${f.errors[key]}</span>` : ""}
    </label>`;

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function checkout() {
    if (!bagCount()) {
      co = null;
      return stub("Your bag is empty", "Add a few pieces and come back to check out.",
        `<a class="btn btn-primary" href="#/shop" style="margin-top:18px">Start shopping</a>`);
    }
    if (!co) co = freshCheckout();
    const f = co;
    const t = totals(f);

    return `
      <div class="checkout">
        <header class="page-head">
          <span class="eyebrow">Almost yours</span>
          <h1 class="page-title">Checkout</h1>
        </header>

        <section class="co-card">
          <div class="co-h">
            <h2>Your order <span>· ${bagCount()} ${bagCount() === 1 ? "item" : "items"}</span></h2>
            <button class="co-link" data-action="cart">Edit</button>
          </div>
          <ul class="mini-lines">
            ${bag.map((i) => {
              const p = byId(i.id);
              return `
                <li>
                  <span class="mini-img"><img src="${p.img}" alt="" style="object-position:${p.focus}" /><b>${i.qty}</b></span>
                  <span class="mini-info"><strong>${p.name}</strong><span>${i.color} · ${i.size}</span></span>
                  ${money(p.price * i.qty)}
                </li>`;
            }).join("")}
          </ul>
        </section>

        <form class="co-form" novalidate>
          <section class="co-card">
            <div class="co-h"><h2><span class="num">1</span>Contact</h2></div>
            ${field(f, "name", "Full name", `autocomplete="name" placeholder="e.g. Ahmed Hassan"`)}
            <label class="field ${f.errors.phone ? "has-error" : ""}">
              <span class="field-label">Mobile number</span>
              <span class="phone-input">
                <span class="cc">+20</span>
                <input name="phone" value="${escapeAttr(f.phone)}" inputmode="tel" autocomplete="tel-national" placeholder="10 1234 5678" />
              </span>
              ${f.errors.phone
                ? `<span class="field-err">${f.errors.phone}</span>`
                : `<span class="field-help">We'll call this number to confirm your order</span>`}
            </label>
          </section>

          <section class="co-card">
            <div class="co-h"><h2><span class="num">2</span>Delivery</h2></div>
            <label class="field">
              <span class="field-label">Governorate</span>
              <span class="select-wrap">
                <select name="gov">
                  ${GOVERNORATES.map((g) => `<option ${g.name === f.gov ? "selected" : ""}>${g.name}</option>`).join("")}
                </select>
              </span>
            </label>
            ${field(f, "area", "City / area", `autocomplete="address-level2" placeholder="e.g. Nasr City"`)}
            ${field(f, "address", "Street, building, floor, apartment", `autocomplete="street-address" placeholder="e.g. 12 Abbas El Akkad St, Bldg 5, Floor 3, Apt 8"`)}
            ${field(f, "landmark", "Landmark", `placeholder="e.g. Next to City Stars"`, true)}

            <div class="ship-option">
              ${icon.truck}
              <span class="info-text">
                <span class="info-title">Standard delivery</span>
                <span class="info-sub">Arrives ${arrivalText(t.gov)}</span>
              </span>
              <span class="ship-fee">${t.delivery ? `EGP ${t.delivery}` : "Free"}</span>
            </div>
          </section>

          <section class="co-card" id="co-payment">
            <div class="co-h"><h2><span class="num">3</span>Payment</h2></div>
            <div class="pay-list" role="radiogroup" aria-label="Payment method">
              ${PAYMENTS.map((m) => `
                <label class="pay ${f.payment === m.id ? "active" : ""}">
                  <input type="radio" name="payment" value="${m.id}" ${f.payment === m.id ? "checked" : ""} />
                  <span class="radio" aria-hidden="true"></span>
                  <span class="info-text"><span class="info-title">${m.name}</span><span class="info-sub">${m.sub}</span></span>
                  ${m.id === "cod" ? `<span class="pay-tag">Popular</span>` : ""}
                </label>`).join("")}
            </div>
          </section>

          <section class="co-card">
            <div class="promo-row ${f.promoError ? "has-error" : ""}">
              <input name="promo" value="${escapeAttr(f.promo)}" placeholder="Promo code" autocapitalize="characters" />
              <button type="button" class="btn-apply" data-promo>${f.promoApplied ? "Applied" : "Apply"}</button>
            </div>
            ${f.promoError ? `<span class="field-err">${f.promoError}</span>` : ""}
            ${f.promoApplied ? `<span class="field-ok">${icon.check} ${f.promoApplied} — 10% off your order</span>` : ""}

            <dl class="totals">
              <div><dt>Subtotal</dt><dd>${money(t.sub)}</dd></div>
              ${t.discount ? `<div class="disc"><dt>Discount</dt><dd>−${money(t.discount)}</dd></div>` : ""}
              <div><dt>Delivery · ${t.gov.name}</dt><dd>${t.delivery ? money(t.delivery) : `<span class="free">Free</span>`}</dd></div>
              <div class="grand"><dt>Total</dt><dd>${money(t.total)}</dd></div>
            </dl>
          </section>

          <p class="co-legal">${icon.swap} Free exchange within ${STORE.exchangeDays} days. We'll call to confirm before we ship.</p>
        </form>

        <div class="buybar">
          <div class="buybar-price">
            ${money(t.total)}
            <span>${PAYMENTS.find((m) => m.id === f.payment).name}</span>
          </div>
          <button class="btn btn-primary" data-place>Place order</button>
        </div>
      </div>`;
  }

  function mountCheckout() {
    if (!co) return;
    const rerender = () => {
      const y = window.scrollY;
      view.innerHTML = checkout();
      window.scrollTo(0, y);
    };

    view.oninput = (e) => {
      const n = e.target.name;
      if (["name", "phone", "area", "address", "landmark", "promo"].includes(n)) {
        co[n] = e.target.value;
        if (co.errors[n]) {                 // clear the error as soon as it's fixed
          const still = validate(co)[n];
          if (!still) { delete co.errors[n]; e.target.closest(".field")?.classList.remove("has-error"); e.target.closest(".field")?.querySelector(".field-err")?.remove(); }
        }
      }
    };
    view.onchange = (e) => {
      if (e.target.name === "gov") { co.gov = e.target.value; store.set(GOV_KEY, co.gov); rerender(); }
      if (e.target.name === "payment") { co.payment = e.target.value; rerender(); }
    };
    view.onclick = (e) => {
      if (e.target.closest("[data-promo]")) {
        const code = co.promo.trim().toUpperCase();
        if (PROMOS[code]) { co.promoApplied = code; co.promo = code; co.promoError = ""; }
        else { co.promoApplied = ""; co.promoError = code ? "That code isn't valid" : "Enter a code first"; }
        rerender();
      }
      if (e.target.closest("[data-place]")) placeOrder();
    };
    view.onsubmit = (e) => { e.preventDefault(); placeOrder(); };

    function placeOrder() {
      co.errors = validate(co);
      if (Object.keys(co.errors).length) {
        rerender();
        view.querySelector(".has-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const orders = store.get(ORDERS_KEY, []);
      const t = totals(co);
      const order = {
        id: `OM-${1048 + orders.length}`,
        placedAt: new Date().toISOString(),
        items: bag.map((i) => ({ ...i, name: byId(i.id).name, price: byId(i.id).price, img: byId(i.id).img, focus: byId(i.id).focus })),
        customer: { name: co.name.trim(), phone: `+20 ${prettyPhone(co.phone)}`, gov: co.gov, area: co.area.trim(), address: co.address.trim(), landmark: co.landmark.trim() },
        payment: co.payment,
        promo: co.promoApplied,
        sub: t.sub, discount: t.discount, delivery: t.delivery, total: t.total,
        arrival: arrivalText(t.gov),
      };
      store.set(ORDERS_KEY, [...orders, order]);
      store.set(CUSTOMER_KEY, { name: order.customer.name, phone: co.phone, gov: co.gov, area: co.area, address: co.address, landmark: co.landmark });
      bag = [];
      saveBag();
      co = null;
      location.hash = `#/order/${order.id}`;
    }
  }

  // ---------- Order confirmed ----------
  function orderPage(id) {
    const o = store.get(ORDERS_KEY, []).find((x) => x.id === id);
    if (!o) return stub("Order not found", "We couldn't find that order on this device.",
      `<a class="btn btn-primary" href="#/shop" style="margin-top:18px">Continue shopping</a>`);
    const first = o.customer.name.split(" ")[0];
    const pay = PAYMENTS.find((m) => m.id === o.payment);
    const placed = new Date(o.placedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

    return `
      <div class="order">
        <div class="order-hero">
          <span class="order-tick">${icon.check}</span>
          <span class="eyebrow">Order ${o.id}</span>
          <h1 class="page-title">Thank you, <em>${first}</em></h1>
          <p>Your order is in. We'll call <strong>${o.customer.phone}</strong> to confirm it before we ship.</p>
        </div>

        <section class="co-card">
          <ol class="timeline">
            <li class="done"><span></span><div><strong>Order placed</strong><small>${placed}</small></div></li>
            <li><span></span><div><strong>Confirmed by phone</strong><small>Usually within a few hours</small></div></li>
            <li><span></span><div><strong>Out for delivery</strong><small>${o.customer.gov}</small></div></li>
            <li><span></span><div><strong>Delivered</strong><small>${o.arrival}</small></div></li>
          </ol>
        </section>

        <section class="co-card">
          <div class="co-h"><h2>Order summary</h2></div>
          <ul class="mini-lines">
            ${o.items.map((i) => `
              <li>
                <span class="mini-img"><img src="${i.img}" alt="" style="object-position:${i.focus}" /><b>${i.qty}</b></span>
                <span class="mini-info"><strong>${i.name}</strong><span>${i.color} · ${i.size}</span></span>
                ${money(i.price * i.qty)}
              </li>`).join("")}
          </ul>
          <dl class="totals">
            <div><dt>Subtotal</dt><dd>${money(o.sub)}</dd></div>
            ${o.discount ? `<div class="disc"><dt>Discount · ${o.promo}</dt><dd>−${money(o.discount)}</dd></div>` : ""}
            <div><dt>Delivery</dt><dd>${o.delivery ? money(o.delivery) : `<span class="free">Free</span>`}</dd></div>
            <div class="grand"><dt>Total</dt><dd>${money(o.total)}</dd></div>
          </dl>
        </section>

        <section class="co-card order-meta">
          <div><span class="field-label">Deliver to</span><p>${o.customer.name}<br/>${o.customer.address}<br/>${o.customer.area}, ${o.customer.gov}${o.customer.landmark ? `<br/><small>${o.customer.landmark}</small>` : ""}</p></div>
          <div><span class="field-label">Payment</span><p>${pay.name}<br/><small>${o.payment === "cod" ? `Have EGP ${fmt(o.total)} ready on delivery` : "We'll send transfer details when we call"}</small></p></div>
        </section>

        <div class="order-actions">
          <a class="btn btn-primary btn-block" href="#/shop">Continue shopping</a>
        </div>
      </div>`;
  }

  // ---------- Router ----------
  const routes = [
    { name: "home",     tab: "home",     match: /^\/?$/,                    render: home },
    { name: "shop",     tab: "shop",     match: /^\/shop(?:\?(.*))?$/,      render: shop, mount: mountShop },
    { name: "product",  tab: "shop",     match: /^\/p\/([\w-]+)$/,          render: product, mount: mountProduct },
    { name: "checkout", tab: "checkout", match: /^\/checkout$/,             render: checkout, mount: mountCheckout },
    { name: "order",    tab: "checkout", match: /^\/order\/([\w-]+)$/,      render: orderPage },
  ];

  function router() {
    const path = location.hash.replace(/^#/, "") || "/";
    let hit = null, params = [];
    for (const r of routes) {
      const m = path.match(r.match);
      if (m) { hit = r; params = m.slice(1); break; }
    }
    if (!hit) { location.hash = "#/"; return; }

    view.onclick = view.onchange = view.oninput = view.onsubmit = null;   // drop the previous page's handlers
    if (hit.name !== "product") pdp = null;                // fresh selections next time a product opens
    if (hit.name !== "checkout" && co) co.errors = {};     // keep typed details, drop stale errors
    closeOverlays();
    document.body.dataset.page = hit.name;
    view.innerHTML = hit.render(...params);
    if (hit.mount) hit.mount(...params);
    document.querySelectorAll(".tabbar a").forEach((a) =>
      a.classList.toggle("active", a.dataset.tab === hit.tab)
    );
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", router);
  renderBadges();
  router();

  // Small API for the checkout step and screenshot demo mode
  window.OM = { addToBag, getBag: () => bag.map((i) => ({ ...i })), bagSubtotal, openDrawer, closeOverlays };
})();
