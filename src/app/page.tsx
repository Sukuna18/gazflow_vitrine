import { prisma } from "@/lib/prisma";
import Storefront from "@/components/storefront/Storefront";

export const dynamic = "force-dynamic";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://topenergiesgroup.com",
  name: "Top Energies",
  description:
    "Vente et livraison de gaz butane, bouteilles et accessoires a domicile a Dakar et banlieue. Commandez en ligne, paiement a la livraison.",
  url: "https://topenergiesgroup.com",
  telephone: "+221338355409",
  email: "contact@topenergiesgroup.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Camberene Rond Point Case Bi",
    addressLocality: "Dakar",
    addressRegion: "Dakar",
    addressCountry: "SN",
  },
  image: "https://topenergiesgroup.com/images/topenergies/logo-top-energies.png",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "21:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Gaz butane et accessoires",
    itemListElement: [
      {
        "@type": "Offer",
        priceCurrency: "XOF",
        lowPrice: "4500",
        highPrice: "8500",
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Product",
          name: "Gaz butane",
          description:
            "Bouteilles de gaz butane livrees a domicile a Dakar et banlieue",
          category: "Energie domestique",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "XOF",
            lowPrice: "4500",
            highPrice: "8500",
            offerCount: "3",
            availability: "https://schema.org/InStock",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Installation de gaz",
          description: "Installation complete de gaz domestique a Dakar",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Entretien gaz",
          description: "Entretien et maintenance des equipements gaz",
        },
      },
    ],
  },
};

export default async function Home() {
  const [products, zones, settings] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { id: "desc" }] }),
    prisma.deliveryZone.findMany({ orderBy: { fee: "asc" } }),
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Storefront products={products} zones={zones} settings={settings} />
    </>
  );
}
