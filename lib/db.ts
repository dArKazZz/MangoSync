import fs from "fs";
import path from "path";
import { Product, Category } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "products.json");

const defaultCategories: Category[] = [
  {
    id: "fruta-fresca",
    name: "Fruta Fresca",
    slug: "fruta-fresca",
    image: "/images/product_kent_box.jpg",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    slug: "bebidas",
    image: "/images/cat_beverages.png",
  },
  {
    id: "mermeladas-y-salsas",
    name: "Mermeladas y Salsas",
    slug: "mermeladas-y-salsas",
    image: "/images/cat_gourmet_spreads.png",
  },
  {
    id: "snacks-deshidratados",
    name: "Snacks Deshidratados",
    slug: "snacks-deshidratados",
    image: "/images/cat_snacks_dried.png",
  },
  {
    id: "cuidado-personal",
    name: "Cuidado Personal",
    slug: "cuidado-personal",
    image: "/images/cat_beauty_wellness.png",
  },
];

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Caja de Mango Kent Premium",
    description: "Una caja con 12 mangos Kent orgánicos dulces, cremosos y sin fibra. Perfectos para comer frescos o licuar.",
    price: 99.90,
    image: "/images/product_kent_box.jpg",
    category: "Fruta Fresca",
  },
  {
    id: "2",
    name: "Mangos Kent de Exportación (1 Kg)",
    description: "Mangos Kent seleccionados por su tamaño y sabor dulce con un toque refrescante, listos para disfrutar por kilo.",
    price: 14.90,
    image: "/images/product_kent_single.jpg",
    category: "Fruta Fresca",
  },
  {
    id: "3",
    name: "Néctar de Mango Kent Puro (1 Litro)",
    description: "Jugo 100% natural de mangos Kent maduros, sin conservantes ni azúcar añadida.",
    price: 18.50,
    image: "/images/product_mango_nectar.png",
    category: "Bebidas",
  },
  {
    id: "4",
    name: "Tiras de Mango Kent Deshidratado",
    description: "Rebanadas masticables y naturalmente dulces de mango Kent, sin azufre añadido ni sabores artificiales.",
    price: 24.90,
    image: "/images/product_dried_mango.png",
    category: "Snacks Deshidratados",
  },
  {
    id: "5",
    name: "Mermelada de Mango Kent Artesanal",
    description: "Mermelada de mango Kent cocida a fuego lento, elaborada con pulpa de fruta fresca y un toque de limón.",
    price: 19.90,
    image: "/images/product_mango_jam.png",
    category: "Mermeladas y Salsas",
  },
  {
    id: "6",
    name: "Chutney de Mango Kent Picante",
    description: "Un condimento agridulce que combina mangos Kent frescos, jengibre, ajo, chile y especias tradicionales.",
    price: 22.90,
    image: "/images/product_mango_chutney.png",
    category: "Mermeladas y Salsas",
  },
  {
    id: "7",
    name: "Chamoy de Mango Kent Picante",
    description: "Salsa tradicional dulce, ácida y picante elaborada con mango Kent real y chiles. Ideal para botanas.",
    price: 26.90,
    image: "/images/product_mango_chamoy.png",
    category: "Bebidas",
  },
  {
    id: "8",
    name: "Crema Corporal de Mango Orgánica",
    description: "Crema profundamente hidratante elaborada con manteca de semilla de mango Kent prensada en frío, aceite de coco y karité.",
    price: 59.90,
    image: "/images/product_body_butter.png",
    category: "Cuidado Personal",
  },
  {
    id: "9",
    name: "Jabón de Mango Kent y Miel Silvestre",
    description: "Barra de jabón exfoliante suave enriquecida con extracto de mango Kent y miel de abeja silvestre.",
    price: 15.00,
    image: "/images/product_mango_soap.png",
    category: "Cuidado Personal",
  },
];

// In-memory fallbacks for serverless environments
let memoryProducts: Product[] = [...defaultProducts];
let memoryCategories: Category[] = [...defaultCategories];

export function readDb(): { products: Product[]; categories: Category[] } {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed.products && parsed.categories) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to read database file, using memory cache:", error);
  }

  return {
    products: memoryProducts,
    categories: memoryCategories,
  };
}

export function writeDb(data: { products: Product[]; categories: Category[] }): void {
  // Update memory state
  memoryProducts = [...data.products];
  memoryCategories = [...data.categories];

  // Try writing to disk (will work locally, fail gracefully on Vercel)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.warn("Failed to write to database file (read-only filesystem on Vercel):", error);
  }
}
