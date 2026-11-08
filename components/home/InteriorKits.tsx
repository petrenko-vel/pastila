'use client';

import { useState } from 'react';
import Link from 'next/link';
import Reveal from '../Reveal';
import { useCart } from '../CartProvider';
import { img } from '../../lib/base';
import { formatPrice, palette, products, type Product } from '../../lib/products';
import { kits, type Kit } from '../../lib/home-data';
import './home-blocks.css';

/** Мебель сцены: простые прямоугольники в координатах 100 x 62.5 (сцена 16:10). */
function SceneArt({ k }: { k: string }) {
  const ink = 'var(--bean)';
  const red = 'var(--cinnabar)';
  const cream = 'var(--mimosa)';
  const pink = 'var(--carnation)';
  const sun = 'var(--yellow)';
  return (
    <svg className="kit-art" viewBox="0 0 100 62.5" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {/* пол */}
      <rect x="0" y="56" width="100" height="6.5" fill={ink} opacity=".1" />
      {k === 'desk' && (
        <g>
          <rect x="62" y="6" width="26" height="22" rx="1.5" fill={cream} stroke={ink} strokeWidth=".6" />
          <rect x="74.6" y="6" width=".8" height="22" fill={ink} />
          <rect x="62" y="16.6" width="26" height=".8" fill={ink} />
          <rect x="54" y="28.4" width="26" height="1.2" rx=".6" fill={ink} />
          <rect x="6" y="39.4" width="88" height="2.4" rx="1" fill={red} />
          <rect x="10" y="41.8" width="2.4" height="15" fill={ink} />
          <rect x="87.6" y="41.8" width="2.4" height="15" fill={ink} />
          <rect x="60" y="41.8" width="26" height="9" rx="1" fill={ink} opacity=".12" />
        </g>
      )}
      {k === 'bedroom' && (
        <g>
          <rect x="30" y="14" width="40" height="22" rx="3" fill={cream} stroke={ink} strokeWidth=".6" />
          <rect x="34" y="34" width="32" height="12" rx="1.5" fill={red} />
          <rect x="26" y="40" width="48" height="10" rx="2" fill={cream} stroke={ink} strokeWidth=".6" />
          <rect x="6" y="43.6" width="28" height="1.6" rx=".6" fill={ink} />
          <rect x="8" y="45.2" width="24" height="11" rx="1" fill={sun} stroke={ink} strokeWidth=".5" />
          <rect x="66" y="43.6" width="28" height="1.6" rx=".6" fill={ink} />
          <rect x="68" y="45.2" width="24" height="11" rx="1" fill={sun} stroke={ink} strokeWidth=".5" />
        </g>
      )}
      {k === 'living' && (
        <g>
          <rect x="8" y="26.6" width="64" height="1.4" rx=".6" fill={ink} />
          <rect x="12" y="28" width="1.2" height="5" fill={ink} />
          <rect x="66" y="28" width="1.2" height="5" fill={ink} />
          <rect x="6" y="48.6" width="88" height="1.6" rx=".6" fill={ink} />
          <rect x="8" y="50.2" width="84" height="7" rx="1" fill={red} stroke={ink} strokeWidth=".5" />
          <rect x="80" y="8" width="14" height="18" rx="1" fill={pink} stroke={ink} strokeWidth=".5" />
        </g>
      )}
      {k === 'nook' && (
        <g>
          <rect x="6" y="14" width="26" height="30" rx="1" fill={cream} stroke={ink} strokeWidth=".5" />
          <rect x="9" y="17" width="20" height="24" rx=".6" fill={pink} />
          <rect x="52" y="47.6" width="36" height="1.4" rx=".6" fill={ink} />
          <rect x="54" y="49" width="3" height="8" fill={ink} />
          <rect x="83" y="49" width="3" height="8" fill={ink} />
          <rect x="16" y="47.6" width="24" height="9.4" rx="4" fill={red} stroke={ink} strokeWidth=".5" />
          <rect x="44" y="52" width="46" height="4" rx="2" fill={sun} opacity=".7" />
        </g>
      )}
    </svg>
  );
}

