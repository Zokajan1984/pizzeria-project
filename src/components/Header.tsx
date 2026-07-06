import { ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍕</span>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">
              REACT PIZZA
            </h1>
            <p className="text-xs text-zinc-500">
              самая вкусная пицца во вселонной
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 p-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full">
          <span className="font-semibold">0 ₽</span>{" "}
          <span className="flex items-center gap-2 bg-white/20 rounded-full px-2 py-2">
            <ShoppingCart size={16} /> 0
          </span>
        </button>
      </div>
    </header>
  );
}
