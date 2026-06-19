import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "topenergiesgroup.com";
  const response = NextResponse.redirect(`${proto}://${host}/admin/login`);
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
