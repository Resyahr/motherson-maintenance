import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { withAuth } from "next-auth/middleware";

const secret = process.env.NEXTAUTH_SECRET;

export default withAuth(async function middleware(req) {
  // Extract the token manually using getToken
  const token = await getToken({ req, secret });

  const { pathname } = req.nextUrl;

  if (!token) {
    const url = new URL("/unauthorized/notLoggedIn", req.url); // Create absolute URL
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/usersMgmt") && token?.role !== "admin") {
    const url = new URL("/notAdmin", req.url);
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/inventory") &&
    token?.role !== "admin" &&
    token?.role !== "technician"
  ) {
    const url = new URL("/notAdmin", req.url);
    return NextResponse.redirect(url);
  }

  // If user is authorized (admin), continue to the requested route
  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/usersMgmt/:path*", "/inventory/:path*"],
};
