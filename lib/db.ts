import fs from "fs";
import path from "path";
import { Product, Category, Producer } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "products.json");

export const defaultProducers: Producer[] = [
  {
    id: "motupe-felipe",
    name: "Don Felipe Flores",
    district: "Motupe",
    level: "Avanzado",
    emoji: "🌳",
    rating: 4.8,
    reviewsCount: 15,
    senasaCertified: true,
    description: "Agricultor tradicional y líder comunal en Motupe. Dedicado al cultivo de mangos Kent orgánicos premium para exportación con altos estándares de calidad.",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=300",
    bannerImage: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=1200",
    joinedDate: "Marzo 2024",
    cajasVendidas: 1250,
    chacraName: "Finca San José",
    soilType: "Franco-arenoso rico en minerales",
    irrigationSystem: "Riego por goteo tecnificado",
    treeAge: "12 años promedio",
    gallery: [
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4ff1?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400"
    ],
    posts: [
      {
        id: "post-f1",
        date: "Hoy",
        content: "¡Excelente día en Finca San José! Iniciamos la cosecha del lote A de mango Kent. La fruta está dulce, jugosa y en su punto óptimo de maduración.",
        likes: 12
      },
      {
        id: "post-f2",
        date: "Hace 4 días",
        content: "SENASA auditó hoy nuestras instalaciones en Motupe. Obtuvimos calificación perfecta para nuestra certificación fitosanitaria de exportación. ¡Seguimos avanzando!",
        likes: 24
      }
    ]
  },
  {
    id: "olmos-coop",
    name: "Cooperativa Agrícola Valle de Olmos",
    district: "Olmos",
    level: "Élite",
    emoji: "👑",
    rating: 4.9,
    reviewsCount: 38,
    senasaCertified: true,
    description: "Cooperativa de 45 pequeños agricultores en Olmos. Sumamos esfuerzos y tecnología de punta para ofrecer la mejor producción de mango Kent en volumen y calidad fitosanitaria.",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=300",
    bannerImage: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1200",
    joinedDate: "Enero 2023",
    cajasVendidas: 3400,
    chacraName: "Predios Agrícolas Olmos Sector Norte",
    soilType: "Arcilloso-arenoso de alta retención de humedad",
    irrigationSystem: "Pivote central de alta eficiencia",
    treeAge: "8 años promedio",
    gallery: [
      "https://images.unsplash.com/photo-1605000797439-7571d3cc4a21?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400"
    ],
    posts: [
      {
        id: "post-o1",
        date: "Ayer",
        content: "Despachamos un lote de 800 cajas de Mango Kent bajo el Incoterm FOB-Planta. Gracias a nuestro sistema de trazabilidad y certificación fitosanitaria SENASA todo fluyó sin contratiempos.",
        likes: 18
      },
      {
        id: "post-o2",
        date: "Hace 1 semana",
        content: "Realizamos una jornada de capacitación técnica para todos los socios de la cooperativa en control biológico de trips. ¡Menos químicos, mejor mango!",
        likes: 15
      }
    ]
  },
  {
    id: "jayanca-organico",
    name: "Finca Ecológica Jayanca (Don Alberto Ramos)",
    district: "Jayanca",
    level: "Productor",
    emoji: "🌿",
    rating: 4.6,
    reviewsCount: 8,
    senasaCertified: false,
    description: "Finca dedicada al cultivo ecológico de mangos Kent y la elaboración artesanal de subproductos gourmet de alta gama como deshidratados y salsas agridulces.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=300",
    bannerImage: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=1200",
    joinedDate: "Septiembre 2024",
    cajasVendidas: 720,
    chacraName: "Chacra Tierra Verde",
    soilType: "Orgánico rico en humus",
    irrigationSystem: "Riego tradicional por gravedad controlado",
    treeAge: "15 años",
    gallery: [
      "https://images.unsplash.com/photo-1596003903067-bf5762ad5c17?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400"
    ],
    posts: [
      {
        id: "post-j1",
        date: "Hace 3 días",
        content: "Terminamos el lote semanal de tiras deshidratadas de mango Kent. Proceso 100% natural, sin azúcares añadidas ni conservantes. ¡Ideales para snacks!",
        likes: 9
      }
    ]
  },
  {
    id: "illimo-cosmetica",
    name: "Taller Familiar de Íllimo (Doña Elena Ruiz)",
    district: "Íllimo",
    level: "Semilla",
    emoji: "🥭",
    rating: 4.5,
    reviewsCount: 5,
    senasaCertified: false,
    description: "Pequeño emprendimiento de cosmética natural. Utilizamos la manteca pura de la semilla del mango Kent de nuestras cosechas familiares para elaborar cremas e hidratantes ecológicos.",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300",
    bannerImage: "https://images.unsplash.com/photo-1607006342446-24f4e75d0f19?auto=format&fit=crop&q=80&w=1200",
    joinedDate: "Diciembre 2024",
    cajasVendidas: 310,
    chacraName: "Huerta El Manantial",
    soilType: "Franco-arcilloso fértil",
    irrigationSystem: "Riego artesanal manual",
    treeAge: "6 años",
    gallery: [
      "https://images.unsplash.com/photo-1607006342446-24f4e75d0f19?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400"
    ],
    posts: [
      {
        id: "post-il1",
        date: "Hace 2 semanas",
        content: "Presentamos nuestra nueva tanda de jabones orgánicos enriquecidos con extracto de mango Kent y miel silvestre de Íllimo. ¡Huelen riquísimo y cuidan tu piel!",
        likes: 11
      }
    ]
  }
];

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
  // --- OFERTA DE DON FELIPE FLORES ---
  {
    id: "1",
    name: "Caja de Mango Kent Premium",
    description: "Una caja con 12 mangos Kent orgánicos dulces, cremosos y sin fibra. Perfectos para comer frescos o licuar.",
    price: 99.90,
    image: "/images/product_kent_box.jpg",
    category: "Fruta Fresca",
    producerId: "motupe-felipe"
  },
  {
    id: "2-motupe",
    name: "Mangos Kent de Exportación (1 Kg)",
    description: "Mangos Kent cosechados en Motupe, seleccionados por su tamaño y sabor dulce. Ideales para exportación y consumo directo.",
    price: 15.50,
    image: "/images/product_kent_single.jpg",
    category: "Fruta Fresca",
    producerId: "motupe-felipe"
  },
  {
    id: "5",
    name: "Mermelada de Mango Kent Artesanal",
    description: "Mermelada de mango Kent cocida a fuego lento por agricultores locales en Motupe, elaborada con pulpa de fruta fresca y un toque de limón.",
    price: 19.90,
    image: "/images/product_mango_jam.png",
    category: "Mermeladas y Salsas",
    producerId: "motupe-felipe"
  },

  // --- OFERTA DE COOPERATIVA AGRÍCOLA VALLE DE OLMOS ---
  {
    id: "1-olmos",
    name: "Caja de Mango Kent Premium",
    description: "Caja de mangos Kent seleccionados por la Cooperativa Olmos. Mangos carnosos, dulces y con gran calibre fitosanitario.",
    price: 94.50,
    image: "/images/product_kent_box.jpg",
    category: "Fruta Fresca",
    producerId: "olmos-coop"
  },
  {
    id: "2",
    name: "Mangos Kent de Exportación (1 Kg)",
    description: "Mangos Kent seleccionados por su tamaño y sabor dulce con un toque refrescante, cosechados por la Cooperativa Olmos.",
    price: 14.90,
    image: "/images/product_kent_single.jpg",
    category: "Fruta Fresca",
    producerId: "olmos-coop"
  },
  {
    id: "3",
    name: "Néctar de Mango Kent Puro (1 Litro)",
    description: "Jugo 100% natural de mangos Kent maduros provistos por la Cooperativa Olmos, sin conservantes ni azúcar añadida.",
    price: 18.50,
    image: "/images/product_mango_nectar.png",
    category: "Bebidas",
    producerId: "olmos-coop"
  },
  {
    id: "4-olmos",
    name: "Tiras de Mango Kent Deshidratado",
    description: "Rodajas masticables y dulces de mango Kent. Deshidratadas a temperatura controlada en Olmos, ricas en fibra.",
    price: 22.90,
    image: "/images/product_dried_mango.png",
    category: "Snacks Deshidratados",
    producerId: "olmos-coop"
  },

  // --- OFERTA DE FINCA ECOLÓGICA JAYANCA ---
  {
    id: "4",
    name: "Tiras de Mango Kent Deshidratado",
    description: "Rebanadas masticables y naturalmente dulces de mango Kent, sin azufre añadido ni sabores artificiales, producidas en Jayanca.",
    price: 24.90,
    image: "/images/product_dried_mango.png",
    category: "Snacks Deshidratados",
    producerId: "jayanca-organico"
  },
  {
    id: "6",
    name: "Chutney de Mango Kent Picante",
    description: "Un condimento agridulce que combina mangos Kent frescos de Jayanca, jengibre, ajo, chile y especias tradicionales.",
    price: 22.90,
    image: "/images/product_mango_chutney.png",
    category: "Mermeladas y Salsas",
    producerId: "jayanca-organico"
  },
  {
    id: "7",
    name: "Chamoy de Mango Kent Picante",
    description: "Salsa tradicional dulce, ácida y picante elaborada con mango Kent ecológico de Jayanca y chiles. Ideal para botanas.",
    price: 26.90,
    image: "/images/product_mango_chamoy.png",
    category: "Bebidas",
    producerId: "jayanca-organico"
  },

  // --- OFERTA DE TALLER FAMILIAR DE ÍLLIMO ---
  {
    id: "8",
    name: "Crema Corporal de Mango Orgánica",
    description: "Crema profundamente hidratante elaborada con manteca de semilla de mango Kent prensada en frío, aceite de coco y karité en Íllimo.",
    price: 59.90,
    image: "/images/product_body_butter.png",
    category: "Cuidado Personal",
    producerId: "illimo-cosmetica"
  },
  {
    id: "9",
    name: "Jabón de Mango Kent y Miel Silvestre",
    description: "Barra de jabón exfoliante suave enriquecida con extracto de mango Kent y miel de abeja silvestre de la zona de Íllimo.",
    price: 15.00,
    image: "/images/product_mango_soap.png",
    category: "Cuidado Personal",
    producerId: "illimo-cosmetica"
  },
];

// In-memory fallbacks for serverless environments
let memoryProducts: Product[] = [...defaultProducts];
let memoryCategories: Category[] = [...defaultCategories];
let memoryProducers: Producer[] = [...defaultProducers];

export function readDb(): { products: Product[]; categories: Category[]; producers: Producer[] } {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed.products && parsed.categories && parsed.producers) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to read database file, using memory cache:", error);
  }

  return {
    products: memoryProducts,
    categories: memoryCategories,
    producers: memoryProducers,
  };
}

export function writeDb(data: { products: Product[]; categories: Category[]; producers: Producer[] }): void {
  // Update memory state
  memoryProducts = [...data.products];
  memoryCategories = [...data.categories];
  memoryProducers = [...data.producers];

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
