import { NextResponse } from "next/server";
import { sendServiceRequest } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Requete invalide." }, { status: 400 });

  const { type, name, phone } = body as Record<string, string>;
  if (!["installation", "assistance", "entretien"].includes(type)) {
    return NextResponse.json({ error: "Type de service invalide." }, { status: 400 });
  }
  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Nom et telephone requis." }, { status: 400 });
  }

  sendServiceRequest({ ...body, name: name.trim(), phone: phone.trim() } as Parameters<typeof sendServiceRequest>[0]).catch(
    (err) => console.error("[mail] service request failed:", err),
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
