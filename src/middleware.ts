import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/history", "/recommendations", "/settings"];

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        const loginUrl = new URL("/", request.url);
        if (!token) {
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
        if (token.role !== "admin") {
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}
