'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowIcon, HeartIcon, PlusIcon, StarIcon } from './Icons';
import { useFavs } from './CartProvider';
import { palette } from '../lib/products';
import { img } from '../lib/base';

/* ---------- Палитра ---------- */
export function PaletteBlock() {
  const [active, setActive] = useState(0);
  const cur = palette[active];
  return (
    <>
      <div className="palette-dots">
        {palette.map((p, i) => (
          <button
            key={p.key}
            aria-label={p.name}
            title={p.name}
            className={`pdot ${i === active ? 'on' : ''}`}
            style={{ background: p.hex }}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
      <p className="palette-mood" key={cur.key}>
        <b>{cur.name}</b> — {cur.mood}.{' '}
        <Link href={`/catalog?color=${cur.key}`} className="mood-link">
          Смотреть <ArrowIcon size={13} />
        </Link>
      </p>
    </>
  );
}

/* ---------- Напечатали за 24ч ---------- */
const recent = [
  { id: 'vase-wave', img: '/img/thumb-vase.webp', alt: 'Ваза «Волна»' },
  { id: 'switch-flower', img: '/img/thumb-switch.webp', alt: 'Накладка «Цветок»' },
  { id: 'lamp-scallop', img: '/img/lamp-5.webp', alt: 'Лампа «Волна»' },
  { id: 'candle-bubble', img: '/img/thumb-candle.webp', alt: 'Свеча «Бабл»' },
];

export function RecentGrid() {
  const { favs, toggle } = useFavs();
  return (
    <div className="recent-grid">
      {recent.map((r) => (
        <div className="recent-item" key={r.id}>
          <Link href="/catalog" aria-label={r.alt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(r.img)} alt={r.alt} loading="lazy" />
          </Link>
          <button className={`heart-mini ${favs.includes(r.id) ? 'on' : ''}`} aria-label="В избранное" onClick={() => toggle(r.id)}>
            <HeartIcon filled={favs.includes(r.id)} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------- Отзывы ---------- */
const reviews = [
  { text: '«Классный магазин! Декор просто любовь ♡»', name: 'Алина' },
  { text: '«Лампа-грибок теперь главный герой спальни. Свет очень мягкий!»', name: 'Мария' },
  { text: '«Заказала накладки на выключатели — гости спрашивают, где купила.»', name: 'Дарья' },
];

export function ReviewsBlock() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + reviews.length) % reviews.length);
  return (
    <div className="reviews card-soft" id="reviews">
      <h2>Отзывы</h2>
      <div className="rating-row">
        <span className="rating">4.9</span>
        <span className="stars">
          {Array.from({ length: 5 }).map((_, k) => (
            <StarIcon key={k} />
          ))}
        </span>
        <span className="based">на основе 1000+ заказов</span>
      </div>
      <div className="review-body">
        <button className="arrow-btn" aria-label="Назад" onClick={() => go(-1)}>
          <ArrowIcon size={14} />
        </button>
        <div className="review-card" key={i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img('/img/avatar.webp')} alt="" className="avatar" />
          <p>{reviews[i].text}</p>
        </div>
        <button className="arrow-btn flip" aria-label="Дальше" onClick={() => go(1)}>
          <ArrowIcon size={14} />
        </button>
      </div>
    </div>
  );
}

/* ---------- FAQ ---------- */
const faq = [
  { q: 'Из чего печатаем?', a: 'Мы печатаем из PLA и PETG пластика на основе кукурузного крахмала: он безопасный, не имеет резкого запаха и держит цвет.' },
  { q: 'Безопасна ли лампа?', a: 'Да. В лампах используются светодиодные источники, которые почти не нагреваются, а корпус не плавится при обычной эксплуатации.' },
  { q: 'Сколько ждать заказа?', a: 'Обычно 2–4 дня на печать и сборку, плюс доставка. Если нужен срочный заказ, напишите нам.' },
];

export function FaqBlock() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq card-soft" id="faq">
      <h2>FAQ</h2>
      <ul>
        {faq.map((f, k) => (
          <li key={f.q} className={open === k ? 'open' : ''}>
            <button onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k}>
              <span>{f.q}</span>
              <i>
                <PlusIcon />
              </i>
            </button>
            <div className="faq-a">
              <p>{f.a}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
