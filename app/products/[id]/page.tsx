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
      const endpoint = keyword
        ? `/products/search?keyword=${keyword}&page=${pageNum}&size=8`
        : `/products?page=${pageNum}&size=8`;
      const data = await apiFetch(endpoint);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(search, page); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProducts(search, 0);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{
        color: i < Math.round(rating) ? "#D4AF37" : "#333",
        fontSize: "12px",
      }}>★</span>
    ));

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #2a2a2a",
        padding: "3rem 2rem",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "4px",
            color: "#D4AF37",
            marginBottom: "0.75rem",
          }}>DISCOVER</div>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <h1 style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#f5f5f5",
            }}>All Products</h1>

            {/* Search */}
            <form onSubmit={handleSearch} style={{
              display: "flex",
              gap: "10px",
            }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{
                  background: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  outline: "none",
                  width: "280px",
                }}
                onFocus={(e) => e.target.style.borderColor = "#D4AF37"}
                onBlur={(e) => e.target.style.borderColor = "#2a2a2a"}
              />
              <button type="submit" style={{
                background: "#D4AF37",
                color: "#000",
                border: "none",
                borderRadius: "10px",
                padding: "12px 24px",
                fontWeight: "700",
                fontSize: "13px",
                letterSpacing: "1px",
                cursor: "pointer",
              }}>SEARCH</button>
            </form>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Loading Skeletons */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{
                borderRadius: "16px",
                height: "320px",
              }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "6rem 0",
          }}>
            <div style={{ fontSize: "64px", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: "20px", color: "#888" }}>
              No products found
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}>
              {products.map((product) => (
                <Link key={product.id}
                  href={`/products/${product.id}`}
                  style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#111",
                    border: "1px solid #2a2a2a",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#D4AF37";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    }}>

                    {/* Image */}
                    <div style={{
                      height: "200px",
                      background: "#1a1a1a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }} />
                      ) : (
                        <div style={{
                          fontSize: "48px",
                          opacity: 0.3,
                        }}>🛍️</div>
                      )}

                      {/* Stock badge */}
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: product.stock > 0
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",
                        border: `1px solid ${product.stock > 0 ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                        color: product.stock > 0 ? "#4ade80" : "#f87171",
                        fontSize: "10px",
                        fontWeight: "600",
                        padding: "4px 10px",
                        borderRadius: "40px",
                        letterSpacing: "1px",
                      }}>
                        {product.stock > 0 ? "IN STOCK" : "SOLD OUT"}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "1.25rem" }}>

                      {/* Categories */}
                      {product.categories?.length > 0 && (
                        <div style={{
                          display: "flex",
                          gap: "6px",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                        }}>
                          {product.categories.slice(0, 2).map((cat) => (
                            <span key={cat.id} style={{
                              fontSize: "10px",
                              color: "#D4AF37",
                              background: "rgba(212,175,55,0.1)",
                              border: "1px solid rgba(212,175,55,0.2)",
                              padding: "2px 8px",
                              borderRadius: "40px",
                              letterSpacing: "1px",
                            }}>{cat.name.toUpperCase()}</span>
                          ))}
                        </div>
                      )}

                      <h3 style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#f5f5f5",
                        marginBottom: "8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>{product.name}</h3>

                      {/* Stars */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginBottom: "12px",
                      }}>
                        {renderStars(product.averageRating || 0)}
                        <span style={{
                          fontSize: "11px",
                          color: "#555",
                          marginLeft: "4px",
                        }}>
                          ({(product.averageRating || 0).toFixed(1)})
                        </span>
                      </div>

                      {/* Price + Button */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                        <span style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#D4AF37",
                        }}>${product.price}</span>
                        <div style={{
                          background: "#D4AF37",
                          color: "#000",
                          fontSize: "11px",
                          fontWeight: "700",
                          letterSpacing: "1px",
                          padding: "8px 14px",
                          borderRadius: "8px",
                        }}>VIEW</div>
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
              }}>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{
                    background: "#111",
                    border: "1px solid #2a2a2a",
                    color: "#888",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    opacity: page === 0 ? 0.4 : 1,
                    fontSize: "13px",
                  }}>← Prev</button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i)} style={{
                    background: page === i ? "#D4AF37" : "#111",
                    border: `1px solid ${page === i ? "#D4AF37" : "#2a2a2a"}`,
                    color: page === i ? "#000" : "#888",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: page === i ? "700" : "400",
                    fontSize: "13px",
                  }}>{i + 1}</button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  style={{
                    background: "#111",
                    border: "1px solid #2a2a2a",
                    color: "#888",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                    opacity: page === totalPages - 1 ? 0.4 : 1,
                    fontSize: "13px",
                  }}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}