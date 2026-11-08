'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart, useFavs } from '../../components/CartProvider';
import { ArrowIcon, HeartIcon } from '../../components/Icons';
import { img } from '../../lib/base';
import { categoryNames, formatPrice, palette, Product } from '../../lib/products';

const SHORT = 5;

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const { favs, toggle } = useFavs();
  const [colorKey, setColorKey] = useState(palette[0].key);
  const [all, setAll] = useState(false);
  const [added, setAdded] = useState(false);

  const color = palette.find((c) => c.key === colorKey) ?? palette[0];
  const idx = palette.findIndex((c) => c.key === colorKey);
  // в свёрнутом виде: первые 5 цветов, а выбранный из «хвоста» занимает последнее место
  const shown = all
    ? palette
    : idx >= SHORT
    ? [...palette.slice(0, SHORT - 1), palette[idx]]
    : palette.slice(0, SHORT);
  const hidden = palette.length - SHORT;
  const href = `/product/${p.id}/`;
  const fav = favs.includes(p.id);

  const buy = () => {
    add({ id: `${p.id}__${color.key}`, title: p.title, price: p.price, image: p.image, note: `Цвет: ${color.name}` });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="pcard">
      <div className="pimg">
        <Link href={href} className="cg-imglink" aria-label={`${p.title}: подробнее`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(p.image)} alt={p.title} loading="lazy" />
        </Link>
        <button className={`heart-mini ${fav ? 'on' : ''}`} aria-label={fav ? 'Убрать из избранного' : 'В избранное'} aria-pressed={fav} onClick={() => toggle(p.id)}>
          <HeartIcon filled={fav} />
        </button>
      </div>
      <div className="pbody">
        <small>{categoryNames[p.category]}</small>
        <h3>
          <Link href={href} className="cg-titlelink">{p.title}</Link>
        </h3>
        <p>{p.desc}</p>

        {!p.href && (
          <div className="cg-colors" role="group" aria-label={`Цвет: ${color.name}`}>
            {shown.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`pdot cg-dot ${c.key === colorKey ? 'on' : ''}`}
                style={{ background: c.hex }}
                title={c.name}
                aria-label={c.name}
                aria-pressed={c.key === colorKey}
                onClick={() => setColorKey(c.key)}
              />
            ))}
            <button
              type="button"
              className="cg-more"
              aria-expanded={all}
              aria-label={all ? 'Свернуть цвета' : `Ещё ${hidden} цветов`}
              onClick={() => setAll((v) => !v)}
            >
              {all ? '−' : `+${hidden}`}
            </button>
          </div>
        )}

        <div className={`prow${p.href ? ' prow-stack' : ''}`}>
          <span className="price">{p.priceFrom ? 'от ' : ''}{formatPrice(p.price)}</span>
          {p.href ? (
            <Link className="btn btn-brown btn-sm" href={p.href}>
              {p.cta ?? 'Подробнее'} <ArrowIcon size={15} />
            </Link>
          ) : (
            <button className="btn btn-brown btn-sm" onClick={buy}>
              {added ? 'Добавлено ✓' : 'В корзину'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
