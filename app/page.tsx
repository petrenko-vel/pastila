import Link from 'next/link';
import Reveal from '../components/Reveal';
import { SHOW_HIDDEN_BLOCKS } from '../lib/flags';
import HeroCarousel from '../components/HeroCarousel';
import { img } from '../lib/base';
import { ArrowIcon, ArrowUpRightIcon } from '../components/Icons';
import { FaqBlock, PaletteBlock, RecentGrid, ReviewsBlock } from '../components/HomeClient';
import { formatPrice, products, Category } from '../lib/products';

const minPrice = (c: Category) => Math.min(...products.filter((p) => p.category === c).map((p) => p.price));

const thought = [
  {
    title: 'Не просто украшение полки',
    text: 'Продумываем не только внешний вид, но и назначение каждого изделия — от формы до удобства использования.',
  },
  { title: 'Цвет — это тоже выбор', text: 'Подбирай оттенок под интерьер, настроение или просто любимый цвет.' },
  {
    title: 'Или создай свою версию',
    text: 'В генераторе можно настроить форму, цвет и размер. Сразу увидеть стоимость и отправить свой вариант в корзину.',
  },
  {
    title: 'Распаковывать тоже приятно',
    text: 'Подбираем оформление, детали и защиту, чтобы заказ выглядел красиво и безопасно добирался до тебя.',
  },
];

type Work = { title: string; sub: string; href: string; cls: string; img?: string; alt?: string; w?: number; h?: number; letters?: boolean };

const works: Work[] = [
  {
    title: 'Воздушные буквы',
    sub: 'Слова и имена из 3D-печати',
    href: '/catalog?cat=letters',
    cls: 'work-img-pink',
    img: '/img/work-letters.webp',
    alt: 'Объёмные разноцветные буквы, сложенные в имя',
    w: 760,
    h: 441,
  },
  {
    title: 'Лампы',
    sub: `Настольные светильники, от ${formatPrice(minPrice('lamp'))}`,
    href: '/catalog?cat=lamp',
    cls: 'work-img-yellow',
    img: '/img/work-lamp.webp',
    alt: 'Оранжевая лампа из трёх колец',
    w: 760,
    h: 441,
  },
  {
    title: 'Вазы и кашпо',
    sub: `Объёмный рельеф, от ${formatPrice(minPrice('vase'))}`,
    href: '/catalog?cat=vase',
    cls: 'work-img-beige',
    img: '/img/work-vase.webp',
    alt: 'Жёлтая ваза с волнистым рельефом',
    w: 760,
    h: 442,
  },
  {
    title: 'Накладки на выключатели и розетки',
    sub: `Яркий декор у выключателя, от ${formatPrice(minPrice('switch'))}`,
    href: '/catalog?cat=switch',
    cls: 'work-img-pink',
    img: '/img/work-switch.webp',
    alt: 'Накладка на выключатель в оранжево-розовую клетку',
    w: 760,
    h: 442,
  },
];

