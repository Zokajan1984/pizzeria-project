"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/lib/api";
import { log } from "console";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createOrder({
        name,
        phone,
        address,
        items,
        totalPrice,
      });

      toast.success("Заказ успешно оформлен!");
      clearCart();
      onClose;
    } catch (error) {
      toast.error("Не удалось оформит заказ");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-gray-500/90 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 mx-auto border border-gray-400 rounded-2xl bg-white p-16"
      >
        <h3 className="text-lg font-semibold mb-4">Оформление заказа</h3>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Адрес доставки"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="border rounded-lg px-3 py-2"
        />

        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 border rounded-lg py-2 cursor-pointer"
            type="button"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 text-white
                         rounded-lg py-2 cursor-pointer
                         hover:bg-orange-600
                         disabled:opacity-50"
          >
            {isSubmitting ? "Отправка..." : "Заказать"}
          </button>
        </div>
      </form>
    </div>
  );
}
