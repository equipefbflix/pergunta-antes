import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/types";

interface CategoryFilterProps {
  onFilterChange: (category: ProductCategory) => void;
  selectedCategory: ProductCategory;
}

export function CategoryFilter({ onFilterChange, selectedCategory }: CategoryFilterProps) {
  const categories: { label: string; value: ProductCategory }[] = [
    { label: "Todos", value: "all" },
    { label: "Proxy", value: "proxy" },
    { label: "Perfil", value: "perfil" },
    { label: "BM", value: "bm" },
  ];

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <h2 className="text-xl font-bold dark:text-white text-gray-800">Produtos</h2>
      <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((category) => (
          <Button
            key={category.value}
            onClick={() => onFilterChange(category.value)}
            variant={selectedCategory === category.value ? "default" : "secondary"}
            className={`px-4 py-1 text-sm font-medium rounded-full ${
              selectedCategory === category.value
                ? "bg-primary hover:bg-red-700 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
