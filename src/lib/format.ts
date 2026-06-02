export function money(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}
