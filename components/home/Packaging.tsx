import Link from 'next/link';
import Reveal from '../Reveal';
import { ArrowIcon } from '../Icons';
import { img } from '../../lib/base';
import { packaging } from '../../lib/home-data';
import './home-blocks.css';

/** Нарисованная композиция: коробка, лента, открытка. Это иллюстрация, а не фото упаковки. */
function BoxArt() {
  return (
    <svg className="pack-svg" viewBox="0 0 400 340" role="img" aria-label="Иллюстрация: коробка с лентой и открыткой">
      <ellipse cx="200" cy="312" rx="150" ry="14" fill="#1e1e1e" opacity=".12" />
      {/* открытка */}
      <g transform="rotate(8 300 150)">
        <rect x="236" y="70" width="120" height="150" rx="10" fill="#f7f4da" stroke="#1e1e1e" strokeWidth="3" />
        <text x="296" y="132" textAnchor="middle" fontSize="30" fill="#f0592e" style={{ fontFamily: 'var(--hc-font-note), cursive' }}>для тебя</text>
        <path d="M262 160c12 12 24 12 36 0s24-12 36 0" fill="none" stroke="#1e1e1e" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* коробка */}
      <rect x="50" y="150" width="240" height="150" rx="16" fill="#f0592e" stroke="#1e1e1e" strokeWidth="3" />
      <rect x="36" y="112" width="268" height="50" rx="14" fill="#ffa6c2" stroke="#1e1e1e" strokeWidth="3" />
      <rect x="154" y="112" width="32" height="188" fill="#f7d943" stroke="#1e1e1e" strokeWidth="3" />
      {/* бант */}
      <path d="M170 112c-30-50-80-40-62-6 12 22 46 12 62 6z" fill="#f7d943" stroke="#1e1e1e" strokeWidth="3" strokeLinejoin="round" />
      <path d="M170 112c30-50 80-40 62-6-12 22-46 12-62 6z" fill="#f7d943" stroke="#1e1e1e" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="170" cy="112" r="11" fill="#f7d943" stroke="#1e1e1e" strokeWidth="3" />
      {/* бирка */}
      <rect x="86" y="196" width="52" height="30" rx="15" fill="#f7f4da" stroke="#1e1e1e" strokeWidth="3" />
      <text x="112" y="217" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1e1e1e" style={{ fontFamily: 'var(--font-logo), sans-serif' }}>pastila</text>
    </svg>
  );
}

export default function Packaging() {
  return (
    <section className="container wide pack" aria-labelledby="pack-title">
      <Reveal>
        <div className="pack-panel">
          <div className="pack-art">
            {packaging.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img(packaging.photo)} alt="Фирменная упаковка Pastila" width={640} height={560} loading="lazy" />
            ) : (
              <BoxArt />
            )}
          </div>
          <div className="pack-main">
            <h2 id="pack-title" className="hb-title">Красиво начинается ещё до распаковки</h2>
            <ul className="pack-list">
              {packaging.items.map((it) => (
                <li key={it.key} className={`pack-item pack-${it.key}`}>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                  {it.href && (
                    <Link href={it.href} className="hb-link">
                      Доставка и оплата <ArrowIcon size={14} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
