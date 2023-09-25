import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const home = new URL("/", req.url);
      return NextResponse.redirect(home);
    } else if (auth.userId && auth.isPublicRoute) {
      const design_studio = new URL("/studio", req.url);
      return NextResponse.redirect(design_studio);
    }

    if(req.url.includes('gallery') || req.url.includes('marketplace')) {
      const studio = new URL("/studio", req.url);
      return NextResponse.redirect(studio);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
