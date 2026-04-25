"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: scrolled
        ? "rgba(10,10,10,0.95)"
        : "transparent",
      backdropFilter: "blur(12px)",
      borderBottom: scrolled
        ? "1px solid #2a2a2a"
        : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 2rem",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "var(--gold)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "16px",
              color: "#000",
            }}>S</div>
            <span style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "var(--text-primary)",
              letterSpacing: "2px",
            }}>SHOPFLOW</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}>
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500",
              letterSpacing: "1px",
              color: isActive(href)
                ? "var(--gold)"
                : "var(--text-muted)",
              borderBottom: isActive(href)
                ? "1px solid var(--gold)"
                : "1px solid transparent",
              paddingBottom: "2px",
              transition: "all 0.2s",
            }}>{label}</Link>
          ))}

          {user ? (
            <>
              <Link href="/cart" style={{
                textDecoration: "none",
                position: "relative",
              }}>
                <div style={{
                  width: "38px",
                  height: "38px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}>🛒</div>
              </Link>

              <Link href="/dashboard" style={{
                textDecoration: "none",
                fontSize: "13px",
                color: isActive("/dashboard")
                  ? "var(--gold)"
                  : "var(--text-muted)",
                letterSpacing: "1px",
                transition: "color 0.2s",
              }}>Dashboard</Link>

              {/* User Menu */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "40px",
                padding: "6px 14px 6px 6px",
              }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  background: "var(--gold)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#000",
                }}>
                  {user.firstName?.[0]?.toUpperCase()}
                </div>
                <span style={{
                  fontSize: "13px",
                  color: "var(--text-primary)",
                }}>{user.firstName}</span>
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: "0",
                  }}>✕</button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link href="/login" style={{
                textDecoration: "none",
                fontSize: "13px",
                color: "var(--text-muted)",
                letterSpacing: "1px",
                transition: "color 0.2s",
              }}>Login</Link>

              <Link href="/register" style={{
                textDecoration: "none",
                background: "var(--gold)",
                color: "#000",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1px",
                padding: "10px 20px",
                borderRadius: "8px",
                transition: "background 0.2s",
              }}>GET STARTED</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}