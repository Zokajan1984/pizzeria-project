"use client";

import React, { useEffect, useState } from "react";
import { Category, Product } from "@/types";
import { getCategories, getProducts } from "@/lib/api";
import PizzaCard from "@/components/PizzaCard";
import { useCartStore } from "@/store/cartStore";

export default function ProductsCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  // Вытаскиваем правильную функцию addItem строго по твоему интерфейсу CartState
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (
    product: Product,
    option: string,
    size: string,
    finalPrice: number,
  ) => {
    // Безопасно переводим цену в число
    const safePrice =
      Number(finalPrice) && !isNaN(Number(finalPrice))
        ? Number(finalPrice)
        : Number(product.price || 0);

    // СОЗДАЕМ МОДИФИЦИРОВАННЫЙ ПРОДУКТ С УНИКАЛЬНЫМ ID ДЛЯ КОРЗИНЫ
    const customizedProduct: Product = {
      ...product,
      // Делаем уникальный ID из комбинации оригинального ID и выбранных опций
      id: `${product.id}-${option.replace(/\s+/g, "")}-${size.replace(/\s+/g, "")}`,
      // Перезаписываем имя, чтобы в корзине было четко видно параметры
      name: `${product.name} (${option}, ${size})`,
      price: safePrice,
    };

    console.log(
      "Добавляем продукт в Zustand корзину через addItem:",
      customizedProduct,
    );

    // Вызываем твою рабочую функцию из стора
    if (addItem) {
      addItem(customizedProduct);
    }
  };

  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([catData, prodData]) => {
        setCategories(catData || []);
        setProducts(prodData || []);
      })
      .catch((err) => console.error("Ошибка загрузки данных каталога:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-zinc-400 font-medium animate-pulse">
          Загрузка меню пиццерии...
        </span>
      </div>
    );
  }

  const activeCategory = categories.find(
    (c) => String(c.id) === String(activeCategoryId),
  );

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    if (!activeCategoryId || !activeCategory) return true;

    const productCat = String(product.category || "")
      .trim()
      .toLowerCase();
    const currentCatId = String(activeCategory.id || "")
      .trim()
      .toLowerCase();
    const currentCatName = String(activeCategory.name || "")
      .trim()
      .toLowerCase();

    return productCat === currentCatId || productCat === currentCatName;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* МЕНЮ КАТЕГОРИЙ */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-100 no-scrollbar">
        <button
          onClick={() => setActiveCategoryId("")}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategoryId === ""
              ? "bg-orange-500 text-white"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          Все меню
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategoryId(String(category.id))}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              String(activeCategoryId) === String(category.id)
                ? "bg-orange-500 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* СЕТКА ТОВАРОВ */}
      <div>
        <h2 className="text-2xl font-black text-zinc-900 mb-6">
          {activeCategory ? activeCategory.name : "Все блюда"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <PizzaCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-sm text-zinc-400 italic text-center py-12">
            В этой категории пока нет товаров.
          </p>
        )}
      </div>
    </div>
  );
}
