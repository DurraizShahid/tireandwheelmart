import { Metadata } from "next";
import { ShopClient } from "./shop-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Products | Tire&Wheel Mart",
  description: "Browse our complete collection of premium tires, wheels, and automotive accessories. Filter by brand, price, size, and more.",
};

export default function ShopPage() {
  return <ShopClient />;
}
