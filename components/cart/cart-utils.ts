import { palette, products } from '../../lib/products';
import type { CartItem } from '../CartProvider';

export function itemColor(i: CartItem) {
  const key = i.colorKey ?? (i.id.includes('__') ? i.id.split('__')[1] : undefined);
  return key ? palette.find((c) => c.key === key) : undefined;
}

export function itemHref(i: CartItem): string | undefined {
  if (i.href) return i.href;
  const baseId = i.id.split('__')[0];
  return products.some((p) => p.id === baseId) ? `/product/${baseId}/` : undefined;
}
