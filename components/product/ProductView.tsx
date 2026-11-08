'use client';

import Link from 'next/link';
import { useState } from 'react';
import Reveal from '../Reveal';
import { useCart, useFavs } from '../CartProvider';
import { ArrowIcon, HeartIcon } from '../Icons';
import { img } from '../../lib/base';
import { categoryNames, formatPrice, palette, products } from '../../lib/products';
import { commonFacts, getDetails } from '../../lib/product-details';
import Gallery from './Gallery';
import ScaleBlock from './ScaleBlock';
import './product.css';

const TBD = 'Уточняется';
const unit = (v: number | null | undefined, u: string) => (typeof v === 'number' ? `${v} ${u}` : TBD);

export default function ProductView({ id }: { id: string }) {
  const product = products.find((p) => p.id === id)!;
  const d = getDetails(id);
  const { add } = useCart();
  const { favs, toggle } = useFavs();
  const [colorKey, setColorKey] = useState(product.color);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const color = palette.find((c) => c.key === colorKey) ?? palette[0];
  const images = [product.image, ...(product.gallery ?? []).filter((g) => g !== product.image)];
  const fav = favs.includes(product.id);
  const related = [
    ...products.filter((p) => p.id !== id && p.category === product.category),
    ...products.filter((p) => p.id !== id && p.category !== product.category),
  ].slice(0, 4);
  const reviews = d.reviews ?? [];
  const hasSizes = [d.heightCm, d.widthCm, d.depthCm, d.weightG].some((v) => typeof v === 'number');

  const buy = () => {
    for (let n = 0; n < qty; n++) {
      add({
        id: `${product.id}__${color.key}`,
        title: product.title,
        price: product.price,
        image: product.image,
        note: `Цвет: ${color.name}`,
      });
    }
    setAdded(true);
  };
  const pick = (k: string) => {
    setColorKey(k);
    setAdded(false);
  };

  const buyControls = product.href ? (
    <Link className="btn btn-brown pd-buy" href={product.href}>
      {product.cta ?? 'Подробнее'} <ArrowIcon size={16} />
    </Link>
  ) : (
    <button type="button" className={`btn btn-brown pd-buy ${added ? 'done' : ''}`} onClick={buy}>
      {added ? 'Добавлено ✓' : 'Добавить в корзину'}
    </button>
  );

  const rows: [string, string][] = [
    ['Высота', unit(d.heightCm, 'см')],
    ['Ширина', unit(d.widthCm, 'см')],
    ['Глубина', unit(d.depthCm, 'см')],
    ['Вес', unit(d.weightG, 'г')],
    ['Материал', d.material ?? 'Пластик, тип уточняется'],
    ['Наличие', d.availability ?? TBD],
    ['Срок изготовления', d.leadTime ?? TBD],
  ];

  return (
    <div className="pd-page">
      <div className="container wide pd-wrap">
        <nav className="pd-crumbs" aria-label="Хлебные крошки">
          <Link href="/catalog/">Каталог</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/catalog/?cat=${product.category}`}>{categoryNames[product.category]}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.title}</span>
        </nav>

        <div className="pd-top">
          <Gallery images={images} title={product.title} />

          <div className="pd-info">
            <small className="pd-cat">{categoryNames[product.category]}</small>
            <h1 className="pd-title">{product.title}</h1>
            <p className="pd-desc">{product.desc}</p>
            <div className="pd-price">
              {product.priceFrom ? 'от ' : ''}
              {formatPrice(product.price)}
            </div>

            {!product.href && (
              <div className="pd-colors">
                <div className="pd-label">
                  Цвет: <b>{color.name}</b>
                </div>
                <div className="pd-colors-row">
                  <span className="pd-big-sw" style={{ background: color.hex }} aria-hidden="true" />
                  <div className="pd-sw-list" role="group" aria-label="Цвет изделия">
                    {palette.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        className={`pd-sw ${c.key === colorKey ? 'on' : ''}`}
                        style={{ background: c.hex }}
                        title={c.name}
                        aria-label={c.name}
                        aria-pressed={c.key === colorKey}
                        onClick={() => pick(c.key)}
                      />
                    ))}
                  </div>
                </div>
                <p className="pd-note">
                  Цвет изделия будет напечатан в выбранном оттенке; на фото показан цвет образца. {color.mood}.
                </p>
              </div>
            )}

            <div className="pd-actions">
              {!product.href && (
                <div className="pd-qty" role="group" aria-label="Количество">
                  <button type="button" aria-label="Уменьшить" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                    −
                  </button>
                  <output aria-live="polite">{qty}</output>
                  <button type="button" aria-label="Увеличить" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                    +
                  </button>
                </div>
              )}
              {buyControls}
              <button
                type="button"
                className={`pd-fav ${fav ? 'on' : ''}`}
                aria-pressed={fav}
                aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
                onClick={() => toggle(product.id)}
              >
                <HeartIcon filled={fav} />
              </button>
            </div>
            <div className="pd-status" aria-live="polite">
              {added && !product.href && (
                <>
                  Товар в корзине.{' '}
                  <Link href="/cart/" className="pd-cartlink">
                    Перейти в корзину <ArrowIcon size={14} />
                  </Link>
                </>
              )}
            </div>

            <ul className="pd-facts">
              {commonFacts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal>
          <section className="pd-block" aria-labelledby="pd-spec-h">
            <h2 id="pd-spec-h" className="pd-h2">Размеры и характеристики</h2>
            {!hasSizes && <p className="pd-muted">Характеристики уточняются, данные будут добавлены.</p>}
            <dl className="pd-spec">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd className={v === TBD ? 'tbd' : ''}>{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>

        {typeof d.heightCm === 'number' && (
          <Reveal>
            <ScaleBlock heightCm={d.heightCm} widthCm={d.widthCm} title={product.title} />
          </Reveal>
        )}

        {(d.interiorImage || d.video) && (
          <Reveal>
            <section className="pd-block" aria-labelledby="pd-media-h">
              <h2 id="pd-media-h" className="pd-h2">В интерьере</h2>
              <div className="pd-media">
                {d.interiorImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(d.interiorImage)} alt={`${product.title} в интерьере`} loading="lazy" />
                )}
                {d.video && <video src={img(d.video)} controls playsInline preload="metadata" aria-label={`Видео: ${product.title}`} />}
              </div>
            </section>
          </Reveal>
        )}

        <Reveal>
          <section className="pd-block" aria-labelledby="pd-tex-h">
            <h2 id="pd-tex-h" className="pd-h2">Фактура поверхности</h2>
            <p className="pd-muted">Увеличенные фрагменты фотографии изделия.</p>
            <div className="pd-tex">
              {['30% 30%', '70% 45%', '50% 80%'].map((pos, n) => (
                <div
                  key={pos}
                  className="pd-tex-i"
                  role="img"
                  aria-label={`${product.title}, увеличенный фрагмент ${n + 1}`}
                  style={{ backgroundImage: `url(${img(product.image)})`, backgroundPosition: pos }}
                />
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="pd-block" aria-labelledby="pd-rev-h">
            <h2 id="pd-rev-h" className="pd-h2">Отзывы покупателей</h2>
            {reviews.length === 0 ? (
              <p className="pd-empty">Отзывов пока нет</p>
            ) : (
              <ul className="pd-reviews">
                {reviews.map((r, n) => (
                  <li key={n}>
                    <b>{r.author}</b>
                    <span aria-label={`Оценка ${r.rating} из 5`}>{'★'.repeat(Math.max(0, Math.min(5, r.rating)))}</span>
                    <p>{r.text}</p>
                    <small>{r.date}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>

        {related.length > 0 && (
          <section className="pd-block" aria-labelledby="pd-rel-h">
            <h2 id="pd-rel-h" className="pd-h2">Сочетается с</h2>
            <div className="pd-related">
              {related.map((p) => (
                <article className="pcard" key={p.id}>
                  <Link className="pimg" href={`/product/${p.id}/`} aria-label={p.title}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(p.image)} alt={p.title} loading="lazy" />
                  </Link>
                  <div className="pbody">
                    <small>{categoryNames[p.category]}</small>
                    <h3>
                      <Link href={`/product/${p.id}/`}>{p.title}</Link>
                    </h3>
                    <div className="prow">
                      <span className="price">
                        {p.priceFrom ? 'от ' : ''}
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="pd-sticky">
        <span className="price">
          {product.priceFrom ? 'от ' : ''}
          {formatPrice(product.price)}
        </span>
        {product.href ? (
          <Link className="btn btn-brown" href={product.href}>
            {product.cta ?? 'Подробнее'}
          </Link>
        ) : (
          <button type="button" className="btn btn-brown" onClick={buy}>
            {added ? 'Добавлено ✓' : 'В корзину'}
          </button>
        )}
      </div>
    </div>
  );
}
