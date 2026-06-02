import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE = "gazflow_admin";
const SESSION_DURATION = 60 * 60 * 12;

function signature(value: string) {
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "gazflow-dev-secret")
    .update(value)
    .digest("hex");
}

function sessionId(token?: string) {
  if (!token) return null;
  const [id, expiresAt, received] = token.split(".");
  if (!id || !expiresAt || !received || Number(expiresAt) < Math.floor(Date.now() / 1000)) return null;
  const expected = signature(`${id}.${expiresAt}`);
  if (received.length !== expected.length || !timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return null;
  const adminId = Number(id);
  return Number.isInteger(adminId) ? adminId : null;
}

export async function currentAdmin() {
  const id = sessionId((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!id) return null;
  return prisma.admin.findFirst({ where: { id, active: true }, select: { id: true, name: true, email: true } });
}

export async function isAdmin() {
  return Boolean(await currentAdmin());
}

export function adminToken(id: number) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  const value = `${id}.${expiresAt}`;
  return `${value}.${signature(value)}`;
}
