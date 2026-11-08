'use client';

import Link from 'next/link';
import type { CartItem } from '../CartProvider';
import { img } from '../../lib/base';
import { formatPrice } from '../../lib/products';
import { itemColor, itemHref } from './cart-utils';

export default function CartLine({
  item,
  onQty,
  onRemove,
}: {
  item: CartItem;
  onQty: (q: number) => void;
  onRemove: () => void;
}) {
  const color = itemColor(item);
  const href = itemHref(item);
  const thumb = item.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img(item.image)} alt="" width={96} height={96} loading="lazy" />
  ) : (
    <div className="ct-ph" aria-hidden="true" />
  );

  return (
    <li className="ct-row">
      {href ? (
        <Link href={href} className="ct-thumb" tabIndex={-1} aria-hidden="true">
          {thumb}
        </Link>
      ) : (
        <div className="ct-thumb">{thumb}</div>
      )}
      <div className="ct-info">
        <h3>{href ? <Link href={href}>{item.title}</Link> : item.title}</h3>
        {(item.note || color) && (
          <p className="ct-note-line">
            {color && <span className="ct-dot" style={{ background: color.hex }} aria-hidden="true" />}
            {item.note || `Цвет: ${color?.name}`}
          </p>
        )}
        <p className="ct-unit">{formatPrice(item.price)} за шт.</p>
      </div>
      <div className="ct-qty" role="group" aria-label={`Количество: ${item.title}`}>
        <button type="button" onClick={() => onQty(item.qty - 1)} disabled={item.qty <= 1} aria-label="Уменьшить количество">
          −
        </button>
        <span aria-live="polite">{item.qty}</span>
        <button type="button" onClick={() => onQty(item.qty + 1)} disabled={item.qty >= 99} aria-label="Увеличить количество">
          +
        </button>
      </div>
      <b className="ct-sum">{formatPrice(item.price * item.qty)}</b>
      <button type="button" className="ct-remove" onClick={onRemove} aria-label={`Удалить: ${item.title}`}>
        Удалить
      </button>
    </li>
  );
}
