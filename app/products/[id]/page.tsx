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
          `/products/search?keyword=${encodeURIComponent(keyword)}&page=${pageNum}&size=8`
        );
      } else {
        data = await apiFetch(`/products?page=${pageNum}&size=8`);
      }
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(search, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProducts(search, 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{ color: i < Math.round(rating) ? "#D4AF37" : "#333" }}
      >
        ★
      </span>
    ));
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "6px" }}>
              CATALOGUE
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "var(--text-primary)" }}>
              All Products
            </h1>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "10px 16px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                width: "240px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              type="submit"
              style={{
                background: "var(--gold)",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1px",
                cursor: "pointer",
              }}
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ borderRadius: "16px", height: "320px" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</p>
            <p style={{ color: "var(--text-muted)", fontSize: "18px" }}>
              No products found
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "border-color 0.2s, transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      height: "180px",
                      background: "var(--bg-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: "3rem", opacity: 0.3 }}>🛍️</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: "1.25rem" }}>
                      {/* Categories */}
                      {product.categories?.length > 0 && (
                        <div style={{ display: "flex", gap: "4px", marginBottom: "8px", flexWrap: "wrap" }}>
                          {product.categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat.id}
                              style={{
                                fontSize: "9px",
                                letterSpacing: "1px",
                                color: "var(--gold)",
                                background: "rgba(212,175,55,0.1)",
                                border: "1px solid rgba(212,175,55,0.2)",
                                padding: "2px 8px",
                                borderRadius: "40px",
                              }}
                            >
                              {cat.name.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 style={{
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        marginBottom: "6px",
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {product.name}
                      </h3>

                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
                        {renderStars(product.averageRating)}
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "4px" }}>
                          ({product.averageRating?.toFixed(1) || "0.0"})
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--gold)" }}>
                          ${product.price}
                        </span>
                        <span style={{
                          fontSize: "10px",
                          padding: "3px 10px",
                          borderRadius: "40px",
                          fontWeight: "600",
                          background: product.stock > 0 ? "rgba(34,197,94,0.1)" : "rgba(220,38,38,0.1)",
                          color: product.stock > 0 ? "#4ade80" : "#f87171",
                          border: `1px solid ${product.stock > 0 ? "rgba(34,197,94,0.2)" : "rgba(220,38,38,0.2)"}`,
                        }}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "3rem",
              }}>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface)",
                    color: "var(--text-muted)",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    opacity: page === 0 ? 0.4 : 1,
                    fontSize: "13px",
                  }}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: page === i ? "1px solid var(--gold)" : "1px solid var(--border)",
                      background: page === i ? "var(--gold)" : "var(--bg-surface)",
                      color: page === i ? "#000" : "var(--text-muted)",
                      cursor: "pointer",
                      fontWeight: page === i ? "700" : "400",
                      fontSize: "13px",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface)",
                    color: "var(--text-muted)",
                    cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                    opacity: page === totalPages - 1 ? 0.4 : 1,
                    fontSize: "13px",
                  }}
                >
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