import { Product } from "@/types";
import PizzaCard from "./PizzaCard";

interface ProductListPorps {
  products: Product[];
}

export default function ProductList({ products }: ProductListPorps) {
  if (products.length === 0) {
    return <p className="text-zinc-500">Товары не найдены</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <PizzaCard key={product.id} product={product} />
      ))}
    </div>
  );
}
