import Image from "next/image";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      className={compact ? "brand-logo compact" : "brand-logo"}
      src="/images/topenergies/logo-top-energies.png"
      alt="Top Energies"
      width={compact ? 104 : 142}
      height={compact ? 80 : 109}
      priority
    />
  );
}
