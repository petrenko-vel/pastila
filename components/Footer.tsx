import Link from 'next/link';
import { ArrowIcon, SunIcon } from './Icons';
import LampViewer from './LampViewer';
import { img } from '../lib/base';
import { categoryNames } from '../lib/products';
import { collections } from '../lib/collections';
import { siteConfig } from '../lib/site-config';
import './home/story-blocks.css';
import type { Category } from '../lib/products';

const allSections = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/generator', label: 'Генератор' },
  { href: '/about', label: 'О студии' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#reviews', label: 'Отзывы' },
  { href: '/cart', label: 'Корзина' },
];

const sections = allSections;

const docs = [
  { href: '/privacy', label: 'Политика конфиденциальности' },
  { href: '/offer', label: 'Публичная оферта' },
  { href: '/agreement', label: 'Пользовательское соглашение' },
  { href: '/delivery', label: 'Доставка и оплата' },
  { href: '/returns', label: 'Возврат и обмен' },
];

const cats: Category[] = ['lamp', 'shade', 'vase', 'switch', 'letters', 'other'];
const ticker = ['Вазы', 'Лампы', 'Буквы', 'Накладки', 'Плафоны', '3D-печать'];

export default function Footer() {
  const year = new Date().getFullYear();
  const email = siteConfig.email.trim();
  const phone = siteConfig.phone.trim();
  const address = siteConfig.address.trim();
  const socials = siteConfig.socials.filter((s) => s.label.trim() && s.href.trim());
  const hasContacts = Boolean(email || phone || address || socials.length);
  return (
    <footer className="footer">
      <div className="foot-marquee" aria-hidden>
        <div className="foot-track">
          {[0, 1].map((n) => (
            <div className="foot-set" key={n}>
              {ticker.map((t) => (
                <span key={t}>
                  {t}
                  <i>
                    <SunIcon />
                  </i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="foot-wrap">
        <div className="foot-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="foot-flower" src={img('/img/foot-flower.webp')} alt="" aria-hidden width={640} height={738} loading="lazy" decoding="async" />
          <div className="foot-top foot-top-x">
            <nav className="foot-col" aria-label="Разделы сайта">
              <h3>Разделы</h3>
              <ul>
                {sections.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href}>{s.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="foot-col" aria-label="Категории каталога">
              <h3>Каталог</h3>
              <ul>
                {cats.map((c) => (
                  <li key={c}>
                    <Link href={`/catalog?cat=${c}`}>{categoryNames[c]}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="foot-col" aria-label="Коллекции">
              <h3>Коллекции</h3>
              <ul>
                {collections.map((c) =>
                  c.status === 'coming-soon' ? (
                    <li key={c.slug} className="foot-x-soon">
                      {c.title}
                      <em>скоро</em>
                    </li>
                  ) : (
                    <li key={c.slug}>
                      <Link href={`/catalog/?collection=${c.slug}`}>{c.title}</Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className="foot-side">
              <div className="foot-cta">
                <p>Придумай свой декор: выбери форму, цвет и размер, цена посчитается сразу.</p>
                <div className="foot-pills">
                  <Link href="/generator" className="foot-pill foot-pill-orange">
                    Создать свой
                    <span className="pill-ic">
                      <ArrowIcon size={14} />
                    </span>
                  </Link>
                  <Link href="/catalog" className="foot-pill foot-pill-pink">
                    В каталог
                    <span className="pill-ic">
                      <ArrowIcon size={14} />
                    </span>
                  </Link>
                </div>
              </div>

              {hasContacts && (
                <div className="foot-contacts" aria-label="Контакты">
                  <ul className="foot-x-contacts">
                    {email && (
                      <li>
                        <a href={`mailto:${email}`}>{email}</a>
                      </li>
                    )}
                    {phone && (
                      <li>
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
                      </li>
                    )}
                    {address && <li>{address}</li>}
                  </ul>
                  {socials.length > 0 && (
                    <div className="foot-x-socials">
                      {socials.map((s) => (
                        <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                          {s.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <nav className="foot-legal" aria-label="Документы">
                <span>© {year} pastila. Студия 3D-печати</span>
                {docs.map((d) => (
                  <Link key={d.href} href={d.href}>
                    {d.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="foot-logo">
            <div className="foot-word" aria-hidden>
              pastila
            </div>
            <div className="foot-lamp">
              <LampViewer color="#ff9d58" spin={1} glow={0.22} tilt={20} lean={16} interactive={false} />
            </div>
          </div>
        </div>
      </div>

      <div className="foot-up-row">
        <Link href="#top" className="foot-up">
          Наверх <span aria-hidden>↑</span>
        </Link>
      </div>
    </footer>
  );
}
