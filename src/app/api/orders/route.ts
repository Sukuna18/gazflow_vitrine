import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/mail";
import { vehicleDeliveryExtraTotal } from "@/lib/delivery";

type Payload = {
  customerName?: string;
  phone?: string;
  address?: string;
  notes?: string;
  zoneId?: number;
  items?: { productId: number; quantity: number }[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  if (!body.customerName?.trim() || !body.phone?.trim() || !body.address?.trim() || !body.zoneId || !body.items?.length) {
    return NextResponse.json({ error: "Veuillez renseigner les informations de livraison." }, { status: 400 });
  }

  const quantities = new Map<number, number>();
  for (const item of body.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) return NextResponse.json({ error: "Quantite invalide." }, { status: 400 });
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const [products, zone] = await Promise.all([
    prisma.product.findMany({ where: { id: { in: [...quantities.keys()] }, active: true } }),
    prisma.deliveryZone.findUnique({ where: { id: body.zoneId } }),
  ]);
  if (!zone || products.length !== quantities.size) return NextResponse.json({ error: "Produit ou zone indisponible." }, { status: 400 });

  const subtotal = products.reduce((sum, product) => {
    const quantity = quantities.get(product.id) ?? 0;
    if (product.stock < quantity) throw new Error(`Stock insuffisant pour ${product.name}.`);
    return sum + product.price * quantity;
  }, 0);
  const vehicleDeliveryFee = vehicleDeliveryExtraTotal(products.map((product) => ({ ...product, quantity: quantities.get(product.id) ?? 0 })));
  const deliveryFee = zone.fee + vehicleDeliveryFee;
  const total = subtotal + deliveryFee;

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const product of products) {
        const quantity = quantities.get(product.id) ?? 0;
        const updated = await tx.product.updateMany({ where: { id: product.id, stock: { gte: quantity } }, data: { stock: { decrement: quantity } } });
        if (updated.count !== 1) throw new Error(`Stock insuffisant pour ${product.name}.`);
      }
      return tx.order.create({
        data: {
          reference: `GF-${Date.now().toString().slice(-8)}`,
          customerName: body.customerName!.trim(),
          phone: body.phone!.trim(),
          address: body.address!.trim(),
          notes: body.notes?.trim(),
          zoneId: zone.id,
          subtotal,
          deliveryFee,
          total,
          items: { create: products.map((product) => ({ productId: product.id, quantity: quantities.get(product.id) ?? 0, unitPrice: product.price })) },
        },
      });
    });

    // Envoi email en arriere-plan, sans bloquer la reponse client
    sendOrderNotification({
      reference: order.reference,
      customerName: body.customerName!.trim(),
      phone: body.phone!.trim(),
      address: body.address!.trim(),
      notes: body.notes?.trim(),
      zoneName: zone.name,
      items: products.map((p) => ({
        name: p.name,
        quantity: quantities.get(p.id) ?? 0,
        unitPrice: p.price,
      })),
      subtotal,
      zoneDeliveryFee: zone.fee,
      vehicleDeliveryFee,
      deliveryFee,
      total,
    }).catch((err) => console.error("[mail] order notification failed:", err));

    return NextResponse.json({ reference: order.reference, total: order.total }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible de creer la commande." }, { status: 409 });
  }
}
