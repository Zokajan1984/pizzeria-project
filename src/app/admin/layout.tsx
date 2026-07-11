import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
      <nav className="flex gap-4 border-b mb-6 pb-2">
        <Link
          href="/admin/categories"
          className="text-zinc-800 hover:text-white border p-2 rounded-2xl hover:bg-gray-400 "
        >
          Категории
        </Link>
        <Link
          href="/admin/products"
          className="text-zinc-800 hover:text-white border p-2 rounded-2xl hover:bg-gray-400 "
        >
          Товары
        </Link>
        <Link
          href="/admin/orders"
          className="text-zinc-800 hover:text-white border p-2 rounded-2xl hover:bg-gray-400 "
        >
          Заказы
        </Link>
      </nav>
      {children}
    </div>
  );
}
