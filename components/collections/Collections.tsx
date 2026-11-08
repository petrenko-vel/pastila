import Link from 'next/link';
import Reveal from '../Reveal';
import { ArrowUpRightIcon } from '../Icons';
import { collections, type Collection, type CollectionStatus } from '../../lib/collections';
import { products } from '../../lib/products';
import { img } from '../../lib/base';
import './collections.css';

const statusLabel: Record<CollectionStatus, string> = {
  concept: 'Концепция',
  available: 'В каталоге',
  'coming-soon': 'Скоро',
};

const MAX_PICS = 3;

/** Изображения для обложки: cover или фото товаров коллекции (по productIds). */
function coverImages(c: Collection): string[] {
  if (c.cover) return [c.cover];
  return c.productIds
    .map((id) => products.find((p) => p.id === id)?.image)
    .filter((src): src is string => Boolean(src))
    .slice(0, MAX_PICS);
}

function Poster({ c, index }: { c: Collection; index: number }) {
  const pics = coverImages(c);
  const soon = c.status === 'coming-soon';
  const num = String(index + 1).padStart(2, '0');

  const body = (
    <>
      <div className="col-top">
        <span className="col-num" aria-hidden="true">
          {num}
        </span>
        <span className={`col-badge col-badge-${c.status}`}>{statusLabel[c.status]}</span>
      </div>

      <div className={`col-art col-art-${pics.length}${c.cover ? ' col-art-cover' : ''}`} aria-hidden="true">
        {pics.length === 0 ? (
          <>
            <span className="col-blob col-blob-1" />
            <span className="col-blob col-blob-2" />
            <span className="col-blob col-blob-3" />
          </>
        ) : (
          pics.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src + i} className={`col-pic col-pic-${i + 1}`} src={img(src)} alt="" width={320} height={320} loading="lazy" />
          ))
        )}
      </div>

      <div className="col-text">
        <h3 className="col-name">{c.title}</h3>
        <p className="col-tagline">{c.tagline}</p>
        <p className="col-desc">{c.description}</p>
        {soon ? (
          <p className="col-soon">Коллекция готовится, следите за обновлениями</p>
        ) : (
          <span className="col-go">К товарам коллекции</span>
        )}
      </div>

      {!soon && (
        <span className="col-arrow" aria-hidden="true">
          <ArrowUpRightIcon size={20} />
        </span>
      )}
    </>
  );

  const cls = `col-poster col-tone-${c.tone}${soon ? ' is-soon' : ''}`;

  return soon ? (
    <article className={cls} aria-label={`${c.title}: ${statusLabel[c.status].toLowerCase()}`}>
      {body}
    </article>
  ) : (
    <Link href={`/catalog/?collection=${c.slug}`} className={cls} aria-label={`${c.title}. ${c.tagline}. Перейти к товарам коллекции`}>
      {body}
    </Link>
  );
}

export default function Collections() {
  return (
    <section className="container wide col-wrap" aria-labelledby="col-title">
      <Reveal className="col-head">
        <div>
          <p className="col-eyebrow">Эстетика Pastila</p>
          <h2 id="col-title" className="col-title">
            Коллекции Pastila
          </h2>
        </div>
        <p className="col-lead">
          Пока это концепции: формы и цвета, над которыми студия работает. Из них вырастают изделия и новые серии.
        </p>
      </Reveal>

      <ul className="col-grid">
        {collections.map((c, i) => (
          <li key={c.slug} className="col-item">
            <Reveal className="col-reveal" delay={(i % 2) * 90}>
              <Poster c={c} index={i} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
