// Screenshot tool for the OUTFIT Mood prototype.
//   node tools/shoot.mjs
// Produces:
//   screenshots/01-home.png … 04-checkout.png      raw phone screens, 1170×2532 (iPhone 14/15 @3x)
//   screenshots/showcase/01-home.png …             framed 1080×1350 posts with a caption
//   screenshots/showcase/overview.png              all four phones side by side, 1920×1080
// Needs Node 22+ (built-in WebSocket) and Chrome or Edge. No npm packages.

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, mkdtemp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "screenshots");
const PHONE = { width: 390, height: 844, scale: 3 };

// ---------- Static server ----------
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json" };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = resolve(ROOT, "." + (path.endsWith("/") ? path + "index.html" : path));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream" }).end(body);
  } catch { res.writeHead(404).end("not found"); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

// ---------- Chrome over the DevTools protocol ----------
const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium",
].filter(Boolean);
const CHROME = CANDIDATES.find((p) => existsSync(p));
if (!CHROME) { console.error("Chrome/Edge not found. Set CHROME_PATH."); process.exit(1); }

const port = 9400 + Math.floor(Math.random() * 400);
const profile = await mkdtemp(join(tmpdir(), "om-shoot-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
  if (!target) await sleep(200);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let seq = 0; const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") console.warn("  page error:", m.params.exceptionDetails.exception?.description);
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
async function run(js) {
  const r = await send("Runtime.evaluate", { expression: js, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || "eval failed");
  return r.result?.result?.value;
}
async function viewport({ width, height, scale, mobile }) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: scale, mobile });
}
async function goto(url) {
  await send("Page.navigate", { url });
  await sleep(300);
  await run(`new Promise(r => document.readyState === "complete" ? r() : addEventListener("load", r))`);
}
const settle = () => run(`(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.complete ? 0 : i.decode().catch(() => 0)));
  document.activeElement?.blur();
  await new Promise(r => setTimeout(r, 450));
})()`);
async function capture(file) {
  const shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(file, Buffer.from(shot.result.data, "base64"));
  console.log("  saved", file.replace(ROOT, "").replace(/\\/g, "/"));
}

await send("Page.enable");
await send("Runtime.enable");

// ---------- Scene setup helpers (run inside the page) ----------
const resetWithBag = `
  localStorage.clear();
  localStorage.setItem("om_bag_v1", JSON.stringify([
    { id: "essential-hoodie", color: "Burgundy", size: "L", qty: 1 },
    { id: "knit-vest", color: "Emerald", size: "M", qty: 1 },
  ]));`;
const click = (sel) => `document.querySelector(${JSON.stringify(sel)}).click();`;
const wait = (ms) => `await new Promise(r => setTimeout(r, ${ms}));`;
const fill = (name, value) => `(() => { const el = document.querySelector('[name="${name}"]');
  el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event("input", { bubbles: true })); })();`;
// Scroll so an element's top sits just under the sticky top bar
const scrollTo = (sel, offset = 12) => `(() => { const el = document.querySelector(${JSON.stringify(sel)});
  const top = el.getBoundingClientRect().top + scrollY - 58 - ${offset}; scrollTo(0, Math.max(0, top)); })();`;

const SCENES = [
  {
    file: "01-home.png",
    hash: "#/",
    caption: ["Your own store,", "one link in your bio"],
  },
  {
    file: "02-shop.png",
    hash: "#/shop?size=M&sort=new",
    caption: ["Browse by category,", "size and price"],
  },
  {
    file: "03-product.png",
    hash: "#/p/essential-hoodie",
    steps: `${click('[data-color="Burgundy"]')} ${wait(150)} ${click('[data-pick="L"]')} ${wait(150)} ${scrollTo(".pdp-body", 240)}`,   // keep ~240px of photo above the details
    caption: ["Pick colour and size", "in seconds"],
  },
  {
    file: "04-checkout.png",
    hash: "#/checkout",
    steps: `${fill("name", "Youssef Adel")} ${fill("phone", "012 2345 6789")} ${fill("area", "Nasr City")}
      ${fill("address", "12 Abbas El Akkad St, Bldg 5, Apt 8")} ${fill("promo", "MOOD10")}
      ${click("[data-promo]")} ${wait(200)} ${scrollTo("#co-payment", 14)}`,
    caption: ["Cash on delivery,", "anywhere in Egypt"],
  },
];

// ---------- 1) Raw phone screenshots ----------
await mkdir(join(OUT, "showcase"), { recursive: true });
console.log("Phone screens");
await viewport({ ...PHONE, mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true });
await goto(`${BASE}/index.html`);
for (const s of SCENES) {
  await run(resetWithBag);
  await goto(`${BASE}/index.html?shot=${Date.now()}${s.hash}`);
  await settle();
  if (s.steps) { await run(`(async () => { ${s.steps} })()`); await settle(); }
  await capture(join(OUT, s.file));
}

// ---------- 2) Framed showcase posts ----------
console.log("Showcase");
await send("Emulation.setTouchEmulationEnabled", { enabled: false });
await viewport({ width: 1080, height: 1350, scale: 1, mobile: false });
for (const [i, s] of SCENES.entries()) {
  const q = new URLSearchParams({ shot: s.file, n: String(i + 1), l1: s.caption[0], l2: s.caption[1] });
  await goto(`${BASE}/tools/showcase.html?${q}`);
  await settle();
  await capture(join(OUT, "showcase", s.file));
}
await viewport({ width: 1920, height: 1080, scale: 1, mobile: false });
await goto(`${BASE}/tools/showcase.html?overview=1&shots=${SCENES.map((s) => s.file).join(",")}`);
await settle();
await capture(join(OUT, "showcase", "overview.png"));

// ---------- Cleanup ----------
ws.close();
chrome.kill();
server.close();
await sleep(300);
await rm(profile, { recursive: true, force: true }).catch(() => {});
console.log("Done.");
process.exit(0);
