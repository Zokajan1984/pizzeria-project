"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Category, Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Состояния для формы создания НОВОГО товара
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // Состояния для РЕДАКТИРОВАНИЯ существующего товара
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingCategory, setEditingCategory] = useState("");
  const [editingImage, setEditingImage] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // Базовые сетевые функции загрузки данных напрямую с твоего json-server
  async function loadCategories() {
    try {
      const res = await fetch("http://localhost:3001/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data || []);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  // Перевод строки товара в режим полноценного редактирования
  function startEditing(product: Product) {
    setEditingId(product.id);
    setEditingName(product.name);
    setEditingPrice(String(product.price));
    setEditingCategory(product.category);
    setEditingImage(product.image);
    setEditingDescription(product.description || "");
  }

  // СОХРАНЕНИЕ ИЗМЕНЕНИЙ НА СЕРВЕРЕ (ОТПРАВКА ОБНОВЛЕННОГО ТОВАРА)
  async function handleUpdate(id: string) {
    if (
      !editingName.trim() ||
      !editingPrice ||
      !editingCategory ||
      !editingImage.trim()
    ) {
      toast.error("Пожалуйста, заполните все обязательные поля!");
      return;
    }

    try {
      const updatedData = {
        name: editingName,
        price: Number(editingPrice),
        category: editingCategory,
        image: editingImage,
        description: editingDescription.trim() || undefined,
      };

      // Делаем прямой PATCH-запрос к json-server бэкенду для изменения строки
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        toast.success("Товар успешно обновлен");
        setEditingId(null); // Закрываем форму редактирования
        loadProducts(); // Обновляем список на экране
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Не удалось обновить товар");
      console.error(error);
    }
  }

  // ДОБАВЛЕНИЕ НОВОГО ТОВАРА
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price || !categoryName || !image.trim()) {
      toast.error("Пожалуйста, заполните все обязательные поля!");
      return;
    }

    try {
      const newProduct = {
        id: crypto.randomUUID(), // Генерируем уникальный строковый ID
        name,
        price: Number(price),
        category: categoryName,
        image,
        description: description.trim() || undefined,
      };

      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        toast.success("Товар успешно добавлен");
        setName("");
        setPrice("");
        setImage("");
        setDescription("");
        loadProducts();
      }
    } catch (error) {
      toast.error("Не удалось добавить товар");
      console.error(error);
    }
  }

  // УДАЛЕНИЕ ТОВАРА
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Товар удален");
        loadProducts();
      }
    } catch (error) {
      toast.error("Не удалось удалить товар");
      console.error(error);
    }
  }

  return (
    <div className="w-full md:w-[70%] mx-auto border border-zinc-200 p-6 rounded-2xl bg-white shadow-xs">
      <h2 className="text-xl font-bold text-zinc-800 mb-6">
        Управление товарами
      </h2>

      {/* Форма создания */}
      <form
        onSubmit={handleCreate}
        className="space-y-4 mb-8 bg-zinc-50/50 p-5 border border-zinc-100 rounded-2xl"
      >
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
          Новый товар
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Название пиццы или блюда"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm bg-white"
          />
          <input
            type="number"
            placeholder="Цена (руб.)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm bg-white"
          />
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm bg-white"
          >
            <option value="">-- Выберите категорию --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="URL-ссылка на изображение"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm bg-white"
          />
        </div>

        <textarea
          placeholder="Описание ингредиентов пиццы..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm resize-none bg-white"
        />

        <button
          type="submit"
          className="w-full bg-zinc-900 text-white font-medium py-2.5 rounded-xl text-sm cursor-pointer hover:bg-zinc-800 transition-colors"
        >
          Добавить товар в меню
        </button>
      </form>

      {/* Список товаров с формой редактирования */}
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
        Текущее меню пиццерии
      </h3>

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col border border-zinc-100 rounded-xl p-4 bg-zinc-50/30 gap-3"
          >
            {editingId === product.id ? (
              /* РЕЖИМ РЕДАКТИРОВАНИЯ СТРОКИ */
              <div className="space-y-3 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                    placeholder="Название"
                  />
                  <input
                    type="number"
                    value={editingPrice}
                    onChange={(e) => setEditingPrice(e.target.value)}
                    className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                    placeholder="Цена"
                  />
                  <select
                    value={editingCategory}
                    onChange={(e) => setEditingCategory(e.target.value)}
                    className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editingImage}
                    onChange={(e) => setEditingImage(e.target.value)}
                    className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                    placeholder="URL картинки"
                  />
                </div>
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  rows={2}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-1.5 text-sm resize-none bg-white"
                  placeholder="Описание"
                />
              </div>
            ) : (
              /* ОБЫЧНЫЙ РЕЖИМ ОТОБРАЖЕНИЯ */
              <div className="flex flex-col">
                <span className="font-bold text-zinc-800 text-base">
                  {product.name}
                </span>
                <span className="text-xs text-zinc-400 mt-0.5">
                  Категория: {product.category} | {product.price} ₽
                </span>
                {product.description && (
                  <p className="text-xs text-zinc-500 mt-1 italic">
                    {product.description}
                  </p>
                )}
              </div>
            )}

            {/* КНОПКИ ДЕЙСТВИЙ */}
            <div className="flex items-center gap-4">
              {editingId === product.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(product.id)}
                    className="text-green-600 font-bold cursor-pointer text-sm hover:underline"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-zinc-400 font-medium cursor-pointer text-sm hover:underline"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing(product)}
                  className="text-blue-600 font-bold cursor-pointer text-sm hover:underline"
                >
                  Изменить
                </button>
              )}
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 font-bold cursor-pointer text-sm hover:underline shrink-0"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-sm text-zinc-400 text-center py-4">
            В меню пока нет ни одного товара.
          </p>
        )}
      </div>
    </div>
  );
}
