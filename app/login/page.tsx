"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      saveAuth(data);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "440px",
        position: "relative",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: "52px",
              height: "52px",
              background: "var(--gold)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "700",
              color: "#000",
              margin: "0 auto 1rem",
            }}>S</div>
          </Link>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}>Welcome back</h1>
          <p style={{
            fontSize: "14px",
            color: "var(--text-muted)",
          }}>Sign in to your ShopFlow account</p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "2.5rem",
        }}>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.3)",
              color: "#f87171",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              fontSize: "14px",
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-muted)",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}>EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                required
                style={{
                  width: "100%",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-muted)",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}>PASSWORD</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "var(--bg-surface2)" : "var(--gold)",
                color: loading ? "var(--text-muted)" : "#000",
                border: "none",
                borderRadius: "10px",
                padding: "15px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}>
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          <p style={{
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}>
            Don't have an account?{" "}
            <Link href="/register" style={{
              color: "var(--gold)",
              fontWeight: "600",
              textDecoration: "none",
            }}>Create one</Link>
          </p>
        </div>

        {/* Back */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/" style={{
            fontSize: "13px",
            color: "var(--text-dim)",
            textDecoration: "none",
          }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}