"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { OrderData } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  // Напрямую загружаем заказы из бэкенда json-server
  async function loadOrders() {
    try {
      const res = await fetch("http://localhost:3001/orders");
      const data = await res.json();
      // Разворачиваем в массив (заказы из базы приходят с id, поэтому расширим тип для отображения)
      setOrders(data || []);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
      toast.error("Не удалось загрузить список заказов");
    } finally {
      setIsLoading(false);
    }
  }

  // Функция удаления (выполнения) заказа, чтобы убирать его из списка
  async function handleDeleteOrder(id: string) {
    try {
      const res = await fetch(`http://localhost:3001/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Заказ успешно выполнен и удален");
        loadOrders();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Не удалось удалить заказ");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-zinc-400 font-medium animate-pulse">
          Загрузка списка заказов...
        </span>
      </div>
    );
  }

  return (
    /* 
      w-full — занимает 100% на телефонах
      md:w-[70%] — занимает ровно 70% ширины на ПК
      mx-auto — центрирует весь блок по центру панели
    */
    <div className="w-full md:w-[70%] mx-auto border border-zinc-200 p-6 rounded-2xl bg-white shadow-xs">
      <h2 className="text-xl font-bold text-zinc-800 mb-6">
        Управление заказами доставки
      </h2>

      <div className="flex flex-col gap-4">
        {orders.map((order: any, index) => (
          <div
            key={order.id || index}
            className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50/30 flex flex-col md:flex-row justify-between gap-6"
          >
            {/* ЛЕВАЯ СТОРОНА: ДАННЫЕ КЛИЕНТА И СОСТАВ ЗАКАЗА */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-zinc-900 text-white text-xs font-mono px-2.5 py-1 rounded-md">
                  ЗАКАЗ #
                  {String(order.id || index)
                    .substring(0, 5)
                    .toUpperCase()}
                </span>
                <span className="text-sm font-bold text-zinc-800">
                  {order.name}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {order.phone}
                </span>
              </div>

              <div className="text-sm text-zinc-600 bg-white p-3 border border-zinc-100 rounded-xl">
                <span className="font-bold text-zinc-400 uppercase text-[10px] block mb-1">
                  Адрес доставки:
                </span>
                {order.address}
              </div>

              {/* СПИСОК КУПЛЕННЫХ ТОВАРОВ (БЛЮД) */}
              <div className="space-y-1.5">
                <span className="font-bold text-zinc-400 uppercase text-[10px] block mb-1">
                  Выбранные блюда:
                </span>
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm border-b border-zinc-100/70 pb-1.5"
                  >
                    <div className="text-zinc-700 font-medium">
                      {item.product?.name || "Товар"}
                      <span className="text-xs text-zinc-400 ml-1.5">
                        × {item.quantity}
                      </span>
                    </div>
                    <div className="font-semibold text-zinc-900">
                      {(item.product?.price || 0) * (item.quantity || 1)} ₽
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ПРАВАЯ СТОРОНА: ИТОГОВАЯ СУММА И КНОПКА ЗАВЕРШЕНИЯ */}
            <div className="flex flex-col justify-between items-end md:w-48 border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6 shrink-0">
              <div className="text-right w-full">
                <span className="text-xs text-zinc-400 font-bold uppercase block">
                  К оплате:
                </span>
                <span className="text-2xl font-black text-zinc-900">
                  {order.totalPrice} ₽
                </span>
              </div>

              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                ✓ Выполнен / Удалить
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-sm text-zinc-400 italic text-center py-12">
            На данный момент активных заказов нет.
          </p>
        )}
      </div>
    </div>
  );
}
