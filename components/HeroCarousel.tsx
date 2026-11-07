'use client';

import { Caveat, Inter, Inter_Tight } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from './CartProvider';
import { img } from '../lib/base';
import { SHOW_HIDDEN_BLOCKS } from '../lib/flags';
import './hero-carousel.css';

const interTight = Inter_Tight({ subsets: ['latin', 'cyrillic'], weight: ['700'], variable: '--hc-font-head', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600'], variable: '--hc-font-ui', display: 'swap' });
const caveat = Caveat({ subsets: ['latin', 'cyrillic'], weight: ['600'], variable: '--hc-font-note', display: 'swap' });

const POSTER = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b7ebb74a-8c8a-4f7e-8f80-55e2d74ecd05.webp';
const VIDEO = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/04fd3d5f-99d7-476e-98a4-46c08518ffb3.mp4';

// Две карточки показывают свои ролики целиком (cover). Остальные восемь берут плитки общего видео, как раньше.
const CUSTOM: Record<number, { video: string; poster: string }> = {
  2: { video: '/videos/hero-1.mp4', poster: '/img/hero-video-1.webp' },
  7: { video: '/videos/hero-2.mp4', poster: '/img/hero-video-2.webp' },
  9: { video: '/videos/hero-lamp.mp4', poster: '/img/hero-video-lamp.webp' }, // вращающаяся лампа вместо наушников
};

const N = 10; // карточек
const PITCH = 196; // шаг между центрами, u
const LOOP = N * PITCH;
const SPEED = 50; // u/сек, справа налево
const TILE_RATIO = 384 / 540; // 0.7111
const TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // кроссфейд по сетке 5×2, строка за строкой

type Pt = [number, number];

/** скруглённый четырёхугольник для clip-path: path() */
function roundedQuad(p: Pt[], r: number) {
  const a: Pt[] = [];
  const b: Pt[] = [];
  for (let i = 0; i < 4; i++) {
    const cur = p[i];
    const prev = p[(i + 3) % 4];
    const next = p[(i + 1) % 4];
    const dp = Math.hypot(prev[0] - cur[0], prev[1] - cur[1]) || 1;
    const dn = Math.hypot(next[0] - cur[0], next[1] - cur[1]) || 1;
    const rr = Math.min(r, dp / 2, dn / 2);
    a.push([cur[0] + ((prev[0] - cur[0]) / dp) * rr, cur[1] + ((prev[1] - cur[1]) / dp) * rr]);
    b.push([cur[0] + ((next[0] - cur[0]) / dn) * rr, cur[1] + ((next[1] - cur[1]) / dn) * rr]);
  }
  const f = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  let d = `M${f(b[0])}`;
  for (let i = 1; i <= 4; i++) {
    const k = i % 4;
    d += ` L${f(a[k])} Q${f(p[k])} ${f(b[k])}`;
  }
  return d + ' Z';
}

export default function HeroCarousel() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const posterRefs = useRef<(HTMLImageElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current!;
    const layer = layerRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mqPhone = window.matchMedia('(max-width: 820px)');

    let visible = false;
    let entered = false;
    let raf = 0;
    let s = 0; // позиция прокрутки, u
    let vx = 0; // добавочная скорость после броска, u/сек
    let last = 0;
    let lastSync = 0;
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let dragV = 0;

    // часы на Web Animations: прокрутка зависит от времени, а не от числа кадров
    const clock = document.documentElement.animate([], { duration: 1e9 });
    const nowMs = () => Number(clock.currentTime ?? performance.now());

    const render = () => {
      const phone = mqPhone.matches;
      const W = layer.clientWidth;
      const H = layer.clientHeight;
      const frameW = frameRef.current?.clientWidth ?? W;
      const k = phone ? W / 640 : frameW / 1440; // px в одной u
      const unitsW = W / k;
      const cx = unitsW / 2;
      // на широких экранах кривизна растёт вместе с шириной, края остаются как в макете
      const norm = phone ? 706 * (640 / 1440) : Math.max(706, cx);
      const cy0 = phone ? H / k / 2 + 6 : 687;
      const r = 15 * k;

      for (let i = 0; i < N; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        let t = (((i * PITCH - s) % LOOP) + LOOP) % LOOP;
        if (t > LOOP / 2) t -= LOOP;
        const x = cx + t * (1 + 0.083 * Math.pow(t / norm, 2));
        const d = Math.abs(x - cx) / norm;
        const w = 170 + 48 * d * d;
        const xl = x - w / 2;
        const xr = x + w / 2;
        const edgeH = (xe: number) => 280 + 92 * Math.pow(Math.abs(xe - cx) / norm, 2.6);
        const hl = edgeH(xl);
        const hr = edgeH(xr);
        const cy = cy0 - 12 * d * d;

        const pts: Pt[] = [
          [xl * k, (cy - hl / 2) * k],
          [xr * k, (cy - hr / 2) * k],
          [xr * k, (cy + hr / 2) * k],
          [xl * k, (cy + hl / 2) * k],
        ];
        const minX = Math.min(pts[0][0], pts[3][0]);
        const maxX = Math.max(pts[1][0], pts[2][0]);
        const minY = Math.min(pts[0][1], pts[1][1]);
        const maxY = Math.max(pts[2][1], pts[3][1]);
        if (maxX < -4 || minX > W + 4) {
          card.style.visibility = 'hidden';
          continue;
        }
        card.style.visibility = 'visible';
        const cw = maxX - minX;
        const ch = maxY - minY;
        card.style.transform = `translate(${minX.toFixed(1)}px, ${minY.toFixed(1)}px)`;
        card.style.width = `${cw.toFixed(1)}px`;
        card.style.height = `${ch.toFixed(1)}px`;
        const local = pts.map((p) => [p[0] - minX, p[1] - minY] as Pt);
        card.style.clipPath = `path('${roundedQuad(local, r)}')`;

        if (CUSTOM[i]) {
          // свой ролик: заполняет всю карточку (object-fit: cover в CSS)
          for (const el of [posterRefs.current[i], videoRefs.current[i]]) {
            if (!el) continue;
            el.style.width = `${cw.toFixed(1)}px`;
            el.style.height = `${ch.toFixed(1)}px`;
            el.style.transform = 'none';
          }
        } else {
        // своя плитка из общего видео 5×2, cover по карточке
        const tileH = Math.max(ch, (w * k) / TILE_RATIO);
        const tileW = tileH * TILE_RATIO;
        const tile = TILES[i % TILES.length];
        const col = tile % 5;
        const row = Math.floor(tile / 5);
        const left = ((w * k) - tileW) / 2 - col * tileW + (xl * k - minX);
        const top = (ch - tileH) / 2 - row * tileH;
        for (const el of [posterRefs.current[i], videoRefs.current[i]]) {
          if (!el) continue;
          el.style.width = `${(5 * tileW).toFixed(1)}px`;
          el.style.height = `${(2 * tileH).toFixed(1)}px`;
          el.style.transform = `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`;
        }
        }
        const play = playRefs.current[i];
        if (play) {
          const size = 34 * k;
          play.style.width = play.style.height = `${size.toFixed(1)}px`;
          play.style.transform = `translate(${(xl * k - minX + 16 * k).toFixed(1)}px, ${((cy + hl / 2) * k - minY - 16 * k - size).toFixed(1)}px)`;
        }
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = nowMs();
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
      last = now;
      if (!dragging) {
        s += ((reduced ? 0 : SPEED) + vx) * dt;
        vx *= Math.pow(0.05, dt); // теряет ~95% скорости за секунду
        if (Math.abs(vx) < 0.5) vx = 0;
      }
      render();

      // все десять видео держим на одной отметке времени
      if (now - lastSync > 800) {
        lastSync = now;
        const lead = videoRefs.current[0];
        if (lead && lead.readyState > 1) {
          for (let i = 1; i < N; i++) {
            if (CUSTOM[i]) continue;
            const v = videoRefs.current[i];
            if (v && Math.abs(v.currentTime - lead.currentTime) > 0.2) v.currentTime = lead.currentTime;
          }
        }
      }
    };

    const playVideos = () => {
      if (reduced) return;
      videoRefs.current.forEach((v) => v?.play().catch(() => {}));
    };
    const pauseVideos = () => videoRefs.current.forEach((v) => v?.pause());

    /* ---------- вход (один раз) ---------- */
    const enter = () => {
      if (entered) return;
      entered = true;
      if (reduced) {
        root.dataset.ready = '1';
        return;
      }
      const ease = 'cubic-bezier(.2,.8,.2,1)';
      const play = (sel: string, frames: Keyframe[], delay: number, duration = 700) => {
        root.querySelectorAll<HTMLElement | SVGElement>(sel).forEach((el, n) => {
          el.animate(frames, { duration, delay: delay + n * 90, easing: ease, fill: 'both' });
        });
      };
      root.dataset.ready = '1';
      play('[data-in="nav"]', [{ opacity: 0, transform: 'translateY(-18px)' }, { opacity: 1, transform: 'none' }], 0);
      play('[data-in="badge"]', [{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'scale(1)' }], 150, 600);
      play(
        '[data-in="line"]',
        [
          { opacity: 0, transform: 'translateY(34px)', filter: 'blur(14px)' },
          { opacity: 1, transform: 'none', filter: 'blur(0)' },
        ],
        300,
        900
      );
      play('[data-in="sub"]', [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], 700);
      play('[data-in="cards"]', [{ opacity: 0, transform: 'translateY(70px)' }, { opacity: 1, transform: 'none' }], 650, 1000);
      play('[data-in="cta"]', [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1)' }], 1000, 600);
      root.querySelectorAll<SVGPathElement>('[data-in="stroke"]').forEach((p, n) => {
        p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, delay: 1100 + n * 220, easing: 'ease-out', fill: 'both' });
      });
      play('[data-in="note"]', [{ opacity: 0 }, { opacity: 1 }], 1300, 700);
    };

    /* ---------- видимость: крутим только на экране ---------- */
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) {
          enter();
          last = nowMs();
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(tick);
          playVideos();
        } else {
          cancelAnimationFrame(raf);
          pauseVideos();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(root);
    render();

    /* ---------- перетаскивание ---------- */
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastT = performance.now();
      dragV = 0;
      vx = 0;
      layer.setPointerCapture(e.pointerId);
      layer.classList.add('hc-grabbing');
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const k = mqPhone.matches ? layer.clientWidth / 640 : (frameRef.current?.clientWidth ?? layer.clientWidth) / 1440;
      const dx = (e.clientX - lastX) / k; // в u
      const nowT = performance.now();
      const dts = Math.max(0.001, (nowT - lastT) / 1000);
      s -= dx; // карточки следуют за пальцем 1:1
      dragV = 0.6 * dragV + 0.4 * (-dx / dts);
      lastX = e.clientX;
      lastT = nowT;
      render();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      // если палец остановился перед отпусканием, броска нет
      vx = performance.now() - lastT > 90 ? 0 : dragV - (reduced ? 0 : SPEED);
      if (layer.hasPointerCapture(e.pointerId)) layer.releasePointerCapture(e.pointerId);
      layer.classList.remove('hc-grabbing');
    };
    layer.addEventListener('pointerdown', onDown);
    layer.addEventListener('pointermove', onMove);
    layer.addEventListener('pointerup', onUp);
    layer.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', render);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      clock.cancel();
      layer.removeEventListener('pointerdown', onDown);
      layer.removeEventListener('pointermove', onMove);
      layer.removeEventListener('pointerup', onUp);
      layer.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', render);
    };
  }, []);

  const { count } = useCart();

  return (
    <section
      id="hero"
      ref={rootRef}
      className={`hc ${interTight.variable} ${inter.variable} ${caveat.variable}`}
      data-ready="0"
      aria-labelledby="hero-heading"
    >
      <div className="hc-frame" ref={frameRef}>
        {/* верхняя панель */}
        <Link className="hc-logo" href="/" data-in="nav" aria-label="pastila — на главную">
          pastila
        </Link>
        <nav className="hc-nav" data-in="nav" aria-label="Основная навигация">
          <Link href="/catalog">Каталог</Link>
          <Link href="/generator">Генератор</Link>
          {SHOW_HIDDEN_BLOCKS && <Link href="/#about">О студии</Link>}
          {SHOW_HIDDEN_BLOCKS && <Link href="/#faq">FAQ</Link>}
          <Link href="/#reviews">Отзывы</Link>
        </nav>
        <Link className="hc-btn hc-fav" href="/catalog?fav=1" data-in="nav">
          Избранное
        </Link>
        <Link className="hc-btn hc-cart" href="/cart" data-in="nav">
          Корзина ({count})
        </Link>

        <h1 id="hero-heading" className="hc-h">
          <span data-in="line">Дизайнерские вазы, светильники и декор, которые выглядят не как у всех</span>
        </h1>

        <p className="hc-sub" data-in="sub">
          Придумываем необычные формы, печатаем их на 3D-принтере, а цвет выбираешь ты. Готовое — в каталоге, а в генераторе можно
          настроить форму, цвет и размер.
        </p>

        {/* карусель */}
        <div className="hc-cards" ref={layerRef} data-in="cards" aria-hidden>
          {Array.from({ length: N }).map((_, i) => (
            <div
              className="hc-card"
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`hc-poster${CUSTOM[i] ? ' hc-cover' : ''}`}
                src={CUSTOM[i] ? img(CUSTOM[i].poster) : POSTER}
                alt=""
                draggable={false}
                ref={(el) => {
                  posterRefs.current[i] = el;
                }}
              />
              <video
                className={`hc-video${CUSTOM[i] ? ' hc-cover' : ''}`}
                src={CUSTOM[i] ? img(CUSTOM[i].video) : VIDEO}
                muted
                loop
                playsInline
                preload="auto"
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                onPlaying={(e) => e.currentTarget.classList.add('hc-on')}
              />
              <span
                className="hc-play"
                ref={(el) => {
                  playRefs.current[i] = el;
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M9 7l8 5-8 5z" fill="#fff" />
                </svg>
              </span>
            </div>
          ))}
        </div>

        {/* рукописные пометки и стрелки */}
        <svg className="hc-doodles" viewBox="0 0 1440 1050" aria-hidden>
          <g fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path data-in="stroke" pathLength={1} strokeDasharray="1" d="M266 411 L286 373" />
            <path data-in="stroke" pathLength={1} strokeDasharray="1" d="M292 411 L312 373" />
            {/* к карточкам: стрелка стартует ниже надписи и закручивается вниз */}
            <path data-in="stroke" pathLength={1} strokeDasharray="1" d="M1290 392 C1338 420 1352 462 1322 512" />
            <path data-in="stroke" pathLength={1} strokeDasharray="1" d="M1322 512 L1318 490 M1322 512 L1340 498" />
            {/* к кнопке «Создать свой» */}
            <path data-in="stroke" pathLength={1} strokeDasharray="1" d="M836 985 C826 968 828 956 840 948" />
            <path data-in="stroke" pathLength={1} strokeDasharray="1" d="M840 948 L826 952 M840 948 L842 964" />
          </g>
        </svg>
        <p className="hc-note hc-note-print" data-in="note" aria-hidden>
          Напечатано
          <br />
          на 3D-принтере
        </p>
        <p className="hc-note hc-note-color" data-in="note" aria-hidden>
          Выбирай свой цвет
        </p>

        <div className="hc-cta-ring" data-in="cta">
          <Link className="hc-cta" href="/catalog">
            Выбрать декор
          </Link>
        </div>
        <Link className="hc-cta2" href="/generator" data-in="cta">
          Создать свой
        </Link>
      </div>
    </section>
  );
}
