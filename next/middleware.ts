import { NextResponse } from "next/server";

interface RequestContext {
  url: string;
  req: Request;
  res: Response;
}
export function middleware(request: RequestContext) {
  return NextResponse.redirect(new URL("/middleware", request.url));
}
export const config = {
  matcher: "/test/:path*",
};
