"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

import { getAllCategories, getAllProducts } from "@/lib/data";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterSidebar from "@/components/filter-sidebar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    Promise.all([getAllProducts(), getAllCategories()])
      .then(([productsData, categoriesData]) => {
        setAllProducts(productsData);
        setCategories(categoriesData);

        if (productsData.length > 0) {
          const prices = productsData.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setMinPrice(min);
          setMaxPrice(max);
          setPriceRange([min, max]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al buscar datos:", err);
        setLoading(false);
      });
  }, []);

  // Update query state if search params change
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Apply filters
  useEffect(() => {
    if (allProducts.length === 0) return;

    let results = [...allProducts];

    if (searchQuery) {
      results = results.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply Category Filter
    if (selectedCategories.length > 0) {
      results = results.filter((product) => {
        return selectedCategories.includes(product.category);
      });
    }

    // Apply price range filter
    results = results.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(results);
  }, [searchQuery, priceRange, selectedCategories, allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setSearchQuery("");
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <>
      <Navbar />
      <div className="py-8 min-h-screen bg-slate-50/50">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-6">
            
            {/* Mobile Filter Button */}
            <div className="flex md:hidden justify-between items-center mb-4">
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Buscar Productos</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="py-4">
                    {!loading && (
                      <FilterSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        priceRange={priceRange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onCategoryChange={handleCategoryChange}
                        onPriceChange={handlePriceChange}
                        onClearFilters={clearAllFilters}
                      />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-1/4 min-w-[250px]">
              {!loading && (
                <FilterSidebar
                  categories={categories}
                  selectedCategories={selectedCategories}
                  priceRange={priceRange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onCategoryChange={handleCategoryChange}
                  onPriceChange={handlePriceChange}
                  onClearFilters={clearAllFilters}
                />
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="md:hidden">
                <form onSubmit={handleSearch} className="flex w-full mb-6">
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="w-full rounded-xl bg-white border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              <div className="hidden md:block mb-6">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Buscar Productos</h1>
                <form onSubmit={handleSearch} className="flex w-full">
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="w-full rounded-xl bg-white border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6">
                    <SearchIcon className="h-4 w-4 mr-2" /> Buscar
                  </Button>
                </form>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-4 text-sm font-semibold text-slate-400">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
                  </div>

                  {/* Results */}
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs">
                      <h2 className="text-xl font-bold text-slate-700">No se encontraron productos</h2>
                      <p className="text-slate-400 mt-2">
                        Intenta ajustar tu búsqueda o los criterios de filtrado.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6 rounded-xl text-slate-500 border-slate-200"
                        onClick={clearAllFilters}
                      >
                        Limpiar todos los filtros
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function Search() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
