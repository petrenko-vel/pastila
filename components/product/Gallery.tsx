'use client';

import { useState } from 'react';
import { img } from '../../lib/base';

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  const [origin, setOrigin] = useState('50% 50%');
  const cur = images[Math.min(i, images.length - 1)];

  return (
    <div className="pd-gallery">
      <div
        className="pd-main"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(cur)} alt={title} width={900} height={900} style={{ transformOrigin: origin }} />
      </div>
      {images.length > 1 && (
        <div className="pd-thumbs" role="group" aria-label="Фотографии товара">
          {images.map((src, n) => (
            <button
              key={src + n}
              type="button"
              className={`pd-thumb ${n === i ? 'on' : ''}`}
              aria-pressed={n === i}
              aria-label={`Фото ${n + 1} из ${images.length}`}
              onClick={() => setI(n)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(src)} alt="" width={90} height={90} loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
