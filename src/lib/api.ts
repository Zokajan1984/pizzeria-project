import axios from "axios";
import { Category, Product, OrderData } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default api;

export async function getCategories(): Promise<Category[]> {
  const response = await api.get("/categories");
  return response.data;
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get("/products");
  return response.data;
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<Product[]> {
  const response = await api.get(`/products?category=${categoryId}`);
  return response.data;
}

export async function CreateCategory(name: string) {
  const response = await api.post("/categories", { name });
  return response.data;
}

export async function createOrder(orderData: OrderData) {
  const response = await api.post("/orders", orderData);
  return response.data;
}
