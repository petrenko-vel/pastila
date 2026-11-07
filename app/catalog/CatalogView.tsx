'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Reveal from '../../components/Reveal';
import { useCart, useFavs } from '../../components/CartProvider';
import { HeartIcon } from '../../components/Icons';
import { categoryNames, Category, formatPrice, palette, products } from '../../lib/products';

const cats: ('all' | Category)[] = ['all', 'switch', 'vase', 'lamp', 'candle'];

export default function CatalogView() {
  const params = useSearchParams();
  const [cat, setCat] = useState<'all' | Category>('all');
  const [color, setColor] = useState<string>('all');
  const [onlyFav, setOnlyFav] = useState(false);
  const [q, setQ] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const { add } = useCart();
  const { favs, toggle } = useFavs();
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    const c = params.get('cat');
    if (c && (cats as string[]).includes(c)) setCat(c as Category);
    const col = params.get('color');
    if (col && palette.some((p) => p.key === col)) setColor(col);
    setOnlyFav(params.get('fav') === '1');
    if (params.get('focus') === 'search') searchRef.current?.focus();
  }, [params]);

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === 'all' || p.category === cat) &&
          (color === 'all' || p.color === color) &&
          (!onlyFav || favs.includes(p.id)) &&
          (!q.trim() || (p.title + ' ' + p.desc).toLowerCase().includes(q.trim().toLowerCase()))
      ),
    [cat, color, onlyFav, q, favs]
  );

  const buy = (id: string) => {
    const p = products.find((x) => x.id === id)!;
    add({ id: p.id, title: p.title, price: p.price, image: p.image });
    setAdded(id);
    setTimeout(() => setAdded((v) => (v === id ? null : v)), 1400);
  };

  return (
    <div className="page container">
      <div className="page-head">
        <h1>Каталог</h1>
        <p>Дофаминовый декор, напечатанный специально для тебя ♡</p>
      </div>

      <div className="toolbar">
        {cats.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
            {c === 'all' ? 'Все' : categoryNames[c]}
          </button>
        ))}
        <button className={`chip ${onlyFav ? 'on' : ''}`} onClick={() => setOnlyFav((v) => !v)}>
          ♡ Избранное
        </button>
        <input
          ref={searchRef}
          className="search-input"
          placeholder="Поиск по каталогу"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="swatches">
        <small>Цвет:</small>
        <button className={`chip ${color === 'all' ? 'on' : ''}`} onClick={() => setColor('all')} style={{ padding: '6px 12px', fontSize: 12 }}>
          Любой
        </button>
        {palette.map((p) => (
          <button
            key={p.key}
            title={p.name}
            aria-label={p.name}
            className={`pdot ${color === p.key ? 'on' : ''}`}
            style={{ background: p.hex }}
            onClick={() => setColor(color === p.key ? 'all' : p.key)}
          />
        ))}
      </div>

      {list.length === 0 ? (
        <p className="empty">Ничего не нашлось — попробуй изменить фильтры ♡</p>
      ) : (
        <div className="grid">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <article className="pcard">
                <div className="pimg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <button className={`heart-mini ${favs.includes(p.id) ? 'on' : ''}`} aria-label="В избранное" onClick={() => toggle(p.id)}>
                    <HeartIcon filled={favs.includes(p.id)} />
                  </button>
                </div>
                <div className="pbody">
                  <small>{categoryNames[p.category]}</small>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="prow">
                    <span className="price">{formatPrice(p.price)}</span>
                    <button className="btn btn-brown btn-sm" onClick={() => buy(p.id)}>
                      {added === p.id ? 'Добавлено ✓' : 'В корзину'}
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
