import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const products = [
  ["butane-6kg", "Bouteille Butane 6 kg", "Bouteilles", "Compacte et facile a transporter pour les petits foyers.", 4500, 42, "6 kg", "/images/topenergies/products/butane-cylinder-6kg-white.png", true],
  ["butane-12kg", "Bouteille Butane 12 kg", "Bouteilles", "Le format familial fiable pour votre cuisine quotidienne.", 8500, 31, "12 kg", "/images/topenergies/products/butane-cylinder-classic.png", true],
  ["butane-compact", "Bouteille Compact", "Bouteilles", "Un format pratique pour les espaces reduits et la mobilite.", 6500, 18, "9 kg", "/images/topenergies/products/butane-cylinder-compact.png", false],
  ["kit-gaz-complet", "Kit gaz complet", "Accessoires", "Flexible, detendeur et accessoires essentiels reunis en un kit.", 12500, 15, null, "/images/topenergies/products/complete-gas-kit.png", true],
  ["rechaud-double", "Rechaud double foyer", "Equipements", "Deux feux solides pour une cuisson simple et efficace.", 18000, 12, null, "/images/topenergies/products/double-burner-cooktop.png", false],
  ["flexible-gaz", "Flexible gaz securise", "Accessoires", "Flexible resistant pour raccorder votre bouteille en confiance.", 3500, 55, null, "/images/topenergies/products/gas-hose-flexible.png", false],
  ["bruleur-large", "Bruleur grand format", "Equipements", "Bruleur robuste adapte aux besoins professionnels.", 9500, 9, null, "/images/topenergies/products/large-burner-head.png", false],
  ["kit-flexible-bruleur", "Kit flexible et bruleur", "Accessoires", "Le necessaire pour remplacer votre installation rapidement.", 7500, 21, null, "/images/topenergies/products/gas-hose-burner-kit.png", false],
] as const;

async function main() {
  for (const [slug, name, category, description, price, stock, weight, image, featured] of products) {
    await prisma.product.upsert({
      where: { slug },
      update: { name, category, description, price, stock, weight, image, featured, active: true },
      create: { slug, name, category, description, price, stock, weight, image, featured, sortOrder: products.findIndex((item) => item[0] === slug) },
    });
  }

  for (const [name, fee, eta] of [
    ["Camberene", 1000, "30 - 45 min"],
    ["Dakar centre", 2000, "45 - 60 min"],
    ["Banlieue Dakar", 3000, "60 - 90 min"],
  ] as const) {
    await prisma.deliveryZone.upsert({ where: { name }, update: { fee, eta }, create: { name, fee, eta } });
  }

  await prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  const email = (process.env.ADMIN_EMAIL ?? "admin@topenergies.sn").trim().toLowerCase();
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name: "Administrateur principal", email, passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "Admin25") },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
