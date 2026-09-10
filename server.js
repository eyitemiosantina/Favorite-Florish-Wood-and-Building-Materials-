const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 10000;

const business = {
  name: "Favourite Florish Wood & Building Materials",
  address: "Mammy Market, Sapele Road, Warri, Delta State",
  phone: "09127495530",
  whatsapp: "2347037671791",
  hours: "Monday – Saturday, 7:00 AM – 6:30 PM"
};

let products = [
  {
    id: 1,
    name: "Timber 2×2",
    category: "Timber & Wood",
    size: "2×2",
    icon: "🪵",
    description: "Quality timber suitable for construction, framing and general building work.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 2,
    name: "Timber 2×3",
    category: "Timber & Wood",
    size: "2×3",
    icon: "🪵",
    description: "Strong timber for building, roofing and carpentry projects.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 3,
    name: "Timber 2×4",
    category: "Timber & Wood",
    size: "2×4",
    icon: "🪵",
    description: "Reliable timber size for a variety of structural and carpentry applications.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 4,
    name: "Timber 1×6",
    category: "Timber & Wood",
    size: "1×6",
    icon: "🪵",
    description: "Useful timber size for construction, finishing and carpentry work.",
    price: null,
    stock: "Available",
    featured: false
  },
  {
    id: 5,
    name: "Plywood",
    category: "Boards & Plywood",
    size: "Various sizes",
    icon: "📐",
    description: "Versatile plywood for construction, furniture, partitions and general use.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 6,
    name: "Roofing Materials",
    category: "Roofing",
    size: "Various",
    icon: "🏠",
    description: "Roofing materials for new construction, renovation and replacement projects.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 7,
    name: "Cement",
    category: "Building Materials",
    size: "Bag",
    icon: "🏗️",
    description: "Cement for concrete, block work, plastering and other building applications.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 8,
    name: "Blocks",
    category: "Building Materials",
    size: "Various",
    icon: "🧱",
    description: "Building blocks for walls, foundations and general construction.",
    price: null,
    stock: "Available",
    featured: false
  },
  {
    id: 9,
    name: "Nails",
    category: "Hardware",
    size: "Various sizes",
    icon: "🔩",
    description: "Nails for carpentry, roofing and general construction work.",
    price: null,
    stock: "Available",
    featured: false
  },
  {
    id: 10,
    name: "Hammer",
    category: "Tools",
    size: "Standard",
    icon: "🔨",
    description: "Useful hand tool for carpentry, construction and everyday building tasks.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 11,
    name: "Hand Saw",
    category: "Tools",
    size: "Standard",
    icon: "🪚",
    description: "Practical hand saw for cutting timber and wood materials.",
    price: null,
    stock: "Available",
    featured: false
  },
  {
    id: 12,
    name: "Cutlass",
    category: "Tools",
    size: "Standard",
    icon: "🛠️",
    description: "General-purpose tool for outdoor and site work.",
    price: null,
    stock: "Available",
    featured: false
  },
  {
    id: 13,
    name: "Twine Rope",
    category: "Ropes & Nets",
    size: "Various",
    icon: "🧵",
    description: "Strong rope for tying, securing materials and general-purpose use.",
    price: null,
    stock: "Available",
    featured: false
  },
  {
    id: 14,
    name: "Tarpaulin",
    category: "Tarpaulin & Covers",
    size: "Various sizes",
    icon: "🟦",
    description: "Protective covering suitable for materials, goods and outdoor use.",
    price: null,
    stock: "Available",
    featured: true
  },
  {
    id: 15,
    name: "Nets",
    category: "Ropes & Nets",
    size: "Various",
    icon: "🕸️",
    description: "Nets for different building, agricultural and general-use needs.",
    price: null,
    stock: "Available",
    featured: false
  },
  {
    id: 16,
    name: "Carpets",
    category: "Carpets",
    size: "Various",
    icon: "🧶",
    description: "Carpets available for home, office and general interior use.",
    price: null,
    stock: "Available",
    featured: true
  }
];

let orders = [];
let quotes = [];

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function makeReference(prefix) {
  return prefix + "-" + Date.now().toString().slice(-8);
}

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Favourite Florish | Wood & Building Materials</title>

