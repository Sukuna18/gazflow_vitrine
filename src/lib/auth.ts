import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "gazflow_admin";

function signature() {
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "gazflow-dev-secret")
    .update("gazflow-admin")
    .digest("hex");
}

export function validAdminToken(token?: string) {
  if (!token) return false;
  const expected = signature();
  return token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function isAdmin() {
  return validAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export function adminToken() {
  return signature();
}
