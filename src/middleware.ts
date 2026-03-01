import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the routes that do NOT require authentication
const publicRoutes = ["/"]; // Root is the login page

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Let public routes go right through
    if (publicRoutes.includes(pathname) || pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Check the global "auth-storage" cookie implicitly injected by Zustand (if any)
    // Actually, Zustand localStore persistence is purely client-side.
    // We can't easily read LocalStorage Server-Side.
    // The Best Practice for Next.js Edge Auth is usually HTTP-Only Cookies.
    // But for this MVP without a complex Cookie layer, we let the client side redirect,
    // or we simply protect the actual `/dashboard` layout.

    // NOTE: In MVP, if we use LocalStorage, Middleware can't read it.
    // We will instead use a React `useEffect` inside a Client Layout to redirect users if token is missing.
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
