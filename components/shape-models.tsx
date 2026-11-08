'use client';

import { useId } from 'react';
import LampViewer from './LampViewer';

/**
 * Общие превью изделий, которые честно перекрашиваются на лету:
 * ваза и свеча (SVG), буквы (SVG-текст), лампа (настоящая 3D-модель).
 * Используются в генераторе и в блоке «Один предмет — множество настроений».
 */
export type Shape = 'vase' | 'candle' | 'lamp' | 'letters';

export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * (amt < 0 ? v : 255 - v))));
  const r = f(n >> 16),
    g = f((n >> 8) & 255),
    b = f(n & 255);
  return `rgb(${r},${g},${b})`;
}

export function Model({ shape, color }: { shape: Exclude<Shape, 'letters'>; color: string }) {
  const light = shade(color, 0.28);
  const dark = shade(color, -0.22);
  const uid = useId().replace(/:/g, '');
  const id = `g-${shape}-${uid}`;
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
            const cx = 52 + col * 48;
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

export function LettersPreview({ text, color }: { text: string; color: string }) {
  // SVG-текст с круглыми стыками обводки даёт «надутые» мягкие буквы
  const chars = [...(text || '·')];
  const n = chars.length;
  const cell = 96;
  const tilt = [-6, 4, -3, 6, -5, 3, -4, 5];
  const lift = [0, -6, 4, -3, 5, -5, 3, -6];
  const width = Math.min(300, n * 104);
  return (
    <svg
      className="letters-preview"
      viewBox={`0 0 ${n * cell + 10} 150`}
      style={{ width }}
      role="img"
      aria-label={`Буквы: ${text}`}
    >
      {chars.map((ch, i) => {
        const cx = 5 + cell / 2 + i * cell;
        return (
          <text
            key={i}
            x={cx}
            y={112 + lift[i % 8]}
            textAnchor="middle"
            transform={`rotate(${tilt[i % 8]} ${cx} 80)`}
            fill={color}
            stroke={color}
            strokeWidth={11}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ paintOrder: 'stroke', fontSize: 104 }}
          >
            {ch === ' ' ? ' ' : ch}
          </text>
        );
      })}
    </svg>
  );
}

export function ModelMini({ shape }: { shape: Shape }) {
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

/** Превью выбранной формы целиком: выбирает нужную модель сам. */
export function ShapePreview({
  shape,
  color,
  text = 'ДОМ',
  lampProps,
}: {
  shape: Shape;
  color: string;
  text?: string;
  lampProps?: Partial<React.ComponentProps<typeof LampViewer>>;
}) {
  if (shape === 'lamp') return <LampViewer color={color} {...lampProps} />;
  if (shape === 'letters') return <LettersPreview text={text} color={color} />;
  return <Model shape={shape} color={color} />;
}
