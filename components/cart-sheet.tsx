import { ShoppingBag, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";

/**
 * Componente del Carrito Lateral (CartSheet).
 */
export default function CartSheet() {
  const { items, removeFromCart, clearCart } = useCart();

  const totalItems = items.length;
  const subtotal = items.reduce((total, item) => total + item.price, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Abrir carrito</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrito de Compras ({totalItems})</SheetTitle>
        </SheetHeader>

        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-medium">Tu carrito está vacío</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Agrega algunos productos de mango para verlos aquí.
              </p>
            </div>
            <Button asChild>
              <Link href="/products">Ver Productos</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-80px)] justify-between">
            <ScrollArea className="flex-1 pr-4 mt-4">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 border-b border-slate-100 pb-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-slate-800 text-sm leading-tight">{item.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">
                        S/. {item.price.toFixed(2)}
                      </p>
                    </div>
                    <Button onClick={() => removeFromCart(item.id)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Total y Acciones */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Subtotal</span>
                <span className="font-bold text-lg text-slate-900">S/. {subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400">
                Los costos de envío e impuestos se calculan al proceder al pago.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-xl">
                  <Link href="/checkout">Proceder al Pago</Link>
                </Button>
                <Button variant="outline" className="w-full text-slate-500 rounded-xl" onClick={() => clearCart()}>
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
