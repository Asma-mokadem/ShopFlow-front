"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import { getUser } from "@/lib/auth";

interface ProductVariant {
  id: number;
  size: string;
  color: string;
  stock: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
}

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

// BUG FIX: Ce fichier était une copie de la liste produits — remplacé par la page de détail
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = getUser();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const productId = params?.id as string;

  useEffect(() => {
    if (!productId) return;
    Promise.all([
      fetchProduct(),
      fetchVariants(),
      fetchReviews(),
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    const data = await apiFetch(`/products/${productId}`);
    setProduct(data);
  };

  const fetchVariants = async () => {
    try {
      const data = await apiFetch(`/products/${productId}/variants`);
      setVariants(data);
      if (data.length > 0) setSelectedVariant(data[0]);
    } catch {
      // Pas de variants — OK
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await apiFetch(`/products/${productId}/reviews?page=0&size=5`);
      setReviews(data.content || []);
    } catch {
      // Pas d'avis
    }
  };

  const handleAddToCart = async () => {
    if (!user) { router.push("/login"); return; }

    //  si pas de variants, on ne peut pas ajouter au panier (CartItemRequest exige productVariantId)
    if (!selectedVariant) {
      setCartMessage("Please select a variant to add to cart.");
      return;
    }

    setAddingToCart(true);
    setCartMessage("");
    try {
      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          productVariantId: selectedVariant.id,
          quantity,
        }),
      });
      setCartMessage("✅ Added to cart!");
    } catch (err: unknown) {
      setCartMessage("❌ " + (err as Error).message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setSubmittingReview(true);
    try {
      await apiFetch(`/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      setReviewComment("");
      setReviewRating(5);
      await fetchReviews();
      await fetchProduct(); // Mettre à jour la note moyenne
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          onClick={() => interactive && onRate && onRate(i + 1)}
          style={{
            color: i < Math.round(rating) ? "#D4AF37" : "#333",
            fontSize: "18px",
            cursor: interactive ? "pointer" : "default",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div style={{ color: "var(--text-muted)", letterSpacing: "3px", fontSize: "13px" }}>
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", paddingTop: "5rem", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "3rem" }}>🔍</p>
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "2rem", letterSpacing: "1px" }}>
          <span
            onClick={() => router.push("/products")}
            style={{ cursor: "pointer", color: "var(--gold)" }}
          >
            Products
          </span>
          {" / "}
          <span style={{ color: "var(--text-muted)" }}>{product.name}</span>
        </div>

        {/* Layout produit */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          marginBottom: "4rem",
        }}>

          {/* Image */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            overflow: "hidden",
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "6rem", opacity: 0.2 }}>🛍️</span>
            )}
          </div>

          {/* Infos */}
          <div>
            {/* Catégories */}
            {product.categories?.length > 0 && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "1rem", flexWrap: "wrap" }}>
                {product.categories.map((cat) => (
                  <span key={cat.id} style={{
                    fontSize: "9px",
                    letterSpacing: "2px",
                    color: "var(--gold)",
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    padding: "4px 12px",
                    borderRadius: "40px",
                  }}>
                    {cat.name.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              {product.name}
            </h1>

            {product.sellerName && (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "1rem" }}>
                by <span style={{ color: "var(--gold)" }}>{product.sellerName}</span>
              </p>
            )}

            {/* Note */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
              {renderStars(product.averageRating)}
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {product.averageRating?.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            {/* Prix */}
            <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--gold)", marginBottom: "1.5rem" }}>
              ${product.price}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{
                color: "var(--text-muted)",
                lineHeight: "1.7",
                fontSize: "15px",
                marginBottom: "2rem",
              }}>
                {product.description}
              </p>
            )}

            {/* Variants */}
            {variants.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  SELECT VARIANT
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: selectedVariant?.id === v.id
                          ? "1px solid var(--gold)"
                          : "1px solid var(--border)",
                        background: selectedVariant?.id === v.id
                          ? "rgba(212,175,55,0.1)"
                          : "var(--bg-surface)",
                        color: selectedVariant?.id === v.id
                          ? "var(--gold)"
                          : v.stock === 0 ? "var(--text-dim)" : "var(--text-primary)",
                        cursor: v.stock === 0 ? "not-allowed" : "pointer",
                        fontSize: "12px",
                        opacity: v.stock === 0 ? 0.5 : 1,
                      }}
                    >
                      {[v.size, v.color].filter(Boolean).join(" / ") || `Variant ${v.id}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{
                fontSize: "11px",
                padding: "4px 12px",
                borderRadius: "40px",
                fontWeight: "600",
                background: product.stock > 0 ? "rgba(34,197,94,0.1)" : "rgba(220,38,38,0.1)",
                color: product.stock > 0 ? "#4ade80" : "#f87171",
                border: `1px solid ${product.stock > 0 ? "rgba(34,197,94,0.2)" : "rgba(220,38,38,0.2)"}`,
              }}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantité */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
              <span style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--text-muted)" }}>QTY</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    cursor: "pointer", fontSize: "16px",
                  }}
                >−</button>
                <span style={{ width: "32px", textAlign: "center", color: "var(--text-primary)", fontWeight: "600" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    cursor: "pointer", fontSize: "16px",
                  }}
                >+</button>
              </div>
            </div>

            {/* Bouton add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              style={{
                width: "100%",
                background: product.stock === 0 ? "var(--bg-surface2)" : "var(--gold)",
                color: product.stock === 0 ? "var(--text-dim)" : "#000",
                border: "none",
                borderRadius: "10px",
                padding: "16px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: product.stock === 0 || addingToCart ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                marginBottom: "1rem",
              }}
            >
              {addingToCart ? "ADDING..." : product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
            </button>

            {cartMessage && (
              <p style={{
                fontSize: "13px",
                color: cartMessage.startsWith("✅") ? "#4ade80" : "#f87171",
                textAlign: "center",
              }}>
                {cartMessage}
              </p>
            )}
          </div>
        </div>

        {/* Section avis */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "2.5rem",
        }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2rem" }}>
            Customer Reviews
          </h2>

          {/* Formulaire avis */}
          {user && (
            <form onSubmit={handleSubmitReview} style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                YOUR RATING
              </p>
              {renderStars(reviewRating, true, setReviewRating)}

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                }}
              />

              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  marginTop: "1rem",
                  background: "var(--gold)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 28px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  cursor: submittingReview ? "not-allowed" : "pointer",
                }}
              >
                {submittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
              </button>
            </form>
          )}

          {/* Liste des avis */}
          {reviews.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
              No reviews yet. Be the first!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px" }}>
                      {review.customerName}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                  {review.comment && (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "0.5rem", lineHeight: "1.6" }}>
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}