<meta
name="description"
content="Favourite Florish Wood & Building Materials – quality timber, plywood, roofing materials, cement, blocks, tools and more in Warri, Delta State."
>

<style>

*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

html{
  scroll-behavior:smooth;
}

body{
  font-family:Arial,Helvetica,sans-serif;
  background:#edf5fc;
  color:#162b3d;
  line-height:1.6;
}

button,
input,
select,
textarea{
  font:inherit;
}

button{
  cursor:pointer;
}

a{
  text-decoration:none;
  color:inherit;
}

/* =========================
   HEADER
========================= */

header{
  position:sticky;
  top:0;
  z-index:1000;
  background:#071d33;
  color:white;
  box-shadow:0 5px 25px rgba(7,29,51,.18);
}

.navbar{
  max-width:1200px;
  margin:auto;
  min-height:76px;
  padding:12px 22px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
}

.brand{
  display:flex;
  align-items:center;
  gap:12px;
}

.brand-mark{
  width:46px;
  height:46px;
  border-radius:14px;
  background:linear-gradient(135deg,#4b91ed,#1769d2);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:24px;
  box-shadow:0 8px 20px rgba(23,105,210,.35);
}

.brand-text strong{
  display:block;
  font-size:17px;
}

.brand-text small{
  color:#bcd5ee;
  font-size:11px;
}

nav{
  display:flex;
  gap:22px;
  align-items:center;
}

nav a{
  color:#e8f2fb;
  font-size:14px;
  font-weight:600;
}

nav a:hover{
  color:#7fb5ff;
}

.nav-actions{
  display:flex;
  align-items:center;
  gap:9px;
}

.nav-btn{
  border:0;
  border-radius:11px;
  padding:11px 14px;
  background:#1769d2;
  color:white;
  font-weight:700;
}

.cart-btn{
  background:#f3f8fc;
  color:#102a43;
}

.menu{
  display:none;
  border:0;
  background:transparent;
  color:white;
  font-size:26px;
}

/* =========================
   HERO
========================= */

.hero{
  background:
    radial-gradient(circle at 90% 20%,rgba(75,145,237,.35),transparent 30%),
    linear-gradient(135deg,#071d33 0%,#102a43 45%,#1769d2 100%);
  color:white;
  padding:78px 22px 90px;
  overflow:hidden;
}

.hero-inner{
  max-width:1200px;
  margin:auto;
  display:grid;
  grid-template-columns:1.15fr .85fr;
  gap:55px;
  align-items:center;
}

.hero-badge{
  display:inline-block;
  padding:8px 13px;
  border-radius:30px;
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.18);
  color:#dcecff;
  font-size:12px;
  font-weight:700;
  letter-spacing:1px;
  margin-bottom:20px;
}

.hero h1{
  font-size:clamp(38px,6vw,68px);
  line-height:1.03;
  margin-bottom:22px;
  letter-spacing:-2px;
}

.hero h1 span{
  color:#8ec1ff;
}

.hero p{
  max-width:650px;
  color:#dbe9f8;
  font-size:17px;
  margin-bottom:30px;
}

.hero-buttons{
  display:flex;
  flex-wrap:wrap;
  gap:12px;
}

.btn{
  border:0;
  border-radius:13px;
  padding:14px 19px;
  font-weight:800;
  display:inline-flex;
  justify-content:center;
  align-items:center;
  gap:8px;
  transition:.2s;
}

.btn:hover{
  transform:translateY(-2px);
}

.btn-primary{
  background:white;
  color:#102a43;
}

.btn-blue{
  background:#1769d2;
  color:white;
}

.btn-outline{
  background:transparent;
  color:white;
  border:1px solid rgba(255,255,255,.3);
}

.hero-visual{
  position:relative;
  min-height:390px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.building-card{
  width:min(390px,100%);
  min-height:330px;
  border-radius:30px;
  background:linear-gradient(145deg,#f8fbfe,#cfe3f5);
  padding:25px;
  color:#102a43;
  box-shadow:0 25px 60px rgba(0,0,0,.25);
  position:relative;
}

.building-card:before{
  content:"";
  position:absolute;
  width:120px;
  height:120px;
  border-radius:50%;
  background:#8ec1ff;
  opacity:.35;
  right:-30px;
  top:-30px;
}

.big-tool{
  font-size:100px;
  text-align:center;
  margin-top:15px;
  filter:drop-shadow(0 15px 12px rgba(0,0,0,.15));
}

.building-card h3{
  font-size:25px;
  margin-top:5px;
}

.building-card p{
  color:#607589;
  font-size:14px;
  margin-top:8px;
}

/* =========================
   GENERAL
========================= */

section{
  padding:75px 22px;
}

.section-inner{
  max-width:1200px;
  margin:auto;
}

.section-heading{
  text-align:center;
  margin-bottom:38px;
}

.section-heading span{
  color:#1769d2;
  font-size:12px;
  font-weight:800;
  letter-spacing:1.5px;
}

.section-heading h2{
  font-size:clamp(28px,4vw,42px);
  color:#102a43;
  margin-top:6px;
}

.section-heading p{
  color:#607589;
  max-width:650px;
  margin:10px auto 0;
}

/* =========================
   FEATURES
========================= */

.features{
  background:#f8fbfe;
}

.feature-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:18px;
}

.feature{
  padding:25px;
  border-radius:20px;
  background:#edf5fc;
  border:1px solid #d4e2ee;
  transition:.2s;
}

.feature:hover{
  transform:translateY(-5px);
  box-shadow:0 15px 35px rgba(16,42,67,.1);
}

.feature-icon{
  font-size:30px;
  margin-bottom:12px;
}

.feature h3{
  color:#102a43;
  font-size:17px;
}

.feature p{
  color:#607589;
  font-size:13px;
  margin-top:5px;
}

/* =========================
   PRODUCTS
========================= */

.products-section{
  background:
    linear-gradient(180deg,#dcecf9 0%,#edf5fc 50%,#e4f0fb 100%);
}

.catalog-top{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  margin-bottom:28px;
  background:#f8fbfe;
  border:1px solid #d4e2ee;
  border-radius:18px;
  padding:15px;
}

.search{
  flex:1;
  min-width:230px;
  padding:14px 16px;
  border-radius:12px;
  border:1px solid #c8d9e8;
  background:white;
  outline:none;
}

.search:focus{
  border-color:#1769d2;
  box-shadow:0 0 0 3px rgba(23,105,210,.1);
}

select{
  min-width:190px;
  padding:14px;
  border-radius:12px;
  border:1px solid #c8d9e8;
  background:white;
  color:#162b3d;
}

.product-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
}

.product{
  background:#f8fbfe;
  border:1px solid #d4e2ee;
  border-radius:22px;
  overflow:hidden;
  transition:.25s;
  position:relative;
}

.product:hover{
  transform:translateY(-6px);
  box-shadow:0 20px 45px rgba(16,42,67,.13);
}

.product-top{
  height:160px;
  background:linear-gradient(135deg,#d8eafa,#edf5fc);
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
}

.product-icon{
  font-size:70px;
  filter:drop-shadow(0 9px 7px rgba(16,42,67,.12));
}

.featured{
  position:absolute;
  top:12px;
  left:12px;
  background:#1769d2;
  color:white;
  padding:5px 9px;
  border-radius:20px;
  font-size:10px;
  font-weight:800;
}

.product-body{
  padding:19px;
}

.product-body small{
  color:#1769d2;
  font-weight:800;
  font-size:11px;
  text-transform:uppercase;
}

.product-body h3{
  margin-top:5px;
  color:#102a43;
  font-size:18px;
}

.product-body p{
  color:#607589;
  font-size:13px;
  margin:7px 0 13px;
  min-height:42px;
}

.product-meta{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
  margin-bottom:14px;
}

.price{
  color:#102a43;
  font-weight:900;
  font-size:14px;
}

.stock{
  color:#177245;
  background:#e5f6ec;
  padding:5px 8px;
  border-radius:20px;
  font-size:10px;
  font-weight:800;
}

.product-buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}

.product-buttons button{
  padding:10px 8px;
  border-radius:10px;
  border:1px solid #c8d9e8;
  background:white;
  color:#102a43;
  font-weight:700;
}

.product-buttons button:last-child{
  background:#1769d2;
  border-color:#1769d2;
  color:white;
}

/* =========================
   ABOUT
========================= */

.about{
  background:#f8fbfe;
}

.about-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:45px;
  align-items:center;
}

.about-box{
  background:linear-gradient(145deg,#102a43,#1769d2);
  color:white;
  border-radius:30px;
  min-height:370px;
  padding:40px;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  box-shadow:0 20px 45px rgba(16,42,67,.18);
}

.about-tools{
  font-size:100px;
}

.about-copy h2{
  color:#102a43;
  font-size:38px;
  line-height:1.15;
  margin-bottom:16px;
}

.about-copy p{
  color:#607589;
  margin-bottom:15px;
}

.check{
  display:flex;
  gap:10px;
  margin:11px 0;
  color:#29465e;
  font-weight:600;
}

.check b{
  color:#1769d2;
}

/* =========================
   QUOTE
========================= */

.quote{
  background:#e4f0fb;
}

.quote-box{
  max-width:850px;
  margin:auto;
  background:#102a43;
  color:white;
  border-radius:28px;
  padding:38px;
}

.quote-box h2{
  font-size:32px;
  margin-bottom:7px;
}

.quote-box p{
  color:#c8d9e8;
  margin-bottom:25px;
}

.form-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:13px;
}

.form-grid input,
.form-grid select,
.form-grid textarea{
  width:100%;
  padding:14px;
  border:1px solid #c8d9e8;
  border-radius:11px;
  background:#f8fbfe;
  color:#162b3d;
  outline:none;
}

.form-grid textarea{
  min-height:120px;
  resize:vertical;
  grid-column:1/-1;
}

.form-full{
  grid-column:1/-1;
}

/* =========================
   CONTACT
========================= */

.contact{
  background:#edf5fc;
}

.contact-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:18px;
}

