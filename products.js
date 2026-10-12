// Product catalog — built from the owner's Instagram photos in assets/products/.
// Names, prices and sizes are prototype placeholders until the owner confirms them.
window.CATEGORIES = [
  { id: "hoodies",     name: "Hoodies",     img: "assets/img/p3-black-hoodie.jpg" },
  { id: "zip-ups",     name: "Zip-Ups",     img: "assets/img/p2-heather-zip.jpg" },
  { id: "sweatshirts", name: "Sweatshirts", img: "assets/img/p5-cord-mockneck.jpg" },
  { id: "vests",       name: "Vests",       img: "assets/img/p6-knit-vest.jpg" },
];

window.PRODUCTS = [
  {
    id: "essential-hoodie",
    name: "Essential Oversized Hoodie",
    category: "hoodies",
    price: 950,
    badge: "Best seller",
    img: "assets/img/p1-essential-hoodie.jpg",
    focus: "50% 55%",
    detail: "42% 62%",          // close-up point for the 2nd gallery slide
    colors: [
      { name: "Off-White", hex: "#eeebe4" },
      { name: "Blush",     hex: "#d9a3ae" },
      { name: "Charcoal",  hex: "#3d3f42" },
      { name: "Burgundy",  hex: "#5e1a22" },
      { name: "Olive",     hex: "#3f4a35" },
      { name: "Black",     hex: "#111111" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 24,
    desc: "Heavy brushed fleece, dropped shoulders and a roomy hood. Our everyday staple in six colours.",
  },
  {
    id: "heather-zip",
    name: "Heather Zip-Up Hoodie",
    category: "zip-ups",
    price: 1150,
    badge: "New",
    img: "assets/img/p2-heather-zip.jpg",
    focus: "50% 40%",
    detail: "50% 66%",          // close-up point for the 2nd gallery slide
    colors: [{ name: "Oatmeal Heather", hex: "#cfc9bf" }],
    sizes: ["S", "M", "L", "XL"],
    stock: 9,
    desc: "Soft heathered fleece with a full metal zip and kangaroo pockets. Relaxed fit for layering.",
  },
  {
    id: "black-hoodie",
    name: "Heavyweight Hoodie",
    category: "hoodies",
    price: 1050,
    badge: null,
    img: "assets/img/p3-black-hoodie.jpg",
    focus: "50% 45%",
    detail: "50% 22%",          // close-up point for the 2nd gallery slide
    colors: [{ name: "Black", hex: "#111111" }],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 3,
    desc: "A dense, structured hoodie that holds its shape. Clean front, no logos, deep black.",
  },
  {
    id: "fleece-zip",
    name: "Fleece Zip Hoodie",
    category: "zip-ups",
    price: 1100,
    badge: null,
    img: "assets/img/p4-fleece-zip.jpg",
    focus: "40% 40%",
    detail: "34% 66%",          // close-up point for the 2nd gallery slide
    colors: [
      { name: "Grey",  hex: "#a3a5a8" },
      { name: "White", hex: "#f2f0ea" },
      { name: "Brown", hex: "#4a2420" },
      { name: "Black", hex: "#111111" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 18,
    desc: "Warm inside, clean outside. Oversized fit with a two-way zip and deep pockets.",
  },
  {
    id: "cord-mockneck",
    name: "Ribbed Cord Mock Neck",
    category: "sweatshirts",
    price: 890,
    badge: "New",
    img: "assets/img/p5-cord-mockneck.jpg",
    focus: "50% 45%",
    detail: "50% 39%",          // close-up point for the 2nd gallery slide
    colors: [{ name: "Caramel", hex: "#9a5a26" }],
    sizes: ["M", "L", "XL"],
    stock: 6,
    desc: "Velvet-touch ribbed cord with a mock neck and script embroidery on the chest.",
  },
  {
    id: "knit-vest",
    name: "Knit Sweater Vest",
    category: "vests",
    price: 650,
    badge: null,
    img: "assets/img/p6-knit-vest.jpg",
    focus: "28% 40%",
    detail: "28% 34%",          // close-up point for the 2nd gallery slide
    colors: [
      { name: "Emerald", hex: "#0f5a52" },
      { name: "Brown",   hex: "#3d2420" },
      { name: "Grey",    hex: "#8f9092" },
      { name: "Black",   hex: "#151515" },
      { name: "White",   hex: "#f1efe9" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    desc: "Layer it over a shirt for an instant smart look. Soft knit, sleeveless, V-neck.",
  },
];

// Store settings (prototype values — confirm with the owner)
window.STORE = {
  freeShippingOver: 2000,      // EGP
  exchangeDays: 14,
  noDeliveryDay: 5,            // Friday (0 = Sunday): couriers skip it
};

// Delivery zones by governorate: fee in EGP and working-day range
const ZONE = {
  metro:  { fee: 60,  days: [1, 2] },
  north:  { fee: 75,  days: [2, 3] },
  south:  { fee: 90,  days: [3, 5] },
  remote: { fee: 110, days: [4, 6] },
};
window.GOVERNORATES = [
  ["Cairo", "metro"], ["Giza", "metro"],
  ["Alexandria", "north"], ["Qalyubia", "north"], ["Dakahlia", "north"], ["Sharqia", "north"],
  ["Gharbia", "north"], ["Monufia", "north"], ["Beheira", "north"], ["Kafr El Sheikh", "north"],
  ["Damietta", "north"], ["Port Said", "north"], ["Ismailia", "north"], ["Suez", "north"],
  ["Faiyum", "south"], ["Beni Suef", "south"], ["Minya", "south"], ["Asyut", "south"],
  ["Sohag", "south"], ["Qena", "south"], ["Luxor", "south"], ["Aswan", "south"],
  ["Red Sea", "remote"], ["New Valley", "remote"], ["Matrouh", "remote"],
  ["North Sinai", "remote"], ["South Sinai", "remote"],
].map(([name, zone]) => ({ name, ...ZONE[zone] }));

// Size guide in cm (oversized fit)
window.SIZE_GUIDE = {
  cols: ["Size", "Chest", "Length", "Sleeve"],
  rows: [
    ["S",   "112", "68", "58"],
    ["M",   "118", "70", "60"],
    ["L",   "124", "72", "62"],
    ["XL",  "130", "74", "64"],
    ["XXL", "136", "76", "66"],
  ],
};
