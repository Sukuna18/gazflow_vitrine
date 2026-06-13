import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST ?? "smtp.hostinger.com",
  port: Number(process.env.MAIL_PORT ?? 465),
  secure: true, // SSL sur port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

type OrderEmailData = {
  reference: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string | null;
  zoneName: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

function formatFcfa(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

function orderEmailHtml(data: OrderEmailData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1a1a1a">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:center">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:right">${formatFcfa(item.unitPrice)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:600;color:#1a1a1a;text-align:right">${formatFcfa(item.unitPrice * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nouvelle commande ${data.reference}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">

    <!-- Header -->
    <div style="background:#0f2d52;padding:28px 32px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="color:#7eb8e8;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Nouvelle commande</div>
        <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px">${data.reference}</div>
      </div>
      <div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:8px 14px">
        <span style="color:#fbbf24;font-weight:700;font-size:13px">A TRAITER</span>
      </div>
    </div>

    <!-- Client info -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:14px">Informations client</div>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#888;width:120px">Nom</td>
          <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:500">${data.customerName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#888">Telephone</td>
          <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:500">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#888">Adresse</td>
          <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:500">${data.address}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#888">Zone</td>
          <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:500">${data.zoneName}</td>
        </tr>
        ${
          data.notes
            ? `<tr>
          <td style="padding:6px 0;font-size:13px;color:#888">Notes</td>
          <td style="padding:6px 0;font-size:14px;color:#555;font-style:italic">${data.notes}</td>
        </tr>`
            : ""
        }
      </table>
    </div>

    <!-- Items -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:14px">Articles commandes</div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f8f9fa">
            <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;font-weight:600">Produit</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;font-weight:600">Qte</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;font-weight:600">Prix unit.</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;font-weight:600">Total</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="padding:20px 32px;border-bottom:1px solid #f0f0f0">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:5px 0;font-size:14px;color:#555">Sous-total</td>
          <td style="padding:5px 0;font-size:14px;color:#1a1a1a;text-align:right">${formatFcfa(data.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;font-size:14px;color:#555">Livraison (${data.zoneName})</td>
          <td style="padding:5px 0;font-size:14px;color:#1a1a1a;text-align:right">${formatFcfa(data.deliveryFee)}</td>
        </tr>
        <tr>
          <td style="padding:12px 0 5px;font-size:16px;font-weight:700;color:#0f2d52;border-top:2px solid #0f2d52">TOTAL</td>
          <td style="padding:12px 0 5px;font-size:16px;font-weight:700;color:#0f2d52;text-align:right;border-top:2px solid #0f2d52">${formatFcfa(data.total)}</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#f8f9fa;text-align:center">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://topenergiesgroup.com"}/admin/orders"
        style="display:inline-block;background:#0f2d52;color:#fff;font-size:13px;font-weight:600;padding:10px 24px;border-radius:8px;text-decoration:none;letter-spacing:0.3px">
        Voir dans le tableau de bord
      </a>
      <p style="margin:16px 0 0;font-size:12px;color:#aaa">Top Energies Group · Dakar, Senegal</p>
    </div>

  </div>
</body>
</html>`;
}

export async function sendOrderNotification(data: OrderEmailData): Promise<void> {
  const to = process.env.MAIL_NOTIFY_TO ?? process.env.MAIL_USER;
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS || !to) return;

  await transporter.sendMail({
    from: `"Top Energies" <${process.env.MAIL_USER}>`,
    to,
    subject: `[Nouvelle commande] ${data.reference} — ${data.customerName}`,
    html: orderEmailHtml(data),
  });
}
