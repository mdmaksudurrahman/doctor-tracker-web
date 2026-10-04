import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        const url = new URL("/login", request.url);
        const { pathname } = request.nextUrl;
        if (pathname !== "/") url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Everything except the API proxy, Next internals, the login page and static files
    matcher: ["/((?!api|_next|login|.*\\..*).*)"],
};