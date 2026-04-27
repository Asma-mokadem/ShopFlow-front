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
  //  ajouter état d'erreur global
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCart = async () => {
    try {
      const data = await apiFetch("/cart");
      setCart(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      // BUG FIX: si quantity = 0, appeler removeItem plutôt que PUT avec 0
      if (quantity <= 0) {
        return removeItem(itemId);
      }
      const data = await apiFetch(
        `/cart/items/${itemId}?quantity=${quantity}`,
        { method: "PUT" }
      );
      setCart(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const data = await apiFetch(`/cart/items/${itemId}`, { method: "DELETE" });
      setCart(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const clearCart = async () => {
    try {
      //  clearCart retourne 204 No Content → apiFetch retourne null
      await apiFetch("/cart", { method: "DELETE" });
      // Recharger le panier après vidage
      await fetchCart();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  if (loading)
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "14px", letterSpacing: "2px" }}>
            LOADING...
          </div>
        </div>
      </div>
    );

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem" }}>

        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "6px" }}>
            MY CART
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "var(--text-primary)" }}>
            Shopping Cart
          </h1>
        </div>

        {/* BUG FIX: afficher l'erreur globale */}
        {error && (
          <div style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "#f87171",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontSize: "14px",
          }}>
            {error}
            <button
              onClick={() => setError("")}
              style={{ float: "right", background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "5rem 2rem",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</p>
            <p style={{ color: "var(--text-muted)", fontSize: "18px", marginBottom: "2rem" }}>
              Your cart is empty
            </p>
            <button
              onClick={() => router.push("/products")}
              style={{
                background: "var(--gold)",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "12px 32px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: "pointer",
              }}
            >
              START SHOPPING
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "2rem",
            alignItems: "start",
          }}>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                  }}
                >
                  <div style={{
                    width: "60px", height: "60px",
                    background: "var(--bg-surface)",
                    borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.75rem", flexShrink: 0,
                  }}>
                    🛍️
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "4px" }}>
                      {item.productName}
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " · "}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p style={{ color: "var(--gold)", fontWeight: "700", marginTop: "4px" }}>
                      ${item.unitPrice}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      style={{
                        width: "30px", height: "30px", borderRadius: "50%",
                        border: "1px solid var(--border)",
                        background: "var(--bg-surface)",
                        color: "var(--text-primary)",
                        cursor: "pointer", fontSize: "16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span style={{ width: "30px", textAlign: "center", color: "var(--text-primary)", fontWeight: "600" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      style={{
                        width: "30px", height: "30px", borderRadius: "50%",
                        border: "1px solid var(--border)",
                        background: "var(--bg-surface)",
                        color: "var(--text-primary)",
                        cursor: "pointer", fontSize: "16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <p style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "6px" }}>
                      ${item.subtotal}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none", border: "none",
                        color: "#f87171", fontSize: "12px", cursor: "pointer", padding: 0,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                style={{
                  background: "none", border: "none",
                  color: "#f87171", fontSize: "13px",
                  cursor: "pointer", alignSelf: "flex-start", padding: 0,
                }}
              >
                🗑️ Clear cart
              </button>
            </div>

            {/* Summary */}
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "2rem",
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "1.5rem" }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "14px" }}>
                  <span>Items ({cart.itemCount})</span>
                  <span>${cart.total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "14px" }}>
                  <span>Shipping</span>
                  <span style={{ color: "#4ade80" }}>Free</span>
                </div>
                <div style={{
                  borderTop: "1px solid var(--border)", paddingTop: "12px",
                  display: "flex", justifyContent: "space-between",
                  fontWeight: "700", color: "var(--text-primary)", fontSize: "18px",
                }}>
                  <span>Total</span>
                  <span style={{ color: "var(--gold)" }}>${cart.total}</span>
                </div>
              </div>

              {/* Coupon */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  style={{
                    flex: 1,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  style={{
                    background: "var(--bg-surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                style={{
                  width: "100%",
                  background: "var(--gold)",
                  color: "#000",
                  border: "none",
                  borderRadius: "10px",
                  padding: "15px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  cursor: "pointer",
                }}
              >
                CHECKOUT →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}