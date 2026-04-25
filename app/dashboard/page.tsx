"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import { getUser, logout } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/orders");
      setOrders(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-600",
      CONFIRMED: "bg-blue-100 text-blue-600",
      SHIPPED: "bg-purple-100 text-purple-600",
      DELIVERED: "bg-green-100 text-green-600",
      CANCELLED: "bg-red-100 text-red-600",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600
          rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {user?.firstName} ! 👋
          </h1>
          <p className="text-indigo-100">
            {user?.role?.replace("ROLE_", "")} Account
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: "📦",
              color: "bg-blue-50"
            },
            {
              label: "Delivered",
              value: orders.filter(o => o.status === "DELIVERED").length,
              icon: "✅",
              color: "bg-green-50"
            },
            {
              label: "Pending",
              value: orders.filter(o => o.status === "PENDING").length,
              icon: "⏳",
              color: "bg-yellow-50"
            },
          ].map((stat) => (
            <div key={stat.label}
              className={`${stat.color} rounded-2xl p-6 flex
                items-center gap-4`}>
              <span className="text-4xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            My Orders
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i}
                  className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-500">No orders yet</p>
              <button onClick={() => router.push("/products")}
                className="mt-4 bg-indigo-600 text-white px-6 py-2
                  rounded-xl hover:bg-indigo-700 transition">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id}
                  className="border border-gray-100 rounded-xl p-4
                    flex items-center justify-between hover:bg-gray-50
                    transition">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                      {" · "}{order.items?.length} items
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-indigo-600">
                      ${order.totalAmount}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full
                      font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}