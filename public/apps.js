// ============================================
// FAVOURITE FLORISH
// Main website JavaScript
// ============================================

const WHATSAPP_NUMBER = "2347037671791";

let products = [];
let cart = JSON.parse(localStorage.getItem("favourite_florish_cart") || "[]");

// Temporary catalogue.
// These products will later be replaced by the real database through /api/products.
const demoProducts = [
  {
    id: "timber-2x2",
    name: "Timber 2×2",
    category: "Timber & Wood",
    size: "2×2",
    description: "Quality timber suitable for a range of building and construction needs.",
    price: null,
    status: "available",
    featured: true
  },
  {
    id: "timber-2x3",
    name: "Timber 2×3",
    category: "Timber & Wood",
    size: "2×3",
    description: "Reliable timber for general construction and building projects.",
    price: null,
    status: "available"
  },
  {
    id: "timber-2x4",
    name: "Timber 2×4",
    category: "Timber & Wood",
    size: "2×4",
    description: "Strong timber option for structural and general building work.",
    price: null,
    status: "available",
    featured: true
  },
  {
    id: "timber-1x6",
    name: "Timber 1×6",
    category: "Timber & Wood",
    size: "1×6",
    description: "Timber size available for various building and finishing applications.",
    price: null,
    status: "available"
  },
  {
    id: "plywood",
    name: "Plywood",
    category: "Plywood",
    size: "Various sizes",
    description: "Plywood for construction, furniture, partitioning and general projects.",
    price: null,
    status: "available",
    featured: true
  },
  {
    id: "cement",
    name: "Cement",
    category: "Cement",
    size: "Various brands",
    description: "Cement for building, block making, plastering and construction projects.",
    price: null,
    status: "available",
    featured: true
  },
  {
    id: "roofing-materials",
    name: "Roofing Materials",
    category: "Roofing",
    size: "Various",
    description: "Roofing materials for new builds, repairs and renovation projects.",
    price: null,
    status: "available"
  },
  {
    id: "nails",
    name: "Building Nails",
    category: "Nails & Fasteners",
    size: "Various sizes",
    description: "Nails suitable for timber work and general construction.",
    price: null
