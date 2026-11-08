'use client';

import { palette } from '../../lib/products';

/** Выбор цвета изделия кружками (radio-группа). Общий для блоков главной. */
export default function ColorDots({
  value,
  onChange,
  label,
  className = '',
}: {
  value: string;
  onChange: (key: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={`hb-dots ${className}`} role="radiogroup" aria-label={label}>
      {palette.map((c) => (
        <button
          key={c.key}
          type="button"
          role="radio"
          aria-checked={value === c.key}
          aria-label={c.name}
          title={c.name}
          className={`hb-dot ${value === c.key ? 'on' : ''}`}
          style={{ background: c.hex }}
          onClick={() => onChange(c.key)}
        />
      ))}
    </div>
  );
}
