import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//  /checkout manquait dans les routes protégées
const protectedRoutes = ["/cart", "/dashboard", "/orders", "/checkout"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Si route protégée et pas de token → redirect login
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    // passer le callbackUrl pour rediriger après connexion
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si déjà connecté et va sur login/register → redirect home
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};