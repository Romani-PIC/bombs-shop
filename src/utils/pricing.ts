export function calcDiscount(subtotal: number, hasPreorder: boolean): number {
  let discount = 0;
  if (subtotal >= 250) discount += 5;            // 5% от 250₽
  if (hasPreorder) discount += 5;                // 5% предзаказ
  return Math.round((subtotal * discount) / 100);
}

export function calcTotal(subtotal: number, discount: number): number {
  // 2% начисляется на сумму после скидки
  return Math.round((subtotal - discount) * 1.02);
}

export function isFreeDelivery(subtotal: number): "point" | "anywhere" | "paid" {
  if (subtotal >= 2200) return "anywhere";
  if (subtotal >= 1500) return "point";
  return "paid";
}