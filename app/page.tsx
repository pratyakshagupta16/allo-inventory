"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch(
        "/api/products"
      );

      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.log(error);

      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function reserveItem(
    inventoryId: string
  ) {
    try {
      const res = await fetch(
        "/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            inventoryId,
            quantity: 1,
          }),
        }
      );

      const text = await res.text();

      const data = text
        ? JSON.parse(text)
        : {};

      if (!res.ok) {
        alert(
          data.error ||
            "Reservation failed"
        );

        return;
      }

      router.push(
        `/reservations/${data.id}`
      );
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <h1 className="text-4xl font-bold text-violet-400 animate-pulse">
          Loading Inventory...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14">
          <div>
            <h1 className="text-6xl font-black tracking-tight text-white">
              Inventory Hub
            </h1>

            <p className="text-slate-300 text-lg mt-3">
              Smart warehouse reservation system
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <span className="bg-violet-500 text-white font-bold px-6 py-3 rounded-full shadow-lg">
              Live Stock
            </span>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="grid lg:grid-cols-2 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 hover:border-violet-500 transition duration-300"
            >
              {/* PRODUCT HEADER */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-white">
                    {product.name}
                  </h2>

                  <p className="text-slate-300 mt-2 text-lg">
                    {product.description}
                  </p>
                </div>

                <div className="h-4 w-4 rounded-full bg-violet-500 animate-pulse"></div>
              </div>

              {/* INVENTORIES */}
              <div className="space-y-5">
                {product.inventories.map(
                  (inventory: any) => {
                    const availableStock =
                      inventory.totalStock -
                      inventory.reservedStock;

                    return (
                      <div
                        key={inventory.id}
                        className="bg-black border border-slate-700 rounded-2xl p-5 hover:border-violet-500 transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                          {/* LEFT */}
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {
                                inventory
                                  .warehouse
                                  .name
                              }
                            </h3>

                            <p className="text-slate-400 mt-2">
                              Available Units
                            </p>

                            <p className="text-5xl font-black text-violet-400 mt-1">
                              {availableStock}
                            </p>
                          </div>

                          {/* BUTTON */}
                          <button
                            onClick={() =>
                              reserveItem(
                                inventory.id
                              )
                            }
                            disabled={
                              availableStock <= 0
                            }
                            className="bg-violet-500 hover:bg-violet-400 text-white font-bold px-7 py-3 rounded-xl shadow-lg transition duration-200 disabled:bg-gray-700 disabled:text-gray-400"
                          >
                            {availableStock > 0
                              ? "Reserve"
                              : "Out of Stock"}
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}