"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import OrderModal from "@/components/OrderModal";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((state) => state.items) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 СТРОГАЯ ЗАЩИТА СУММЫ: Принудительно превращаем цену и количество в числа через Number().
  // Если там пустая строка или undefined, подставляем 0 и 1, чтобы математика не выдавала NaN.
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = Number(item?.product?.price) || 0;
    const itemQuantity = Number(item?.quantity) || 1;
    return sum + itemPrice * itemQuantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="w-full lg:w-1/2 mx-auto px-6 py-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-black mb-4 inline-block"
        >
          ← Назад к меню
        </Link>
        <h2 className="text-xl font-semibold mb-4">Корзина</h2>
        <p className="text-zinc-500">Корзина пуста</p>
      </main>
    );
  }

  return (
    <main className="w-full lg:w-1/2 mx-auto px-6 py-8">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-black mb-4 inline-block"
      >
        ← Назад к меню
      </Link>
      <h2 className="text-xl font-semibold mb-6">Корзина</h2>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          // Вытаскиваем и страхуем цену и количество для каждой конкретной строчки товара
          const singlePrice = Number(item?.product?.price) || 0;
          const singleQuantity = Number(item?.quantity) || 1;
          const itemRowTotal = singlePrice * singleQuantity;

          return (
            <div
              key={`${item?.product?.id || index}-${index}`}
              className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-xs"
            >
              <div>
                <p className="font-medium text-zinc-800">
                  {item?.product?.name || "Товар"}
                </p>
                <p className="text-sm text-zinc-500">
                  {singlePrice} ₽ × {singleQuantity}
                </p>
              </div>
              <p className="font-semibold text-zinc-900">{itemRowTotal} ₽</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-200">
        <span className="text-lg font-semibold text-zinc-700">Итого:</span>
        <span className="text-lg font-bold text-zinc-900">{totalPrice} ₽</span>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 mt-4 cursor-pointer font-medium transition-colors"
      >
        Оформить заказ
      </button>

      <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
