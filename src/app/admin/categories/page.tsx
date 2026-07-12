"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Category } from "@/types";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    getCategories().then(setCategories);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await createCategory(newName);
      toast.success("Категория добавлена");
      setNewName("");
      loadCategories();
    } catch (error) {
      toast.error("Не удалось добавить категорию");
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      toast.success("Категория удалена");
      loadCategories();
    } catch (error) {
      toast.error("Не удалось удалить категорию");
      console.error(error);
    }
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return;

    try {
      await updateCategory(id, editingName);
      toast.success("Категория обновлена");
      setEditingId(null);
      loadCategories();
    } catch (error) {
      toast.error("Не удалось обновить категорию");
      console.error(error);
    }
  }

  return (
    /* 
      ИСПРАВЛЕНО: 
      w-full — 100% на телефонах
      md:w-1/2 — ровно 50% ширины на больших экранах ПК
      mx-auto — идеальное выравнивание по центру
    */
    <div className="w-full md:w-9/10 mx-auto border border-zinc-200 p-6 rounded-2xl bg-white shadow-xs">
      <h2 className="text-xl font-bold text-zinc-800 mb-4">Категории</h2>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Название новой категории"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border border-zinc-300 rounded-xl px-4 py-2 flex-1 focus:outline-hidden focus:border-zinc-800"
        />
        <button
          type="submit"
          className="bg-zinc-900 text-white px-5 py-2 font-medium rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors"
        >
          Добавить
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between border border-zinc-100 rounded-xl p-4 bg-zinc-50/50"
          >
            {editingId === category.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="border border-zinc-300 rounded-lg px-3 py-1 flex-1 mr-3 bg-white"
              />
            ) : (
              <span className="font-medium text-zinc-700">{category.name}</span>
            )}

            {/* ИСПРАВЛЕНО: gap-4 и shrink-0 изолируют кнопки Изменить/Удалить от текста */}
            <div className="flex items-center gap-4 ml-4 shrink-0">
              {editingId === category.id ? (
                <button
                  onClick={() => handleUpdate(category.id)}
                  className="text-emerald-600 font-bold cursor-pointer text-sm hover:underline"
                >
                  Сохранить
                </button>
              ) : (
                <button
                  onClick={() => startEditing(category)}
                  className="text-blue-600 font-bold cursor-pointer text-sm hover:underline"
                >
                  Изменить
                </button>
              )}
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 font-bold cursor-pointer text-sm hover:underline"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
