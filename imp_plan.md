# OUTFIT MOOD (@omclothes2025) — Online Ordering Prototype

## Context
OUTFIT MOOD is a small Egyptian menswear brand on Instagram (~524 followers) selling jackets, parkas, fleece and sweatshirts. Today every order goes through Instagram DMs ("اطلب عبر الرسائل"), with no prices, no website and no WhatsApp listed. We want a clickable prototype of a full online ordering system, then **4 strong mobile screenshots** of the customer journey plus a short **offer message** to pitch the owner.

Decisions made with the user:
- **Market:** Egypt. Prices in EGP, +20 phone numbers, delivery by governorate, cash on delivery (COD) first.
- **Language:** English only.
- **4 screens:** Customer journey only: Home, Shop/catalog, Product page, Checkout.
- **Photos:** The user will drop the logo and 6–8 product screenshots from IG into `assets/`. The prototype shows clean branded placeholders until those files exist.
- **Workflow:** Build step by step, pausing after each step for the user's review.

## Steps
1. Scaffold: folders, `assets/` with instructions, app shell, router stub. ✅
2. Design system and Home screen. ✅ Brand-matched: navy and copper from the logo, Cormorant Garamond with a script "Mood". Real product photos are wired in early, cleaned into `assets/img/`.
3. Shop screen. ✅ Category tabs, size filter and sort, all kept in the URL. Includes an empty state.
4. Product page and cart drawer. ✅ Two-slide gallery with a close-up, colour and size pickers, size guide sheet, delivery estimate by governorate that skips Fridays, and a sticky add-to-bag bar. The bag drawer has a free-delivery meter and persists in localStorage.
5. Checkout and order-confirmed screen. ✅ Validated contact and delivery form with +20 phone check, governorate-based delivery fee, COD / InstaPay / Vodafone Cash, promo code MOOD10, and an order timeline. WhatsApp hand-off dropped at the user's request; the store calls to confirm instead.
6. Polish pass: confirm product names and prices with the owner and fine-tune image crops. Most of this step was pulled forward into step 2.
7. Screenshot script, the 4 PNGs and the framed showcase versions.
8. Offer message to the owner.

## Approach
A static site with no build step: plain HTML, CSS and vanilla JS, with hash routing and the cart stored in localStorage. It runs from a simple local server and is easy to hand over or host later on Netlify or GitHub Pages. Screenshots come from headless Chrome, which is already installed, so nothing new needs installing.

## Files (all new, in `C:\Users\MSI\OneDrive\Desktop\omclothes\`)
- `index.html`: app shell with header, bottom nav, cart drawer and a floating WhatsApp button.
- `styles.css`: mobile-first streetwear look. Off-white and near-black with one accent colour, a bold condensed display font (Anton or Archivo Black) with Inter for body text, from Google Fonts.
- `products.js`: catalog data with 8 products, each with name, category, EGP price, sizes S–XXL, colours, stock and image path `assets/products/p1.jpg` … `p8.jpg`. Placeholder prices are realistic for Egypt, for example sweatshirts EGP 850–1,200, jackets EGP 1,500–2,400 and parkas EGP 2,200–3,000.
- `app.js`: router, rendering, cart logic, checkout validation, order creation and the WhatsApp hand-off.
- `assets/`: the folder the user fills. `assets/logo/` holds the logo, `assets/products/` holds product screenshots, and `assets/README.md` explains what to drop where. Raw IG screenshots are fine; they get cropped and renamed in step 6.
- `shoot.mjs`: screenshot script.
- `screenshots/`: output folder.
- `offer.md`: pitch message to the owner.

## Screens (all functional, 4 are screenshotted)
1. **Home** (`#/`): logo bar, full-bleed hero "Winter Drop '26 — Shop Now" from `assets/products/hero.jpg`, category chips, a "New In" 2-column grid with prices, a trust strip (COD everywhere in Egypt, 14-day exchange, delivery in 1–5 days) and a WhatsApp float.
2. **Shop** (`#/shop`): category tabs, size filter, sort, and a product grid with "Low stock" and "New" badges.
3. **Product** (`#/p/:id`): swipeable image gallery, name, EGP price, colour swatches, size pills with a size-guide sheet, quantity, sticky "Add to Bag", a delivery estimate by governorate and a COD badge.
4. **Checkout** (`#/checkout`): name, phone with +20 validation, governorate dropdown that sets the shipping fee (Cairo/Giza EGP 60, others EGP 80–100), address, and payment options (COD by default, InstaPay, Vodafone Cash). It shows a live order summary and a "Place Order" button.
5. **Order confirmed** (`#/order/:id`): a functional extra, not screenshotted. It shows an order number and summary, plus an "Also confirm on WhatsApp" button that opens a pre-filled wa.me message to the owner. That message is the practical order-routing step until a real backend exists.

**Cart drawer:** slides in from any page, with editable quantities and subtotal.

## Screenshots (`shoot.mjs`)
- The script runs `npx serve` or `python -m http.server`, then headless Chrome with an iPhone-sized viewport and `--force-device-scale-factor=3` for crisp 1170×2532 PNGs.
- A `?demo=1` URL parameter fills the cart and checkout form so screens 3 and 4 look lived-in.
- Output: `screenshots/01-home.png`, `02-shop.png`, `03-product.png`, `04-checkout.png`.
- **Bonus:** `screenshots/showcase/*.png` places each screen in a phone frame on a branded background with a one-line caption, ready to send in a DM. This is built from a small `showcase.html` and shot the same way.

## Offer (`offer.md`)
A short DM or WhatsApp pitch in English with an Egyptian Arabic version, since the owner writes in Arabic. It covers:
- The problem: orders lost in DMs, the same price questions answered by hand, no record of orders.
- What they get: their own store link for the IG bio, the full order flow, COD and InstaPay, and orders arriving on WhatsApp.
- The offer: a setup fee plus an optional monthly fee, with **price placeholders** for the user to fill in. A suggested range for the Egyptian market is noted, and the final number is the user's call.
- A clear next step, such as "reply and I'll send you a live demo link".

## Verification
1. Serve the folder and click through the whole journey: Home, Shop, Product, add to bag, Checkout, Order confirmed. Check that the cart persists after a refresh, that an invalid phone number is blocked, that changing the governorate updates the total, and that the WhatsApp link has the right pre-filled text.
2. Run `node shoot.mjs` and open all 4 PNGs to check there's no clipped text, broken images or layout overflow at 390px width.
3. Check it once with the placeholders before photos are added and once after the user adds the IG photos. Re-tune the accent colour to match their photos and re-shoot.
