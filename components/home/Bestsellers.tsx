'use client';

import { useState } from 'react';
import Link from 'next/link';
import Reveal from '../Reveal';
import { useCart, useFavs } from '../CartProvider';
import { ArrowIcon, HeartIcon, PlusIcon } from '../Icons';
import { img } from '../../lib/base';
import { formatPrice, palette, products, type Product } from '../../lib/products';
import { bestsellerIds } from '../../lib/home-data';
import ColorDots from './ColorDots';
import './home-blocks.css';

function BsCard({ p, big }: { p: Product; big: boolean }) {
  const { add } = useCart();
  const { favs, toggle } = useFavs();
  const [color, setColor] = useState(palette[0].key);
  const [done, setDone] = useState(false);
  const c = palette.find((x) => x.key === color) ?? palette[0];
  const fav = favs.includes(p.id);

  const onAdd = () => {
    add({ id: `${p.id}__${c.key}`, title: p.title, price: p.price, image: img(p.image), note: `Цвет: ${c.name}` });
    setDone(true);
    window.setTimeout(() => setDone(false), 1600);
  };

  return (
    <article className={`bs-card ${big ? 'bs-big' : ''}`}>
      <Link href={`/product/${p.id}/`} className="bs-photo" aria-label={p.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(p.image)} alt={p.title} width={big ? 720 : 400} height={big ? 720 : 400} loading="lazy" />
      </Link>
      <button
        type="button"
        className={`bs-fav ${fav ? 'on' : ''}`}
        aria-pressed={fav}
        aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
        onClick={() => toggle(p.id)}
      >
        <HeartIcon filled={fav} />
      </button>
      <div className="bs-body">
        <h3 className="bs-name">
          <Link href={`/product/${p.id}/`}>{p.title}</Link>
        </h3>
        {big && <p className="bs-desc">{p.desc}</p>}
        <div className="bs-price">
          {p.priceFrom ? 'от ' : ''}
          {formatPrice(p.price)}
        </div>
        {!p.href && (
          <div className="bs-colors">
            <ColorDots value={color} onChange={setColor} label={`Цвет изделия «${p.title}»`} />
            <span className="bs-colorname" aria-live="polite">{c.name}</span>
          </div>
        )}
        {p.href ? (
          <Link href={p.href} className="bs-add">
            {p.cta ?? 'Подробнее'} <ArrowIcon size={14} />
          </Link>
        ) : (
          <button type="button" className={`bs-add ${done ? 'done' : ''}`} onClick={onAdd}>
            {done ? 'Добавлено' : (<><PlusIcon /> В корзину</>)}
          </button>
        )}
      </div>
    </article>
  );
}

export default function Bestsellers() {
  const list = bestsellerIds.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);
  return (
    <section className="container wide bs" aria-labelledby="bs-title">
      <Reveal>
        <div className="hb-head">
          <h2 id="bs-title" className="hb-title">Предметы, которые выбирают чаще всего</h2>
          <Link href="/catalog/" className="hb-link">
            Весь каталог <ArrowIcon size={14} />
          </Link>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="bs-grid">
          {list.map((p, i) => (
            <BsCard key={p.id} p={p} big={i === 0} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
