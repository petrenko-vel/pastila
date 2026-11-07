'use client';

import { useState } from 'react';
import { useCart } from '../../components/CartProvider';
import { formatPrice, palette } from '../../lib/products';

type Shape = 'vase' | 'candle' | 'lamp';

const shapes: { key: Shape; name: string; base: number }[] = [
  { key: 'vase', name: 'Ваза', base: 1200 },
  { key: 'candle', name: 'Свеча', base: 600 },
  { key: 'lamp', name: 'Лампа', base: 2400 },
];

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * (amt < 0 ? v : 255 - v))));
  const r = f(n >> 16),
    g = f((n >> 8) & 255),
    b = f(n & 255);
  return `rgb(${r},${g},${b})`;
}

function Model({ shape, color }: { shape: Shape; color: string }) {
  const light = shade(color, 0.28);
  const dark = shade(color, -0.22);
  const id = `g-${shape}`;
  const defs = (
    <defs>
      <linearGradient id={id} x1="0" x2="1">
        <stop offset="0" stopColor={dark} />
        <stop offset="0.35" stopColor={light} />
        <stop offset="0.7" stopColor={color} />
        <stop offset="1" stopColor={dark} />
      </linearGradient>
    </defs>
  );
  if (shape === 'vase')
    return (
      <svg viewBox="0 0 200 280">
        {defs}
        <ellipse cx="100" cy="268" rx="62" ry="8" fill="rgba(60,30,20,.18)" />
        <path
          d="M72 14c-6 22 20 30 14 52-6 22-40 30-38 72 2 38 34 40 26 76-2 22 10 44 26 44s28-22 26-44c-8-36 24-38 26-76 2-42-32-50-38-72-6-22 20-30 14-52z"
          fill={`url(#${id})`}
          transform="translate(0 0)"
        />
        <ellipse cx="100" cy="14" rx="28" ry="6" fill={dark} opacity=".55" />
      </svg>
    );
  if (shape === 'candle')
    return (
      <svg viewBox="0 0 200 220">
        {defs}
        <ellipse cx="100" cy="206" rx="70" ry="9" fill="rgba(60,30,20,.18)" />
        {[0, 1, 2].flatMap((row) =>
          [0, 1, 2].map((col) => {
            const cx = 52 + col * 48 + (row % 2 ? 0 : 0);
            const cy = 56 + row * 48;
            return <circle key={`${row}${col}`} cx={cx} cy={cy + 40} r="26" fill={`url(#${id})`} />;
          })
        )}
        <path d="M100 8c8 10 8 18 0 26-8-8-8-16 0-26z" fill="#f2b04a" />
        <rect x="98" y="30" width="4" height="22" rx="2" fill="#5a3322" />
      </svg>
    );
  return (
    <svg viewBox="0 0 220 300">
      {defs}
      <ellipse cx="110" cy="288" rx="52" ry="8" fill="rgba(60,30,20,.18)" />
      <path d="M92 150h36l8 124c0 8-8 12-26 12s-26-4-26-12z" fill={`url(#${id})`} />
      <path d="M12 140C12 70 56 18 110 18s98 52 98 122c0 6-4 10-10 10H22c-6 0-10-4-10-10z" fill={`url(#${id})`} />
      <ellipse cx="110" cy="152" rx="70" ry="8" fill="#ffe7b0" opacity=".85" />
      <ellipse cx="80" cy="64" rx="26" ry="12" fill="#fff" opacity=".22" transform="rotate(-24 80 64)" />
    </svg>
  );
}

export default function GeneratorPage() {
  const [shape, setShape] = useState<Shape>('vase');
  const [colorKey, setColorKey] = useState('pink');
  const [size, setSize] = useState(100);
  const [toast, setToast] = useState(false);
  const { add } = useCart();

  const color = palette.find((p) => p.key === colorKey)!;
  const meta = shapes.find((s) => s.key === shape)!;
  const price = Math.round((meta.base * Math.pow(size / 100, 2)) / 10) * 10;
  const height = Math.round((shape === 'lamp' ? 24 : shape === 'vase' ? 20 : 10) * (size / 100));

  const addToCart = () => {
    add({
      id: `custom-${shape}-${colorKey}-${size}`,
      title: `${meta.name} (свой дизайн)`,
      price,
      note: `${color.name}, высота ~${height} см`,
    });
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  };

  return (
    <div className="page container">
      <div className="page-head">
        <h1>Генератор декора</h1>
        <p>Выбирай форму, цвет и размер — а мы напечатаем это для тебя ♡</p>
      </div>

      <div className="gen-wrap">
        <div className="stage">
          <div className="stage-model" style={{ transform: `scale(${0.55 + size / 220})` }}>
            <Model shape={shape} color={color.hex} />
          </div>
        </div>

        <div className="panel">
          <div className="field">
            <b>Форма</b>
            <div className="shape-row">
              {shapes.map((s) => (
                <button key={s.key} className={`shape-btn ${shape === s.key ? 'on' : ''}`} onClick={() => setShape(s.key)}>
                  <svg viewBox={s.key === 'vase' ? '0 0 200 280' : s.key === 'candle' ? '0 0 200 220' : '0 0 220 300'}>
                    <g>
                      <ModelMini shape={s.key} />
                    </g>
                  </svg>
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <b>Цвет — {color.name}</b>
            <div className="color-row">
              {palette.map((p) => (
                <button
                  key={p.key}
                  aria-label={p.name}
                  title={p.name}
                  className={`pdot ${colorKey === p.key ? 'on' : ''}`}
                  style={{ background: p.hex }}
                  onClick={() => setColorKey(p.key)}
                />
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="size">Размер</label>
            <input id="size" type="range" min={60} max={160} step={5} value={size} onChange={(e) => setSize(+e.target.value)} />
            <div className="size-val">
              <span>Масштаб {size}%</span>
              <span>Высота ~{height} см</span>
            </div>
          </div>

          <div className="total">
            <div>
              <small style={{ color: 'var(--muted)' }}>Итого</small>
              <div className="price">{formatPrice(price)}</div>
            </div>
            <button className="btn btn-brown" onClick={addToCart}>
              В корзину
            </button>
          </div>
        </div>
      </div>
      {toast && <div className="toast">Добавили в корзину ♡</div>}
    </div>
  );
}

function ModelMini({ shape }: { shape: Shape }) {
  const c = '#c7a48c';
  if (shape === 'vase')
    return <path d="M72 14c-6 22 20 30 14 52-6 22-40 30-38 72 2 38 34 40 26 76-2 22 10 44 26 44s28-22 26-44c-8-36 24-38 26-76 2-42-32-50-38-72-6-22 20-30 14-52z" fill={c} />;
  if (shape === 'candle')
    return (
      <>
        {[0, 1, 2].flatMap((r) => [0, 1, 2].map((k) => <circle key={`${r}${k}`} cx={52 + k * 48} cy={96 + r * 48} r="26" fill={c} />))}
      </>
    );
  return (
    <>
      <path d="M92 150h36l8 124c0 8-8 12-26 12s-26-4-26-12z" fill={c} />
      <path d="M12 140C12 70 56 18 110 18s98 52 98 122c0 6-4 10-10 10H22c-6 0-10-4-10-10z" fill={c} />
    </>
  );
}