export default function Home() {
  return (
    <>
      <HeroCarousel />

      {/* ЧТО ПЕЧАТАЕМ */}
      <section className="container wide works-wrap" aria-labelledby="works-title">
        <Reveal className="works">
          <svg className="works-flower" viewBox="0 0 100 100" aria-hidden>
            <path
              d="M50 4c6 0 9 8 12 12 4 4 12 3 16 8 4 5 0 12 1 17 1 5 9 9 8 15-2 6-10 6-14 10-3 4-2 12-8 15-5 3-11-2-16-2s-11 5-16 2c-6-3-5-11-8-15-4-4-12-4-14-10-1-6 7-10 8-15 1-5-3-12 1-17 4-5 12-4 16-8 3-4 6-12 12-12z"
              fill="currentColor"
            />
          </svg>

          <div className="works-head">
            <h2 id="works-title">Что печатаем</h2>
            <Link href="/catalog" className="works-all">
              Весь каталог <ArrowIcon size={14} />
            </Link>
          </div>

          <div className="works-grid">
            {works.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <Link href={w.href} className="work-card" aria-label={`${w.title} — перейти в каталог`}>
                  <span className="work-tag">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="work-title">{w.title}</h3>
                  <p className="work-sub">{w.sub}</p>
                  <div className={`work-img ${w.cls}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(w.img!)} alt={w.alt} width={w.w} height={w.h} loading="lazy" decoding="async" />
                  </div>
                  <span className="work-arrow" aria-hidden>
                    <ArrowUpRightIcon size={22} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {SHOW_HIDDEN_BLOCKS && (
        <>
      {/* ПАЛИТРА + 24Ч */}
      <section className="container wide mid">
        <Reveal className="palette-col">
          <h2 className="h-xl">
            Цветовая
            <br />
            палитра
            <br />
            в жизни
          </h2>
          <svg className="squiggle" viewBox="0 0 110 40" aria-hidden>
            <path d="M2 36c28 2 52-6 70-20 10-8 22-10 34-14M96 2l10 1-4 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <p className="palette-q">
            Какой цвет ближе
            <br />
            твоему настроению?
          </p>
          <PaletteBlock />
        </Reveal>
        <Reveal className="palette-photo" delay={100}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img('/img/palette-photo.webp')} alt="Интерьер с вазой и свечой" />
        </Reveal>
        <Reveal className="recent" delay={180}>
          <div className="recent-head">
            <h3>Напечатали за последние 24ч</h3>
            <Link href="/catalog" className="see-all">
              Смотреть все <ArrowIcon size={13} />
            </Link>
          </div>
          <RecentGrid />
        </Reveal>
      </section>

      {/* ГЕНЕРАТОР */}
      <section className="container wide">
        <Reveal className="gen-banner">
          <div className="gen-blob" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img('/img/gen-art.webp')} alt="" className="gen-art" />
          <div className="gen-text">
            <h2>
              Создай свой
              <br />
              уникальный декор
            </h2>
            <p>
              Выбирай форму, цвет и размер —
              <br />а мы напечатаем это для тебя ♡
            </p>
            <Link href="/generator" className="btn btn-brown">
              Перейти к генератору <ArrowIcon />
            </Link>
          </div>
        </Reveal>
      </section>
        </>
      )}

      {/* МЫ ВСЁ ПРОДУМАЛИ */}
      <section className="container wide thought" aria-labelledby="thought-title">
        <Reveal className="thought-head">
          <span className="sticker sticker-l" aria-hidden>
            3D
            <br />
            печать
          </span>
          <h2 id="thought-title">Мы всё продумали до мелочей</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="thought-model" src={img('/img/lamp-shade.webp')} alt="Ребристый плафон лампы" width={389} height={420} loading="lazy" decoding="async" />
        </Reveal>
        <div className="thought-grid">
          {thought.map((t, i) => (
            <Reveal key={t.title} delay={i * 90}>
              <article className={`thought-card tc-${i + 1}`} style={{ backgroundImage: `url(${img(`/img/thought-${[2, 3, 4, 1][i]}.webp`)})` }}>
                <span className="tc-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ОТЗЫВЫ / О НАС / FAQ */}
      <section className={`container wide bottom${SHOW_HIDDEN_BLOCKS ? '' : ' bottom-solo'}`} id="about">
        <Reveal className="bottom-reviews">
          <ReviewsBlock />
        </Reveal>
        {SHOW_HIDDEN_BLOCKS && (
          <>
        <Reveal className="bottom-about" delay={100}>
          <div className="about card-soft">
            <div className="about-text">
              <h2>О нас</h2>
              <p>
                Мы — маленькая студия 3D печати, где рождаются дофаминовое декор ♡
              </p>
              <Link href="/generator" className="link-u">
                Узнать больше <ArrowIcon size={14} />
              </Link>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img('/img/about-printer.webp')} alt="3D принтер" className="about-img" />
          </div>
        </Reveal>
        <Reveal className="bottom-faq" delay={180}>
          <FaqBlock />
        </Reveal>
          </>
        )}
      </section>

      <div className="blob-decor" aria-hidden>
        <svg className="bl bl-green" viewBox="0 0 200 180"><path d="M0 40c40-20 90 10 120 60s60 30 80 80H0z" fill="currentColor" /></svg>
        <svg className="bl bl-pink" viewBox="0 0 280 90"><path d="M0 90c10-40 50-80 110-80 70 0 90 30 170 20v60z" fill="currentColor" /></svg>
      </div>
    </>
  );
}