function Scene({ kit, all }: { kit: Kit; all: Record<string, Product> }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className={`kit-scene kit-wall-${kit.wall}`} onMouseLeave={() => setOpen(null)}>
      <SceneArt k={kit.key} />
      {kit.items.map((it, i) => {
        const p = all[it.id];
        if (!p) return null;
        const tipSide = it.x < 30 ? 'l' : it.x > 70 ? 'r' : 'c';
        const flip = it.y > 55 ? 'up' : 'down';
        const isOpen = open === `${it.id}-${i}`;
        return (
          <div
            key={`${it.id}-${i}`}
            className={`kit-spot ${isOpen ? 'open' : ''} kit-tip-${tipSide} kit-tip-${flip}`}
            style={{ left: `${it.x}%`, top: `${it.y}%`, width: `${it.w}%`, transform: `translate(-50%, -50%) rotate(${it.rot ?? 0}deg)` }}
          >
            <button
              type="button"
              className="kit-hot"
              aria-expanded={isOpen}
              aria-label={`${p.title}, ${formatPrice(p.price)}`}
              onClick={() => setOpen(isOpen ? null : `${it.id}-${i}`)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(p.image)} alt="" width={240} height={240} loading="lazy" />
              <span className="kit-pulse" aria-hidden="true" />
            </button>
            <span className="kit-tip" role="tooltip">
              <b>{p.title}</b>
              <span>{p.priceFrom ? 'от ' : ''}{formatPrice(p.price)}</span>
              <Link href={`/product/${p.id}/`} tabIndex={isOpen ? 0 : -1}>Смотреть</Link>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function InteriorKits() {
  const { add } = useCart();
  const [key, setKey] = useState(kits[0].key);
  const [done, setDone] = useState(false);
  const kit = kits.find((k) => k.key === key) ?? kits[0];
  const all: Record<string, Product> = Object.fromEntries(products.map((p) => [p.id, p]));
  const list = kit.items.map((it) => all[it.id]).filter((p): p is Product => !!p);
  const buyable = list.filter((p) => !p.href);
  const total = buyable.reduce((s, p) => s + p.price, 0);
  const color = palette[0];

  const addKit = () => {
    buyable.forEach((p) =>
      add({ id: `${p.id}__${color.key}`, title: p.title, price: p.price, image: img(p.image), note: `Цвет: ${color.name}` })
    );
    setDone(true);
    window.setTimeout(() => setDone(false), 1800);
  };

  return (
    <section className="container wide kit" aria-labelledby="kit-title">
      <Reveal>
        <div className="kit-head">
          <h2 id="kit-title" className="hb-title">Собери пространство с характером</h2>
          <div className="kit-tabs" role="tablist" aria-label="Тип комнаты">
            {kits.map((k) => (
              <button
                key={k.key}
                type="button"
                role="tab"
                id={`kit-tab-${k.key}`}
                aria-selected={k.key === key}
                aria-controls="kit-panel"
                className={`chip ${k.key === key ? 'on' : ''}`}
                onClick={() => setKey(k.key)}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="kit-stage" id="kit-panel" role="tabpanel" aria-labelledby={`kit-tab-${kit.key}`}>
          <Scene key={kit.key} kit={kit} all={all} />
          <aside className="kit-side">
            <p className="kit-tag">{kit.tagline}</p>
            <ul className="kit-list">
              {list.map((p, i) => (
                <li key={`${p.id}-${i}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(p.image)} alt="" width={56} height={56} loading="lazy" />
                  <Link href={`/product/${p.id}/`}>{p.title}</Link>
                  <span>{p.priceFrom ? 'от ' : ''}{formatPrice(p.price)}</span>
                </li>
              ))}
            </ul>
            {buyable.length < list.length && (
              <p className="kit-hint">Буквы собираются отдельно в <Link href="/generator/">генераторе</Link>.</p>
            )}
            <button type="button" className={`kit-add ${done ? 'done' : ''}`} onClick={addKit} disabled={buyable.length === 0}>
              {done ? 'Комплект в корзине' : `Добавить комплект в корзину · ${formatPrice(total)}`}
            </button>
            <p className="kit-hint" aria-live="polite">Цвет по умолчанию: {color.name.toLowerCase()}. Другой цвет выбирается на странице товара.</p>
          </aside>
        </div>
      </Reveal>
    </section>
  );
}
