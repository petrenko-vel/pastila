'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Reveal from '../../components/Reveal';
import { useFavs } from '../../components/CartProvider';
import { FilterIcon } from '../../components/Icons';
import { categoryNames, Category, palette, products } from '../../lib/products';
import { collections } from '../../lib/collections';
import ProductCard from './ProductCard';
import './catalog.css';

type Sort = 'default' | 'price-asc' | 'price-desc' | 'title';
const sortLabels: Record<Sort, string> = {
  default: 'По умолчанию',
  'price-asc': 'Цена: по возрастанию',
  'price-desc': 'Цена: по убыванию',
  title: 'По названию',
};

const cats: ('all' | Category)[] = ['all', 'lamp', 'shade', 'vase', 'switch', 'letters', 'other'];

export default function CatalogView() {
  const params = useSearchParams();
  const [cat, setCat] = useState<'all' | Category>('all');
  const [color, setColor] = useState<string>('all');
  const [onlyFav, setOnlyFav] = useState(false);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { favs } = useFavs();
  const [sort, setSort] = useState<Sort>('default');
  const [collectionSlug, setCollectionSlug] = useState<string | null>(null);
  const collection = collections.find((c) => c.slug === collectionSlug) ?? null;

  useEffect(() => {
    const c = params.get('cat');
    setCat(c && (cats as string[]).includes(c) ? (c as Category) : 'all');
    const col = params.get('color');
    setColor(col && palette.some((p) => p.key === col) ? col : 'all');
    const cl = params.get('collection');
    setCollectionSlug(cl && collections.some((x) => x.slug === cl) ? cl : null);
    setOnlyFav(params.get('fav') === '1');
    // ссылки с готовым цветом или избранным сразу раскрывают панель фильтров
    if (params.get('fav') === '1' || (col && palette.some((p) => p.key === col))) setOpen(true);
    if (params.get('focus') === 'search') searchRef.current?.focus();
  }, [params]);

  const list = useMemo(() => {
    const filtered = products.filter(
        (p) =>
          (!collection || collection.productIds.includes(p.id)) &&
          (cat === 'all' || p.category === cat) &&
          (color === 'all' || p.color === color) &&
          (!onlyFav || favs.includes(p.id)) &&
          (!q.trim() || (p.title + ' ' + p.desc).toLowerCase().includes(q.trim().toLowerCase()))
      );
    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === 'title') return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    return filtered;
  }, [cat, color, onlyFav, q, favs, sort, collection]);

  return (
    <div className="catalog-page">
    <div className="page container">
      <div className="page-head">
        <h1>Каталог</h1>
        <p>Дофаминовый декор, напечатанный специально для тебя ♡</p>
      </div>

      <div className="toolbar">
        <div className="tabs" role="tablist" aria-label="Категории">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
              {c === 'all' ? 'Все' : categoryNames[c]}
            </button>
          ))}
        </div>
        <div className="toolbar-tools">
          <button
            className={`filters-btn ${open ? 'on' : ''}`}
            aria-expanded={open}
            aria-controls="filters-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <FilterIcon /> Фильтры
            {(color !== 'all' ? 1 : 0) + (onlyFav ? 1 : 0) > 0 && <span className="filters-count">{(color !== 'all' ? 1 : 0) + (onlyFav ? 1 : 0)}</span>}
          </button>
          <div className="cg-sortwrap">
            <select className="cg-select" aria-label="Сортировка" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {(Object.keys(sortLabels) as Sort[]).map((k) => (
                <option key={k} value={k}>
                  {sortLabels[k]}
                </option>
              ))}
            </select>
          </div>
          <input
            ref={searchRef}
            aria-label="Поиск по каталогу"
            className="search-input"
            placeholder="Поиск по каталогу"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {collection && (
        <div className="cg-collection">
          <span>
            Коллекция: <b>{collection.title}</b>
          </span>
          <button type="button" onClick={() => setCollectionSlug(null)}>
            Сбросить
          </button>
        </div>
      )}

      {open && (
        <div className="filters-panel" id="filters-panel">
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
          <button className={`chip ${onlyFav ? 'on' : ''}`} onClick={() => setOnlyFav((v) => !v)}>
            ♡ Только избранное
          </button>
          {(color !== 'all' || onlyFav) && (
            <button
              className="filters-reset"
              onClick={() => {
                setColor('all');
                setOnlyFav(false);
              }}
            >
              Сбросить
            </button>
          )}
        </div>
      )}

      {list.length === 0 ? (
        <div className="empty">
          <p>
            {cat !== 'all' && color === 'all' && !onlyFav && !q.trim() && !collection
              ? 'В этой категории пока нет изделий ♡'
              : 'Ничего не нашлось — попробуй изменить фильтры ♡'}
          </p>
          <button
            type="button"
            className="btn btn-brown btn-sm"
            style={{ marginTop: 16 }}
            onClick={() => {
              setCat('all');
              setColor('all');
              setOnlyFav(false);
              setQ('');
              setCollectionSlug(null);
            }}
          >
            Показать все
          </button>
        </div>
      ) : (
        <div className="grid">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
