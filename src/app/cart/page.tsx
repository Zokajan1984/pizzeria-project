"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-8">
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
    <main className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-black mb-4 inline-block"
      >
        ← Назад к меню
      </Link>
      <h2 className="text-xl font-semibold mb-6">Корзина</h2>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between
                       border rounded-lg p-4"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-zinc-500">
                {item.product.price} ₽ × {item.quantity}
              </p>
            </div>
            <p className="font-semibold">
              {item.product.price * item.quantity} ₽
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <span className="text-lg font-semibold">Итого:</span>
        <span className="text-lg font-semibold">{totalPrice} ₽</span>
      </div>
    </main>
  );
}
