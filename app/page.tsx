import Link from 'next/link';
import Reveal from '../components/Reveal';
import { ArrowIcon, SunIcon } from '../components/Icons';
import { FaqBlock, PaletteBlock, RecentGrid, ReviewsBlock } from '../components/HomeClient';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-art" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/hero.webp" alt="" />
        </div>
        <div className="container hero-in">
          <h1 className="hero-logo">pastila</h1>
          <p className="hero-title">
            Дофаминовый декор
            <br />
            на 3D печати <span className="sun"><SunIcon /></span>
          </p>
          <p className="hero-sub">
            Яркие детали для уютного дома,
            <br />
            которые хочется рассматривать ♡
          </p>
          <Link href="/catalog" className="btn btn-brown">
            Перейти в каталог <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* КАТЕГОРИИ */}
      <section className="container cats">
        <Reveal>
          <Link href="/catalog?cat=switch" className="cat cat-pink">
            <div className="cat-text">
              <h3>
                Накладки
                <br />
                на выключатели
              </h3>
              <p>
                Маленький
                <br />
                акцент большого
                <br />
                настроения ♡
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/cat-switch.webp" alt="" className="cat-img" />
            <span className="round-arrow"><ArrowIcon size={14} /></span>
          </Link>
        </Reveal>
        <Reveal delay={90}>
          <Link href="/catalog?cat=vase" className="cat cat-beige">
            <div className="cat-text">
              <h3>
                Вазы
                <br />и кашпо
              </h3>
              <p>
                Стильный декор
                <br />
                для твоего
                <br />
                пространства ♡
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/cat-vase.webp" alt="" className="cat-img" />
            <span className="round-arrow"><ArrowIcon size={14} /></span>
          </Link>
        </Reveal>
        <Reveal delay={180}>
          <Link href="/catalog?cat=lamp" className="cat cat-green">
            <div className="cat-text">
              <h3>Лампы</h3>
              <p>
                Атмосферный
                <br />
                свет в самых
                <br />
                необычных формах ♡
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/cat-lamp.webp" alt="" className="cat-img" />
            <span className="round-arrow"><ArrowIcon size={14} /></span>
          </Link>
        </Reveal>
      </section>

      {/* ПАЛИТРА + 24Ч */}
      <section className="container mid">
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
          <img src="/img/palette-photo.webp" alt="Интерьер с вазой и свечой" />
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
      <section className="container">
        <Reveal className="gen-banner">
          <div className="gen-blob" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/gen-art.webp" alt="" className="gen-art" />
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

      {/* ОТЗЫВЫ / О НАС / FAQ */}
      <section className="container bottom" id="about">
        <Reveal className="bottom-reviews">
          <ReviewsBlock />
        </Reveal>
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
            <img src="/img/about-printer.webp" alt="3D принтер" className="about-img" />
          </div>
        </Reveal>
        <Reveal className="bottom-faq" delay={180}>
          <FaqBlock />
        </Reveal>
      </section>

      <div className="blob-decor" aria-hidden>
        <svg className="bl bl-green" viewBox="0 0 200 180"><path d="M0 40c40-20 90 10 120 60s60 30 80 80H0z" fill="currentColor" /></svg>
        <svg className="bl bl-pink" viewBox="0 0 280 90"><path d="M0 90c10-40 50-80 110-80 70 0 90 30 170 20v60z" fill="currentColor" /></svg>
      </div>
    </>
  );
}
