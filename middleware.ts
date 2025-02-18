import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./lib/actions/user.actions";

export async function middleware(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/competitions/quran-competition/:path*",
    "/services/waste-management/:path*",
    "/competitions/edit/:path*",
    "/services/edit/:path*",
    "/sign-up",
  ],
};