.contact-card{
  background:#f8fbfe;
  border:1px solid #d4e2ee;
  border-radius:20px;
  padding:25px;
}

.contact-card .icon{
  font-size:28px;
}

.contact-card h3{
  margin:8px 0 4px;
  color:#102a43;
}

.contact-card p{
  color:#607589;
  font-size:14px;
}

.contact-card a{
  color:#1769d2;
  font-weight:800;
}

/* =========================
   FOOTER
========================= */

footer{
  background:#071d33;
  color:white;
  padding:45px 22px 25px;
}

.footer-inner{
  max-width:1200px;
  margin:auto;
  display:grid;
  grid-template-columns:1.5fr 1fr 1fr;
  gap:35px;
}

.footer h3{
  margin-bottom:10px;
}

.footer p,
.footer a{
  color:#bcd5ee;
  font-size:13px;
  display:block;
  margin:6px 0;
}

.footer-bottom{
  max-width:1200px;
  margin:30px auto 0;
  padding-top:20px;
  border-top:1px solid rgba(255,255,255,.1);
  color:#89a9c5;
  font-size:12px;
}

/* =========================
   CART
========================= */

.overlay{
  position:fixed;
  inset:0;
  background:rgba(3,18,31,.55);
  z-index:1500;
  display:none;
}

