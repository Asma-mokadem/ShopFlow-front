"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/auth/register", {
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

  const inputStyle = {
    width: "100%",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "14px 16px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: "12px",
    fontWeight: "600" as const,
    color: "var(--text-muted)",
    letterSpacing: "1px",
    marginBottom: "8px",
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

      {/* Glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "480px", position: "relative" }}>

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
          }}>Create your account</h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Join the ShopFlow community
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "2.5rem",
        }}>

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

            {/* Name row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}>
              <div>
                <label style={labelStyle}>FIRST NAME</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="John"
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <div>
                <label style={labelStyle}>LAST NAME</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Doe"
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>PASSWORD</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {/* Role */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={labelStyle}>I AM A...</label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}>
                {["CUSTOMER", "SELLER"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: form.role === role
                        ? "1px solid var(--gold)"
                        : "1px solid var(--border)",
                      background: form.role === role
                        ? "rgba(212,175,55,0.1)"
                        : "var(--bg-surface)",
                      color: form.role === role
                        ? "var(--gold)"
                        : "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "1px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}>
                    {role === "CUSTOMER" ? "👤 Customer" : "🏪 Seller"}
                  </button>
                ))}
              </div>
            </div>

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
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

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
            Already have an account?{" "}
            <Link href="/login" style={{
              color: "var(--gold)",
              fontWeight: "600",
              textDecoration: "none",
            }}>Sign in</Link>
          </p>
        </div>

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