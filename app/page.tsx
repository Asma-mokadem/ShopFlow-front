import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: "800px" }}>
          <div style={{
            display: "inline-block",
            border: "1px solid var(--gold)",
            color: "var(--gold)",
            fontSize: "11px",
            letterSpacing: "4px",
            padding: "6px 20px",
            borderRadius: "40px",
            marginBottom: "2rem",
          }}>
            PREMIUM E-COMMERCE PLATFORM
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: "700",
            lineHeight: "1.1",
            color: "var(--text-primary)",
            marginBottom: "1.5rem",
            letterSpacing: "-1px",
          }}>
            Shop the World's{" "}
            <span style={{ color: "var(--gold)" }}>Finest</span>{" "}
            Products
          </h1>

          <p style={{
            fontSize: "18px",
            color: "var(--text-muted)",
            maxWidth: "500px",
            margin: "0 auto 3rem",
            lineHeight: "1.7",
          }}>
            Discover curated collections from trusted sellers.
            Quality guaranteed, delivered to your door.
          </p>

          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <Link href="/products" style={{
              textDecoration: "none",
              background: "var(--gold)",
              color: "#000",
              fontWeight: "700",
              fontSize: "13px",
              letterSpacing: "2px",
              padding: "16px 40px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}>SHOP NOW</Link>

            <Link href="/register" style={{
              textDecoration: "none",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontWeight: "500",
              fontSize: "13px",
              letterSpacing: "2px",
              padding: "16px 40px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}>CREATE ACCOUNT</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "3rem 2rem",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2rem",
          textAlign: "center",
        }}>
          {[
            { value: "10K+", label: "Products" },
            { value: "500+", label: "Sellers" },
            { value: "50K+", label: "Customers" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "var(--gold)",
                marginBottom: "4px",
              }}>{stat.value}</div>
              <div style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                letterSpacing: "2px",
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "var(--gold)",
              marginBottom: "1rem",
            }}>WHY SHOPFLOW</div>
            <h2 style={{
              fontSize: "40px",
              fontWeight: "700",
              color: "var(--text-primary)",
            }}>The Premium Experience</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}>
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Express delivery to your doorstep with real-time tracking.",
              },
              {
                icon: "🔐",
                title: "Secure & Safe",
                desc: "Bank-level encryption for all your transactions.",
              },
              {
                icon: "💎",
                title: "Premium Quality",
                desc: "Every product is verified and quality-checked.",
              },
            ].map((f) => (
              <div key={f.title} style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "2.5rem",
                transition: "border-color 0.3s",
              }}>
                <div style={{
                  fontSize: "32px",
                  marginBottom: "1.5rem",
                }}>{f.icon}</div>
                <div style={{
                  width: "40px",
                  height: "2px",
                  background: "var(--gold)",
                  marginBottom: "1.5rem",
                }} />
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "1rem",
                }}>{f.title}</h3>
                <p style={{
                  color: "var(--text-muted)",
                  lineHeight: "1.7",
                  fontSize: "15px",
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "6rem 2rem",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          <div style={{
            fontSize: "11px",
            letterSpacing: "4px",
            color: "var(--gold)",
            marginBottom: "1.5rem",
          }}>START SELLING TODAY</div>
          <h2 style={{
            fontSize: "40px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "1.5rem",
          }}>Grow Your Business with ShopFlow</h2>
          <p style={{
            color: "var(--text-muted)",
            marginBottom: "2.5rem",
            lineHeight: "1.7",
          }}>
            Join thousands of sellers reaching millions of customers worldwide.
          </p>
          <Link href="/register" style={{
            textDecoration: "none",
            background: "var(--gold)",
            color: "#000",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: "2px",
            padding: "16px 48px",
            borderRadius: "8px",
          }}>BECOME A SELLER</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "var(--gold)",
          letterSpacing: "2px",
          marginBottom: "0.5rem",
        }}>SHOPFLOW</div>
        <p style={{
          fontSize: "13px",
          color: "var(--text-dim)",
        }}>© 2025 ShopFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}