.overlay.show{
  display:block;
}

.cart{
  position:fixed;
  top:0;
  right:-430px;
  width:min(430px,100%);
  height:100vh;
  background:#f8fbfe;
  z-index:1600;
  box-shadow:-15px 0 40px rgba(0,0,0,.2);
  transition:.3s;
  display:flex;
  flex-direction:column;
}

.cart.show{
  right:0;
}

.cart-head{
  padding:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid #d4e2ee;
}

.close{
  border:0;
  background:#e4f0fb;
  color:#102a43;
  width:35px;
  height:35px;
  border-radius:50%;
  font-size:20px;
}

.cart-items{
  flex:1;
  overflow:auto;
  padding:18px;
}

.cart-item{
  background:white;
  border:1px solid #d4e2ee;
  padding:14px;
  border-radius:15px;
  margin-bottom:10px;
}

.cart-item-row{
  display:flex;
  justify-content:space-between;
  gap:10px;
}

.qty{
  display:flex;
  align-items:center;
  gap:8px;
  margin-top:9px;
}

.qty button{
  width:28px;
  height:28px;
  border:1px solid #c8d9e8;
  border-radius:7px;
  background:#edf5fc;
}

.cart-foot{
  padding:20px;
  border-top:1px solid #d4e2ee;
  background:white;
}

