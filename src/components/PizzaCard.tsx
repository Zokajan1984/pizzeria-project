"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";

interface PizzaCardProps {
  product: Product;
  onAddToCart: (
    product: Product,
    selectedOption: string,
    selectedSize: string,
    finalPrice: number,
  ) => void;
}

export default function PizzaCard({ product, onAddToCart }: PizzaCardProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);

  useEffect(() => {
    setSelectedOptionIndex(0);
    setSelectedSizeIndex(0);
  }, [product]);

  if (!product) return null;

  const cat = String(product.category || "")
    .trim()
    .toLowerCase();

  let optionsTitle = "Параметры";
  let sizesTitle = "Размер порции";
  let options = ["Стандарт"];
  let sizes = ["Обычная"];

  if (cat === "1" || cat === "пиццы") {
    optionsTitle = "Тип теста";
    sizesTitle = "Диаметр пиццы";
    options = ["Тонкое", "Традиционное"];
    sizes = ["26 см", "30 см", "40 см"];
  } else if (cat === "2" || cat === "напитки") {
    optionsTitle = "Газация";
    sizesTitle = "Объем напитка";
    options = ["С сахаром", "Без сахара"];
    sizes = ["200 мл", "300 мл", "400 мл"];
  } else if (cat === "3" || cat === "десерты") {
    optionsTitle = "Вкус крема";
    sizesTitle = "Вес порции";
    options = ["Сливочный", "Шоколадный"];
    sizes = ["100 гр", "150 гр", "200 гр"];
  } else if (cat === "мороженное") {
    optionsTitle = "Тип топпинга";
    sizesTitle = "Размер шарика";
    options = ["Ягодный", "Ореховый"];
    sizes = ["50 гр", "100 гр", "150 гр"];
  } else if (cat === "фрукты") {
    optionsTitle = "Способ подачи";
    sizesTitle = "Вес нарезки";
    options = ["Свежие", "В сиропе"];
    sizes = ["200 гр", "400 гр", "600 гр"];
  }

  // Накапливаем наценку в зависимости от индекса выбранного размера
  const basePrice = product.price || 0;
  let modifier = 0;
  if (selectedSizeIndex === 1) modifier = 50; // Средний размер (+50 рублей)
  if (selectedSizeIndex === 2) modifier = 150; // Максимальный размер (+150 рублей)

  const finalPrice = basePrice + modifier;

  const activeOptionText = options[selectedOptionIndex] || "Стандарт";
  const activeSizeText = sizes[selectedSizeIndex] || "Обычная";

  return (
    <div className="w-full border border-zinc-200 rounded-3xl p-5 bg-white flex flex-col justify-between h-full group">
      {/* ИЗОБРАЖЕНИЕ ТОВАРА */}
      <div className="w-full h-44 flex justify-center items-center overflow-hidden rounded-2xl bg-zinc-50 mb-4">
        <img
          src={product.image || "/pizza-placeholder.jpg"}
          alt={product.name}
          className="object-contain max-h-full max-w-full"
        />
      </div>

      {/* ОПИСАНИЕ И НАЗВАНИЕ */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-800 leading-tight mb-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-zinc-400 line-clamp-2 mb-4">
              {product.description}
            </p>
          )}
        </div>

        {/* НАСТРОЙКИ ПАРАМЕТРОВ */}
        <div className="space-y-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-100 mt-2">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
              {optionsTitle}
            </span>
            <div className="flex gap-1 bg-zinc-200/50 p-1 rounded-xl">
              {options.map((opt, index) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedOptionIndex(index)}
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedOptionIndex === index
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
              {sizesTitle}
            </span>
            <div className="flex gap-1 bg-zinc-200/50 p-1 rounded-xl">
              {sizes.map((sz, index) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSizeIndex(index)}
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedSizeIndex === index
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ КАРТОЧКИ */}
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-100">
        <span className="text-xl font-black text-zinc-900">{finalPrice} ₽</span>
        <button
          type="button"
          onClick={() =>
            onAddToCart(product, activeOptionText, activeSizeText, finalPrice)
          }
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
