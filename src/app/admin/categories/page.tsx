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
    <div>
      <h2 className="text-xl font-semibold mb-4">Категории</h2>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Название новой категории"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2
                     rounded-lg cursor-pointer"
        >
          Добавить
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between
                       border rounded-lg p-3"
          >
            {editingId === category.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="border rounded-lg px-2 py-1 flex-1
                           mr-2"
              />
            ) : (
              <span>{category.name}</span>
            )}

            <div className="flex gap-2">
              {editingId === category.id ? (
                <button
                  onClick={() => handleUpdate(category.id)}
                  className="text-green-600 cursor-pointer
                             text-sm"
                >
                  Сохранить
                </button>
              ) : (
                <button
                  onClick={() => startEditing(category)}
                  className="text-blue-600 cursor-pointer
                             text-sm"
                >
                  Изменить
                </button>
              )}
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 cursor-pointer text-sm"
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
