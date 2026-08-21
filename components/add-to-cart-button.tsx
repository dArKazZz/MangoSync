"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductCartProps {
  product: Product;
  className?: string;
}

/**
 * Component for the "Agregar al carrito" button.
 */
export default function AddToCartButton({ product, className }: ProductCartProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Button onClick={handleAddToCart} className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 py-5 ${className}`}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      Agregar al carrito
    </Button>
  );
}
