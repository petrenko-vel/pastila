'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../../components/CartProvider';
import { ModelMini, ShapePreview, type Shape } from '../../components/shape-models';
import { img } from '../../lib/base';
import { formatPrice, palette } from '../../lib/products';

const shapes: { key: Shape; name: string; base: number }[] = [
  { key: 'vase', name: 'Ваза', base: 1200 },
  { key: 'candle', name: 'Свеча', base: 600 },
  { key: 'lamp', name: 'Лампа', base: 2400 },
  { key: 'letters', name: 'Буквы', base: 450 }, // цена за одну букву
];

export default function GeneratorPage() {
  const [shape, setShape] = useState<Shape>('vase');
  const [colorKey, setColorKey] = useState('pink');
  const [size, setSize] = useState(100);
  const [text, setText] = useState('ДОМ');
  const { add } = useCart();

  // ссылка из каталога: /generator?shape=letters
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('shape');
    if (s === 'vase' || s === 'candle' || s === 'lamp' || s === 'letters') setShape(s);
    const c = q.get('color');
    if (c && palette.some((p) => p.key === c)) setColorKey(c);
    const t = q.get('text');
    if (t) setText(t.slice(0, 8).toUpperCase());
  }, []);

  const color = palette.find((p) => p.key === colorKey)!;
  const meta = shapes.find((s) => s.key === shape)!;
  const count = Math.max(1, [...text.replace(/\s/g, '')].length);
  const baseCost = shape === 'letters' ? meta.base * count : meta.base;
  const price = Math.round((baseCost * Math.pow(size / 100, 2)) / 10) * 10;
  const height = Math.round((shape === 'lamp' ? 19 : shape === 'vase' ? 20 : shape === 'letters' ? 8 : 10) * (size / 100));

  const addToCart = () => {
    add({
      id: `custom-${shape}-${colorKey}-${size}${shape === 'letters' ? '-' + text : ''}`,
      title: shape === 'letters' ? `Буквы «${text}» (свой дизайн)` : `${meta.name} (свой дизайн)`,
      price,
      note: `${color.name}, высота ~${height} см`,
    });
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
            <ShapePreview shape={shape} color={color.hex} text={text} />
          </div>
        </div>

        <div className="panel">
          <div className="field">
            <b>Форма</b>
            <div className="shape-row">
              {shapes.map((s) => (
                <button key={s.key} className={`shape-btn ${shape === s.key ? 'on' : ''}`} onClick={() => setShape(s.key)}>
                  {s.key === 'lamp' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="shape-img" src={img('/img/lamp-shade.webp')} alt="" width={389} height={420} />
                  ) : s.key === 'letters' ? (
                    <span className="shape-letter" aria-hidden>
                      Аб
                    </span>
                  ) : (
                    <svg viewBox={s.key === 'vase' ? '0 0 200 280' : '0 0 200 220'}>
                      <g>
                        <ModelMini shape={s.key} />
                      </g>
                    </svg>
                  )}
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {shape === 'letters' && (
            <div className="field">
              <label htmlFor="word">Слово или имя</label>
              <input
                id="word"
                className="text-input"
                value={text}
                maxLength={8}
                placeholder="Например, ДОМ"
                onChange={(e) => setText(e.target.value.toUpperCase())}
              />
              <div className="size-val">
                <span>До 8 букв</span>
                <span>Букв: {count}</span>
              </div>
            </div>
          )}

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
    </div>
  );
}