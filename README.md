# OUTFIT Mood — online ordering prototype

A clickable mobile storefront for [@omclothes2025](https://www.instagram.com/omclothes2025/): home, shop with filters, product page, bag, checkout with cash on delivery, and order confirmation. Plain HTML, CSS and JavaScript with no build step.

## Run it

Serve the folder with any static server and open it on a phone-sized window:

```
python -m http.server 5173
```

Then open http://127.0.0.1:5173/.

## Regenerate the screenshots

Needs Node 22+ and Chrome or Edge.

```
node tools/shoot.mjs
```

| Output | Size |
|---|---|
| `screenshots/01-home.png` … `04-checkout.png` | 1170×2532 phone screens |
| `screenshots/showcase/01-home.png` … `04-checkout.png` | 1080×1350 framed posts |
| `screenshots/showcase/overview.png` | 1920×1080, all four phones |

## Where things live

- `products.js` holds products, prices, delivery fees by governorate, and the size guide. All values are placeholders to confirm with the owner.
- `assets/products/` keeps the owner's original photos. The cleaned copies used by the site are in `assets/img/`.
- The promo code `MOOD10` gives 10% off, for demo purposes.
