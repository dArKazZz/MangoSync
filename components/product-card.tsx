"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard component displays the product's image, name, category, price,
 * and an "Agregar al carrito" button. It links to the product's detailed page.
 *
 * @param {ProductCardProps} props - Props containing the product details.
 * @returns {JSX.Element} The rendered ProductCard component.
 */
function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden py-0 gap-0 group hover:shadow-md transition-shadow duration-300">
      {/* Enlace a la página de detalles del producto */}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="px-4">
        {/* Nombre del producto */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold mt-2 text-slate-800 text-base hover:text-amber-600 transition-colors leading-tight">{product.name}</h3>
        </Link>
        {/* Categoría */}
        <p className="text-xs text-slate-400 mt-1">{product.category}</p>
        {/* Precio */}
        <p className="font-bold text-lg mt-2 text-slate-900">S/. {product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4">
        {/* Botón para añadir al carrito */}
        <Button
          onClick={() => addToCart(product)}
          className="w-full border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 hover:border-emerald-200 rounded-xl"
          variant="outline"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
