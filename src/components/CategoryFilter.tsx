"use client";

import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${selectedCategory === null ? "bg-black text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
      >
        Все
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${selectedCategory === category.id ? "bg-black text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
