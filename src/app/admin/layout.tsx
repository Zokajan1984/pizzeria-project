import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* ИСПРАВЛЕНО: Добавили max-w-7xl для ограничения общей ширины админки и w-full */
    <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900">
        Панель администратора
      </h1>

      <nav className="flex gap-4 border-b mb-6 pb-2">
        <Link
          href="/admin/categories"
          className="text-zinc-800 hover:text-white border border-zinc-200 p-2 rounded-2xl hover:bg-gray-400 font-medium transition-colors"
        >
          Категории
        </Link>
        <Link
          href="/admin/products"
          className="text-zinc-800 hover:text-white border border-zinc-200 p-2 rounded-2xl hover:bg-gray-400 font-medium transition-colors"
        >
          Товары
        </Link>
        <Link
          href="/admin/orders"
          className="text-zinc-800 hover:text-white border border-zinc-200 p-2 rounded-2xl hover:bg-gray-400 font-medium transition-colors"
        >
          Заказы
        </Link>
      </nav>

      {/* Обертка для страниц-детей (children) */}
      <div className="w-full">{children}</div>
    </div>
  );
}
