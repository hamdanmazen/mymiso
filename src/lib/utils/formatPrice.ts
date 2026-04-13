const formatters: Record<string, Intl.NumberFormat> = {};

export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  const key = `${locale}-${currency}`;
  if (!formatters[key]) {
    formatters[key] = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "LBP" ? 0 : 2,
      maximumFractionDigits: currency === "LBP" ? 0 : 2,
    });
  }
  return formatters[key].format(amount);
}

export function getDiscountPercentage(
  price: number,
  compareAtPrice: number
): number {
  if (compareAtPrice <= 0 || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
