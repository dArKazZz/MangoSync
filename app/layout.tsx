import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";

export const metadata: Metadata = {
  title: "MangoSync - Mangos Orgánicos y Delicias Artesanales",
  description: "Explora y compra mangos orgánicos frescos y exquisitos subproductos de mango.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}