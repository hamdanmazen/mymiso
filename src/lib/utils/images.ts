export function getProductImageUrl(
  productId: string,
  index: number = 0,
  width: number = 600,
  height: number = 600
): string {
  const seed = `${productId}-${index}`;
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function getProductThumbnailUrl(
  productId: string,
  width: number = 400,
  height: number = 400
): string {
  return getProductImageUrl(productId, 0, width, height);
}

export function getProductImages(
  productId: string,
  existingImages: string[],
  count: number = 5
): string[] {
  if (existingImages.length > 0) return existingImages;
  return Array.from({ length: count }, (_, i) =>
    getProductImageUrl(productId, i)
  );
}

export function getSellerAvatarUrl(sellerId: string): string {
  return `https://picsum.photos/seed/seller-${sellerId}/200/200`;
}

export function getSellerBannerUrl(sellerId: string): string {
  return `https://picsum.photos/seed/banner-${sellerId}/1400/400`;
}
