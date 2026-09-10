const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// ============================================
// BASIC SERVER SETUP
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve everything inside public/
app.use(express.static(path.join(__dirname, "public")));


// ============================================
// SIMPLE DATA STORAGE
// ============================================

const dataFolder = path.join(__dirname, "data");

const productsFile = path.join(
  dataFolder,
  "products.json"
);

const ordersFile = path.join(
  dataFolder,
  "orders.json"
);

const quotesFile = path.join(
  dataFolder,
  "quotes.json"
);


// Create data folder if it doesn't exist
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}


// Create empty files if they don't exist
function createFileIfMissing(file, defaultData) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify(defaultData, null, 2)
    );
  }
}


createFileIfMissing(productsFile, []);
createFileIfMissing(ordersFile, []);
createFileIfMissing(quotesFile, []);


// ============================================
// FILE HELPERS
// ============================================

function readData(file) {
  try {
    const content = fs.readFileSync(
      file,
      "utf8"
    );

    return JSON.parse(content);
  } catch (error) {
    console.error("Could not read data:", error);
    return [];
  }
}


function writeData(file, data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}


// ============================================
// HOME ROUTE
// ============================================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});


// ============================================
// PRODUCTS API
// ============================================

// Get all products
app.get("/api/products", (req, res) => {
  const products = readData(productsFile);

  res.json(products);
});


// Get one product
app.get("/api/products/:id", (req, res) => {
  const products = readData(productsFile);

  const product = products.find(
    item => String(item.id) === String(req.params.id)
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found."
    });
  }

  res.json(product);
});


//
