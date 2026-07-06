"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Product } from "@/types";

interface PizzaCardProps {
  product: Product;
}

const DOUGH_TYPES = ["тонкое", "традиционное"];
const SIZES = ["26 см", "30 см", "40 см"];

export default function PizzaCard({ product }: PizzaCardProps) {
  const [dough, setDough] = useState(DOUGH_TYPES[0]);
  const [size, setSize] = useState(SIZES[0]);
  return (
    <div className="border rounded-xl p-4 flex-col gap-3 bg-white">
      <div className="bg-zinc-100 h-36 rounded-full mx-auto w-36 flex items-center justify-center">
        🍕
      </div>

      <h3 className="font-semibold text-center">{product.name}</h3>
      <div className="flex text-xs bg-zinc-100 rounded-lg p-1">
        {DOUGH_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setDough(type)}
            className={`flex-1 py-1 rounded-md cursor-pointer transition-colors ${dough === type ? "bg-white shadow font-medium" : "text-zinc-500"}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex gap-1 text-xs">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`flex-1 rounded-lg border cursor-pointer mt-1 transition-colors ${size === s ? "border-orange-500 text-orange-500" : "border-zinc-200 text-zinc-500"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="font-semibold">от {product.price} ₽</span>
        <button className="flex items-center gap-1 border border-orange-500 text-orange-500 rounded-full px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-orange-50">
          <Plus size={14} />
          Добавить
        </button>
      </div>
    </div>
  );
}
