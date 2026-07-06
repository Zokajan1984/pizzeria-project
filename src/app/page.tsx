"use client";

import { useEffect, useState } from "react";
import { getCategories, getProducts } from "@/lib/api";
import { Category, Product } from "@/types";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
    getProducts().then(setProducts);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category == selectedCategory)
    : products;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full">
      <h2 className="text-xl font-semibold mb-6">Меню</h2>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <pre className="bg-zinc-100 p-4 rounded text-xs overflow-auto">
        {JSON.stringify(filteredProducts, null, 2)}
      </pre>
    </main>
  );
}