.total{
  display:flex;
  justify-content:space-between;
  font-weight:900;
  font-size:19px;
  margin-bottom:13px;
}

/* =========================
   MODAL
========================= */

.modal{
  position:fixed;
  inset:0;
  background:rgba(3,18,31,.6);
  z-index:2000;
  display:none;
  align-items:center;
  justify-content:center;
  padding:20px;
}

.modal.show{
  display:flex;
}

.modal-box{
  width:min(650px,100%);
  max-height:90vh;
  overflow:auto;
  background:#f8fbfe;
  border-radius:25px;
  padding:27px;
  position:relative;
}

.modal-head{
  display:flex;
  justify-content:space-between;
  gap:15px;
  margin-bottom:20px;
}

.modal-box h2{
  color:#102a43;
}

.modal-content p{
  color:#607589;
  margin:8px 0;
}

.success{
  text-align:center;
  padding:25px;
}

.success-icon{
  font-size:65px;
  margin-bottom:10px;
}

/* =========================
   ADMIN
========================= */

.admin-section{
  background:#d8e7f4;
}

.admin-login{
  max-width:500px;
  margin:auto;
  background:#102a43;
  color:white;
  border-radius:25px;
  padding:30px;
}

.admin-login h2{
  margin-bottom:8px;
}

.admin-login p{
  color:#c8d9e8;
  font-size:13px;
  margin-bottom:18px;
}

.admin-login input{
  width:100%;
  padding:14px;
  border-radius:10px;
  border:0;
  margin-bottom:10px;
}

.admin-dashboard{
  display:none;
}

.admin-dashboard.show{
  display:block;
}

.admin-stats{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:15px;
  margin-bottom:25px;
}

.stat{
  background:#f8fbfe;
  border:1px solid #c8d9e8;
  padding:20px;
  border-radius:18px;
}

.stat strong{
  display:block;
  font-size:27px;
  color:#1769d2;
}

.admin-table{
  background:#f8fbfe;
  border-radius:20px;
  overflow:auto;
  border:1px solid #c8d9e8;
}

table{
  width:100%;
  border-collapse:collapse;
  min-width:700px;
}

th,
td{
  padding:14px;
  text-align:left;
  border-bottom:1px solid #d4e2ee;
  font-size:13px;
}

th{
  background:#102a43;
  color:white;
}

.admin-actions{
  display:flex;
  gap:6px;
}

.admin-actions button{
  border:0;
  padding:7px 9px;
  border-radius:8px;
  background:#1769d2;
  color:white;
}

/* =========================
   RESPONSIVE
========================= */

@media(max-width:1000px){

  .hero-inner{
    grid-template-columns:1fr;
  }

  .hero-visual{
    min-height:300px;
  }

  .feature-grid{
    grid-template-columns:repeat(2,1fr);
  }

  .product-grid{
    grid-template-columns:repeat(3,1fr);
  }

  .about-grid{
    grid-template-columns:1fr;
  }

  .contact-grid{
    grid-template-columns:1fr 1fr;
  }

  .footer-inner{
    grid-template-columns:1fr 1fr;
  }

  .admin-stats{
    grid-template-columns:repeat(2,1fr);
  }
}

@media(max-width:720px){

  nav{
    display:none;
    position:absolute;
    top:76px;
    left:0;
    right:0;
    background:#071d33;
    padding:20px;
    flex-direction:column;
    align-items:flex-start;
  }

  nav.open{
    display:flex;
  }

  .menu{
    display:block;
  }

  .nav-actions{
    margin-left:auto;
  }

  .nav-actions .nav-btn{
    display:none;
  }

  .hero{
    padding-top:55px;
  }

  .hero h1{
    letter-spacing:-1px;
  }

 

  
