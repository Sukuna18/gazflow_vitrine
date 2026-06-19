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

  await prisma.blogPost.upsert({
    where: { slug: "gestes-securite-bouteille-gaz" },
    update: {},
    create: {
      slug: "gestes-securite-bouteille-gaz",
      title: "Fagaru ci Walum Gaz : Les gestes qui sauvent",
      excerpt: "L'utilisation des bouteilles de gaz est courante dans de nombreux foyers senegalais, mais connaitre les bonnes pratiques de securite peut eviter des accidents graves. Decouvrez les gestes essentiels pour proteger votre famille.",
      category: "Securite",
      published: true,
      publishedAt: new Date("2025-06-01"),
      content: `<p>L'utilisation des bouteilles de gaz et de leurs accessoires est courante dans de nombreux foyers senegalais. Cependant, il est essentiel de connaitre et de mettre en pratique regulierement certaines regles de securite afin d'eviter les accidents potentiellement dangereux pour notre famille et notre entourage.</p>

<h2>1. Choisir et verifier le bec bruleur</h2>
<p>Le bec bruleur est un accessoire central car il permet de fournir une source de chaleur controlee et fiable dans les appareils alimentes au gaz. Assurez-vous de choisir un bruleur de qualite, compatible avec votre bouteille, et verifiez son etat avant chaque utilisation.</p>

<h2>2. Cuisiner dans un environnement bien ventile</h2>
<p>Lorsque vous cuisinez au gaz, assurez-vous de le faire dans un environnement bien ventile. Les fuites de gaz peuvent etre dangereuses si elles s'accumulent dans des espaces confines — meme une petite etincelle ou source de chaleur peut provoquer une explosion. Ouvrez portes et fenetres pour assurer une bonne circulation d'air.</p>

<h2>3. Verifier le flexible regulierement</h2>
<p>Le flexible relie la bouteille a votre appareil de cuisson. Pour garantir votre securite :</p>
<ul>
  <li>Le flexible doit etre monte a fond sur la tetine de la bouteille.</li>
  <li>Testez s'il est bien fixe en tirant legerement dessus.</li>
  <li>Verifiez la date de peremption inscrite sur le flexible et remplacez-le a l'expiration.</li>
</ul>

<h2>4. Eloigner les sources de chaleur de la bouteille</h2>
<p>Evitez de placer des sources de chaleur (comme les fourneaux ou braises) a proximite d'une bouteille de gaz. Une exposition prolongee a une chaleur intense peut provoquer une augmentation de la pression interne de la bouteille, entrainant des fuites voire une explosion.</p>

<h2>5. Comprendre le role du detendeur</h2>
<p>Le detendeur est le maitre de la regulation : il controle la pression du gaz qui sort de la bouteille pour assurer une alimentation sure et constante de votre appareil. Verifiez regulierement son etat et remplacez-le s'il est endommage ou vieilli.</p>

<h2>6. Securiser le transport des bouteilles de gaz</h2>
<p>Lors du transport, manipulez les bouteilles avec precaution — de preference avec des gants. Evitez de les laisser tomber ou de les choquer : cela peut endommager le revetement protecteur et provoquer une corrosion prematuree. Transportez-les toujours en position verticale, dans un espace aere.</p>

<h2>7. Verifier la conformite d'une bouteille avant achat</h2>
<p>Avant d'acheter ou d'accepter une bouteille de gaz, examinez les marquages apposés dessus. Ils indiquent la marque, le poids, et surtout la date de requalification. Une bouteille hors date ne doit pas etre utilisee.</p>

<p><strong>Ces conseils vous ont-ils ete utiles ?</strong> N'hesitez pas a les partager avec vos proches. Chez Top Energies, nous vous livrons votre gaz a domicile en toute securite, a Dakar et en banlieue.</p>`,
    },
  });

  for (const [name, type, image, href, theme, sortOrder] of [
    ["TotalEnergies", "Energie", "/images/partners/totalenergies.png", "https://totalenergies.com/", "light", 0],
    ["Terrou-Bi", "Hotellerie", "/images/partners/terrou-bi.svg", "https://terroubi.com/fr/", "dark", 1],
  ] as const) {
    const existing = await prisma.partner.findFirst({ where: { name } });
    if (!existing) await prisma.partner.create({ data: { name, type, image, href, theme, active: true, sortOrder } });
  }

  const email = (process.env.ADMIN_EMAIL ?? "admin@topenergies.sn").trim().toLowerCase();
  await prisma.admin.upsert({
    where: { email },
    update: { name: "Administrateur principal", active: true, passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "Admin25") },
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
