"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Category } from "@/lib/types";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

/**
 * El componente FilterSidebar muestra una lista de categorías y un filtro de rango de precios.
 */
function FilterSidebar({
  categories,
  selectedCategories,
  priceRange,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800">Filtros</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full text-slate-500 rounded-xl"
        >
          Limpiar Todos los Filtros
        </Button>
      </div>

      <Separator />

      <Accordion
        type="multiple"
        defaultValue={["categories", "price"]}
        className="w-full"
      >
        <AccordionItem value="categories">
          <AccordionTrigger className="font-bold text-slate-700">Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => onCategoryChange(category.name)}
                    className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 rounded-sm"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium text-slate-600 cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="font-bold text-slate-700">Rango de Precios</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={(value) =>
                  onPriceChange(value as [number, number])
                }
                className="mt-6"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="border border-slate-100 rounded-xl px-3 py-1.5 w-24 text-center font-bold text-slate-700 text-sm">
                  S/. {priceRange[0]}
                </div>
                <span className="text-slate-400 font-semibold text-sm">a</span>
                <div className="border border-slate-100 rounded-xl px-3 py-1.5 w-24 text-center font-bold text-slate-700 text-sm">
                  S/. {priceRange[1]}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default FilterSidebar;