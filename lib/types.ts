export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  producerId: string; // ID del agricultor dueño de la oferta
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Post {
  id: string;
  date: string;
  content: string;
  image?: string;
  likes: number;
}

export interface Producer {
  id: string;
  name: string;
  district: string;
  level: string;
  emoji: string;
  rating: number;
  reviewsCount: number;
  senasaCertified: boolean;
  description: string;
  image: string;
  bannerImage: string;
  joinedDate: string;
  cajasVendidas: number;
  chacraName: string;
  soilType: string;
  irrigationSystem: string;
  treeAge: string;
  gallery: string[];
  posts: Post[];
}

export const producerNames: { [key: string]: string } = {
  "motupe-felipe": "Don Felipe Flores",
  "olmos-coop": "Cooperativa Olmos",
  "jayanca-organico": "Finca Jayanca",
  "illimo-cosmetica": "Taller Íllimo"
};