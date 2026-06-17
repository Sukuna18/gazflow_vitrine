import Image from "next/image";

export default function BrandLogo({ compact = false, clean = false }: { compact?: boolean; clean?: boolean }) {
  return (
    <Image
      className={compact ? "brand-logo compact" : "brand-logo"}
      src={clean ? "/images/topenergies/logo-clean.png" : "/images/topenergies/logo-top-energies.png"}
      alt="Top Energies"
      width={compact ? 104 : 142}
      height={compact ? 80 : 109}
      priority
    />
  );
}
