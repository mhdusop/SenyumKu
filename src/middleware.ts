// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
   const token = await getToken({ req: request });
   const { pathname } = request.nextUrl;

   if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/fonts")
   ) {
      return NextResponse.next();
   }

   if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
   }

   if (token && pathname === "/auth/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
   }

   const role = token?.role;

   const rolePaths: Record<string, string> = {
      PASIEN: "/dashboard/pasien",
      DOKTER: "/dashboard/dokter",
      PENGELOLA_OBAT: "/dashboard/pengelola-obat",
      ADMINISTRASI: "/dashboard/administrasi",
   };

   const expectedPrefix = role ? rolePaths[role] : null;

   if (
      token &&
      pathname.startsWith("/dashboard") &&
      expectedPrefix &&
      !pathname.startsWith(expectedPrefix)
   ) {
      return NextResponse.redirect(new URL(expectedPrefix, request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ["/dashboard/:path*", "/auth/login", "/"],
};
