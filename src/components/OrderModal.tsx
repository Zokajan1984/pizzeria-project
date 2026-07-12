"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  // 1. Достаем из твоего Zustand стора товары и функцию полной очистки корзины
  const items = useCartStore((state) => state.items) || [];
  const clearCart = useCartStore((state) => state.clearCart);

  // Локальные состояния для полей формы оформления заказа
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsLoading] = useState(false);

  // Если модалка закрыта, ничего не рендерим
  if (!isOpen) return null;

  // Считаем итоговую цену заказа
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + (Number(item?.product?.price) || 0) * (Number(item?.quantity) || 1),
    0,
  );

  // Хэндлер отправки формы заказа на сервер json-server
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Пожалуйста, заполните все поля доставки!");
      return;
    }

    setIsLoading(true);

    try {
      // Формируем объект заказа строго по структуре твоего типа OrderData
      const newOrder = {
        id: crypto.randomUUID(), // Создаем уникальный строковый ID заказа
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: items, // Передаем весь массив выбранных товаров из корзины
        totalPrice: totalPrice,
      };

      // Делаем POST-запрос напрямую в таблицу orders нашего db.json
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        toast.success("Заказ успешно оформлен! Наш менеджер свяжется с вами.");

        // Очищаем форму и корзину
        setName("");
        setPhone("");
        setAddress("");
        if (clearCart) clearCart();

        onClose(); // Закрываем модальное окно
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(
        "Не удалось отправить заказ. Проверьте соединение с сервером.",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    /* Внешний фон модального окна (Затемнение) */
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      {/* Контейнер формы */}
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-zinc-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Кнопка закрытия крестиком */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-black text-zinc-900 mb-2">
          Оформление доставки
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Введите ваши контактные данные для отправки горячей пиццы
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Ваше имя
            </label>
            <input
              type="text"
              placeholder="Например, Zokirjon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Номер телефона
            </label>
            <input
              type="text"
              placeholder="+998"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Адрес доставки
            </label>
            <textarea
              placeholder="Улица, дом, квартира..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none bg-white"
            />
          </div>

          {/* Информационная строка с ценой */}
          <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
            <span className="text-sm font-semibold text-zinc-600">
              Сумма к оплате:
            </span>
            <span className="text-lg font-black text-zinc-900">
              {totalPrice} ₽
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed animate-pulse"
                : "cursor-pointer"
            }`}
          >
            {isSubmitting ? "Отправка заказа..." : "Подтвердить заказ"}
          </button>
        </form>
      </div>
    </div>
  );
}
