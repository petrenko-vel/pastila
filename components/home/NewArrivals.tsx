'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Reveal from '../Reveal';
import { useCart } from '../CartProvider';
import { ArrowIcon, PlusIcon } from '../Icons';
import { img } from '../../lib/base';
import { formatPrice, palette, products } from '../../lib/products';
import { newArrivals, newStatusLabel } from '../../lib/home-data';
import ColorDots from './ColorDots';
import './home-blocks.css';

function NaCard({ id, status, note }: (typeof newArrivals)[number]) {
  const { add } = useCart();
  const [color, setColor] = useState(palette[0].key);
  const [done, setDone] = useState(false);
  const p = products.find((x) => x.id === id);
  if (!p) return null;
  const c = palette.find((x) => x.key === color) ?? palette[0];

  const onAdd = () => {
    add({ id: `${p.id}__${c.key}`, title: p.title, price: p.price, image: img(p.image), note: `Цвет: ${c.name}` });
    setDone(true);
    window.setTimeout(() => setDone(false), 1600);
  };

  return (
    <article className={`na-card na-${status}`}>
      <Link href={`/product/${p.id}/`} className="na-photo" aria-label={p.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(p.image)} alt={p.title} width={480} height={600} loading="lazy" />
        <span className="na-badge">{newStatusLabel[status]}</span>
      </Link>
      <div className="na-body">
        <h3 className="na-name">
          <Link href={`/product/${p.id}/`}>{p.title}</Link>
        </h3>
        <p className="na-note">{note}</p>
        {status === 'soon' ? (
          <p className="na-soon">Скоро в продаже. Следите за обновлениями.</p>
        ) : (
          <>
            <div className="na-row">
              <span className="na-price">{formatPrice(p.price)}</span>
              <ColorDots value={color} onChange={setColor} label={`Цвет изделия «${p.title}»`} className="hb-dots-sm" />
            </div>
            <button type="button" className={`na-add ${done ? 'done' : ''}`} onClick={onAdd}>
              {done ? 'Добавлено' : (<><PlusIcon /> В корзину, {c.name.toLowerCase()}</>)}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function NewArrivals() {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section className="container wide na" aria-labelledby="na-title">
      <Reveal>
        <div className="na-panel">
          <div className="na-top">
            <div>
              <p className="hb-eyebrow">Новые изделия, небольшие партии, эксперименты</p>
              <h2 id="na-title" className="hb-title">Только что из мастерской</h2>
            </div>
            <div className="na-arrows">
              <button type="button" className="na-arrow" aria-label="Назад" onClick={() => scroll(-1)}>
                <span className="na-flip"><ArrowIcon /></span>
              </button>
              <button type="button" className="na-arrow" aria-label="Вперёд" onClick={() => scroll(1)}>
                <ArrowIcon />
              </button>
            </div>
          </div>
          <div className="na-track" ref={track} tabIndex={0} role="group" aria-label="Свежие поступления, прокручиваемая лента">
            {newArrivals.map((n) => (
              <NaCard key={n.id} {...n} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
