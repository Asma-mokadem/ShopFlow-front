"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import { getUser } from "@/lib/auth";

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = getUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiFetch(`/products/${id}`)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) { router.push("/login"); return; }
    setAdding(true);
    try {
      // L'API panier utilise productVariantId, pas productId
      // Il faut d'abord récupérer les variants du produit
      const variants = await apiFetch(`/products/${id}/variants`).catch(() => null);
      const variantId = variants?.[0]?.id;
      if (!variantId) {
        setMsg("Aucun variant disponible pour ce produit.");
        return;
      }
      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productVariantId: variantId, quantity: qty }),
      });
      setMsg("Ajouté au panier !");
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "8rem" }}>
        <div style={{ color: "#888" }}>Chargement...</div>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ textAlign: "center", paddingTop: "8rem", color: "#888" }}>
        Produit introuvable.
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
          {/* Image */}
          <div style={{
            background: "#1a1a1a", border: "1px solid #2a2a2a",
            borderRadius: "16px", aspectRatio: "1", display: "flex",
            alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "64px", opacity: 0.2 }}>🛍️</span>
            }
          </div>

          {/* Info */}
          <div>
            {product.categories?.length > 0 && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "1rem", flexWrap: "wrap" }}>
                {product.categories.map((cat) => (
                  <span key={cat.id} style={{
                    fontSize: "10px", color: "#D4AF37",
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    padding: "3px 10px", borderRadius: "40px", letterSpacing: "1px",
                  }}>{cat.name.toUpperCase()}</span>
                ))}
              </div>
            )}

            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#f5f5f5", marginBottom: "1rem" }}>
              {product.name}
            </h1>

            <div style={{ fontSize: "32px", fontWeight: "700", color: "#D4AF37", marginBottom: "1.5rem" }}>
              ${product.price}
            </div>

            <p style={{ color: "#888", lineHeight: "1.7", marginBottom: "2rem" }}>
              {product.description || "Aucune description disponible."}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <label style={{ color: "#888", fontSize: "14px" }}>Quantité</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  border: "1px solid #2a2a2a", background: "#111", color: "#f5f5f5", cursor: "pointer",
                }}>−</button>
                <span style={{ color: "#f5f5f5", width: "32px", textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  border: "1px solid #2a2a2a", background: "#111", color: "#f5f5f5", cursor: "pointer",
                }}>+</button>
              </div>
            </div>

            {msg && (
              <div style={{
                background: msg.includes("!") ? "rgba(34,197,94,0.1)" : "rgba(220,38,38,0.1)",
                border: `1px solid ${msg.includes("!") ? "rgba(34,197,94,0.3)" : "rgba(220,38,38,0.3)"}`,
                color: msg.includes("!") ? "#4ade80" : "#f87171",
                padding: "10px 14px", borderRadius: "8px", marginBottom: "1rem", fontSize: "14px",
              }}>{msg}</div>
            )}

            <button
              onClick={addToCart}
              disabled={adding || product.stock === 0}
              style={{
                width: "100%", background: product.stock === 0 ? "#222" : "#D4AF37",
                color: product.stock === 0 ? "#555" : "#000",
                border: "none", borderRadius: "10px", padding: "15px",
                fontSize: "13px", fontWeight: "700", letterSpacing: "2px",
                cursor: product.stock === 0 || adding ? "not-allowed" : "pointer",
              }}>
              {product.stock === 0 ? "RUPTURE DE STOCK" : adding ? "AJOUT..." : "AJOUTER AU PANIER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}