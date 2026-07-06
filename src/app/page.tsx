"use client";

import { useEffect, useState } from "react";
import { getCategories, getProducts } from "@/lib/api";
import { Category, Product } from "@/types";
import CategoryFilter from "@/components/CategoryFilter";
import ProductList from "@/components/ProductList";

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
      <ProductList products={filteredProducts} />
    </main>
  );
}
