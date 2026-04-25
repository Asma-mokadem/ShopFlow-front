"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  averageRating: number;
  sellerName: string;
  categories: { id: number; name: string }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (keyword = "", pageNum = 0) => {
    setLoading(true);
    try {
      let data;
      if (keyword) {
        data = await apiFetch(
          `/products/search?keyword=${keyword}&page=${pageNum}&size=8`
        );
      } else {
        data = await apiFetch(`/products?page=${pageNum}&size=8`);
      }
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(search, page);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProducts(search, 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating)
        ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center
          justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            All Products
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch}
            className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="border border-gray-300 rounded-lg px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white
                px-4 py-2 rounded-lg transition">
              Search
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4
                animate-pulse h-72" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl">No products found</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2
              md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-2xl shadow-sm
                    hover:shadow-md transition overflow-hidden group">

                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-indigo-100
                      to-purple-100 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name}
                          className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-6xl">🛍️</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800
                        truncate group-hover:text-indigo-600 transition">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1 my-1">
                        {renderStars(product.averageRating)}
                        <span className="text-xs text-gray-400 ml-1">
                          ({product.averageRating?.toFixed(1) || "0.0"})
                        </span>
                      </div>

                      <div className="flex items-center
                        justify-between mt-2">
                        <span className="text-indigo-600 font-bold text-lg">
                          ${product.price}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.stock > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>

                      {product.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.categories.slice(0, 2).map((cat) => (
                            <span key={cat.id}
                              className="text-xs bg-indigo-50
                                text-indigo-600 px-2 py-0.5 rounded-full">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300
                    hover:bg-gray-100 disabled:opacity-50 transition">
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i)}
                    className={`px-4 py-2 rounded-lg transition ${
                      page === i
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}>
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 rounded-lg border border-gray-300
                    hover:bg-gray-100 disabled:opacity-50 transition">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}