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

// Serve files inside public/
app.use(express.static(path.join(__dirname, "public")));


// ============================================
// DATA STORAGE
// ============================================

const dataFolder = path.join(__dirname, "data");

const productsFile = path.join(dataFolder, "products.json");
const ordersFile = path.join(dataFolder, "orders.json");
const quotesFile = path.join(dataFolder, "quotes.json");


// Create data folder if missing
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}


// Create JSON files if missing
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
    const content = fs.readFileSync(file, "utf8");
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
// HOME
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


// Add product
app.post("/api/products", (req, res) => {
  const products = readData(productsFile);

  const product = {
    id: Date.now().toString(),
    name: req.body.name || "",
    category: req.body.category || "",
    size: req.body.size || "",
    photo: req.body.photo || "",
    description: req.body.description || "",
    price: req.body.price ?? null,
    availability: req.body.availability || "Available",
    featured: Boolean(req.body.featured),
    quantity: req.body.quantity || "",
    unit: req.body.unit || ""
  };

  products.push(product);
  writeData(productsFile, products);

  res.status(201).json(product);
});


// Edit product
app.patch("/api/products/:id", (req, res) => {
  const products = readData(productsFile);

  const index = products.findIndex(
    item => String(item.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found."
    });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id
  };

  writeData(productsFile, products);

  res.json(products[index]);
});


// Delete product
app.delete("/api/products/:id", (req, res) => {
  const products = readData(productsFile);

  const filtered = products.filter(
    item => String(item.id) !== String(req.params.id)
  );

  if (filtered.length === products.length) {
    return res.status(404).json({
      message: "Product not found."
    });
  }

  writeData(productsFile, filtered);

  res.json({
    message: "Product deleted successfully."
  });
});


// ============================================
// ORDERS API
// ============================================

// Create order
app.post("/api/orders", (req, res) => {
  const orders = readData(ordersFile);

  const reference =
    "FF-" +
    Date.now().toString().slice(-8);

  const order = {
    reference,
    customer: req.body.customer || {},
    items: req.body.items || [],
    total: req.body.total || 0,
    fulfillment: req.body.fulfillment || "delivery",
    deliveryAddress: req.body.deliveryAddress || "",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  writeData(ordersFile, orders);

  res.status(201).json(order);
});


// Get all orders
app.get("/api/orders", (req, res) => {
  const orders = readData(ordersFile);
  res.json(orders);
});


// Get one order
app.get("/api/orders/:reference", (req, res) => {
  const orders = readData(ordersFile);

  const order = orders.find(
    item => item.reference === req.params.reference
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found."
    });
  }

  res.json(order);
});


// Update order status
app.patch("/api/orders/:reference", (req, res) => {
  const orders = readData(ordersFile);

  const index = orders.findIndex(
    item => item.reference === req.params.reference
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Order not found."
    });
  }

  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready for Pickup",
    "Out for Delivery",
    "Completed",
    "Cancelled"
  ];

  if (
    req.body.status &&
    !allowedStatuses.includes(req.body.status)
  ) {
    return res.status(400).json({
      message: "Invalid order status."
    });
  }

  orders[index] = {
    ...orders[index],
    ...req.body,
    reference: orders[index].reference
  };

  writeData(ordersFile, orders);

  res.json(orders[index]);
});


// ============================================
// QUOTES API
// ============================================

// Create quote request
app.post("/api/quotes", (req, res) => {
  const quotes = readData(quotesFile);

  const quote = {
    id: Date.now().toString(),
    customer: req.body.customer || {},
    message: req.body.message || "",
    items: req.body.items || [],
    createdAt: new Date().toISOString(),
    status: "Pending"
  };

  quotes.push(quote);
  writeData(quotesFile, quotes);

  res.status(201).json(quote);
});


// Get all quote requests
app.get("/api/quotes", (req, res) => {
  const quotes = readData(quotesFile);
  res.json(quotes);
});


// ============================================
// BUSINESS INFORMATION
// ============================================

app.get("/api/business", (req, res) => {
  res.json({
    name: "Favourite Florish Wood & Building Materials",
    location: "Mammy Market, Sapele Road, Warri, Delta State",
    phone: "09127495530",
    whatsapp: "+2347037671791",
    openingHours: "Monday–Saturday, 7:00 AM–6:30 PM"
  });
});


// ============================================
// API 404 HANDLER
// ============================================

app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API route not found."
  });
});


// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(
    `Favourite Florish server is running on port ${PORT}`
  );
});
