"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface CartItem {
  id: number;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export default function CartPage() {
  const router = useRouter();
  const user = getUser();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await apiFetch("/cart");
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      const data = await apiFetch(
        `/cart/items/${itemId}?quantity=${quantity}`,
        { method: "PUT" }
      );
      setCart(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const data = await apiFetch(`/cart/items/${itemId}`,
        { method: "DELETE" });
      setCart(data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const clearCart = async () => {
    try {
      await apiFetch("/cart", { method: "DELETE" });
      fetchCart();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12
          border-b-2 border-indigo-600" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🛒 My Cart
        </h1>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16
            text-center">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-xl text-gray-500 mb-6">
              Your cart is empty
            </p>
            <button onClick={() => router.push("/products")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white
                px-8 py-3 rounded-xl font-semibold transition">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id}
                  className="bg-white rounded-2xl shadow-sm p-6
                    flex items-center gap-4">

                  {/* Icon */}
                  <div className="w-16 h-16 bg-indigo-100 rounded-xl
                    flex items-center justify-center text-3xl flex-shrink-0">
                    🛍️
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` · Color: ${item.color}`}
                    </p>
                    <p className="text-indigo-600 font-bold mt-1">
                      ${item.unitPrice}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border
                        border-gray-300 flex items-center justify-center
                        hover:bg-gray-100">
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border
                        border-gray-300 flex items-center justify-center
                        hover:bg-gray-100">
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      ${item.subtotal}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600
                        text-sm mt-1 transition">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={clearCart}
                className="text-red-400 hover:text-red-600
                  text-sm transition">
                🗑️ Clear cart
              </button>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.itemCount})</span>
                  <span>${cart.total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between
                  font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span>${cart.total}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 border border-gray-300 rounded-lg
                    px-3 py-2 text-sm focus:outline-none
                    focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-gray-100 hover:bg-gray-200
                  text-gray-700 px-3 py-2 rounded-lg text-sm transition">
                  Apply
                </button>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-indigo-600 hover:bg-indigo-700
                  text-white font-bold py-3 rounded-xl transition">
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}