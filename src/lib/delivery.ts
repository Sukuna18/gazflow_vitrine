export const VEHICLE_DELIVERY_EXTRA_FEE = 1000;

type VehicleDeliveryProduct = {
  slug?: string | null;
  name?: string | null;
  weight?: string | null;
};

type VehicleDeliveryLine<T extends VehicleDeliveryProduct = VehicleDeliveryProduct> = T & {
  quantity: number;
};

const VEHICLE_DELIVERY_PATTERN = /(?:^|[^0-9])(12|32|38)\s*k(?:g)?(?:[^a-z0-9]|$)/;

function normalizeProductText(product: VehicleDeliveryProduct) {
  return `${product.slug ?? ""} ${product.name ?? ""} ${product.weight ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function requiresVehicleDelivery(product: VehicleDeliveryProduct) {
  return VEHICLE_DELIVERY_PATTERN.test(normalizeProductText(product));
}

export function vehicleDeliveryExtraFee(product: VehicleDeliveryProduct, quantity: number) {
  return requiresVehicleDelivery(product) ? VEHICLE_DELIVERY_EXTRA_FEE * quantity : 0;
}

export function vehicleDeliveryExtraTotal(lines: VehicleDeliveryLine[]) {
  return lines.reduce((sum, line) => sum + vehicleDeliveryExtraFee(line, line.quantity), 0);
}
