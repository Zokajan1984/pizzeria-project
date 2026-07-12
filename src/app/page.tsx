"use client";

import React, { useEffect, useState } from "react";
import { Category, Product } from "@/types";
import PizzaCard from "@/components/PizzaCard";
import { useCartStore } from "@/store/cartStore";
import localDb from "../../db.json";

export default function ProductsCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (
    product: Product,
    option: string,
    size: string,
    finalPrice: number,
  ) => {
    const safePrice =
      Number(finalPrice) && !isNaN(Number(finalPrice))
        ? Number(finalPrice)
        : Number(product.price || 0);

    const customizedProduct: Product = {
      ...product,
      id: `${product.id}-${option.replace(/\s+/g, "")}-${size.replace(/\s+/g, "")}`,
      name: `${product.name} (${option}, ${size})`,
      price: safePrice,
    };

    if (addItem) {
      addItem(customizedProduct);
    }
  };

  useEffect(() => {
    try {
      if (localDb) {
        setCategories((localDb.categories || []) as Category[]);
        setProducts((localDb.products || []) as Product[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scrollToMenu = () => {
    const menuElement = document.getElementById("catalog-menu");
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-zinc-400 font-medium animate-pulse">
          Загрузка сочной пиццы...
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
    <div className="w-full bg-zinc-50/50 min-h-screen pb-16">
      <div className="w-full bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100/50 py-12 md:py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-6 text-center md:text-left">
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              🍕 Самая быстрая доставка в городе
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 leading-tight">
              Горячая пицца <br />
              <span className="text-orange-500">за 30 минут</span>
            </h1>
            <p className="text-zinc-500 text-sm md:text-base max-w-md mx-auto md:mx-0">
              Если мы не успеем привезти заказ вовремя — вы получите промокод на
              бесплатную большую пиццу!
            </p>
            <button
              onClick={scrollToMenu}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 cursor-pointer transition-all hover:-translate-y-0.5 inline-block text-sm"
            >
              Выбрать пиццу 👇
            </button>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border-4 border-orange-200/60 shadow-2xl bg-white">
              <img
                src="/pizza.file.jpg"
                alt="Горячая пицца"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h3 className="text-lg font-black text-zinc-800 mb-4 uppercase tracking-wider">
          Выгодные предложения
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-orange-600 p-5 rounded-2xl text-white flex flex-col justify-between h-36 shadow-xs relative overflow-hidden group">
            <div className="z-10">
              <h4 className="font-extrabold text-lg">Комбо для компании</h4>
              <p className="text-xs text-orange-100 mt-1 max-w-[200px]">
                3 средние пиццы со скидкой 20%
              </p>
            </div>
            <span className="z-10 font-black text-xl">990 ₽</span>
            <div className="absolute right-[-20px] bottom-[-20px] text-7xl opacity-15 font-black select-none pointer-events-none group-hover:scale-110 transition-transform">
              🍕
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 p-5 rounded-2xl text-white flex flex-col justify-between h-36 shadow-xs relative overflow-hidden group">
            <div className="z-10">
              <h4 className="font-extrabold text-lg">Обед на двоих</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
                Пицца 30см + 2 колы со скидкой
              </p>
            </div>
            <span className="z-10 font-black text-xl">550 ₽</span>
            <div className="absolute right-[-10px] bottom-[-10px] text-7xl opacity-15 font-black select-none pointer-events-none group-hover:scale-110 transition-transform">
              🥤
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-5 rounded-2xl text-white flex flex-col justify-between h-36 shadow-xs relative overflow-hidden group sm:col-span-2 md:col-span-1">
            <div className="z-10">
              <h4 className="font-extrabold text-lg">Сладкий хит</h4>
              <p className="text-xs text-amber-100 mt-1 max-w-[200px]">
                При покупке десерта — чай в подарок!
              </p>
            </div>
            <span className="z-10 font-black text-xl">Бесплатно</span>
            <div className="absolute right-[-10px] bottom-[-10px] text-7xl opacity-20 font-black select-none pointer-events-none group-hover:scale-110 transition-transform">
              🍰
            </div>
          </div>
        </div>
      </div>

      <div
        id="catalog-menu"
        className="max-w-7xl mx-auto px-4 space-y-8 scroll-mt-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-200/60 no-scrollbar">
          <button
            onClick={() => setActiveCategoryId("")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategoryId === ""
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
            }`}
          >
            Все меню
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategoryId(String(category.id))}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                String(activeCategoryId) === String(category.id)
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

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
    </div>
  );
}
