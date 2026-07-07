"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function Header() {
  const items = useCartStore((state) => state.items);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b py-4 px-6 sticky top-0 bg-white z-10">
      <div
        className="max-w-6xl mx-auto flex items-center
                   justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍕</span>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">
              REACT PIZZA
            </h1>
            <p className="text-xs text-zinc-500">
              самая вкусная пицца во вселенной
            </p>
          </div>
        </div>
        <Link
          href="/cart"
          className="flex items-center gap-2 bg-orange-500
             hover:bg-orange-600 text-white rounded-full
             pl-4 pr-3 py-2 cursor-pointer"
        >
          <span className="font-semibold">{totalPrice} ₽</span>
          <span
            className="flex items-center gap-1 bg-white/20
               rounded-full px-2 py-1"
          >
            <ShoppingCart size={16} />
            {totalCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
