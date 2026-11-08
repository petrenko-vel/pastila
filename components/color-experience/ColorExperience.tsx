'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import Reveal from '../Reveal';
import LampViewer from '../LampViewer';
import { ArrowIcon } from '../Icons';
import { LettersPreview, Model, ModelMini } from '../shape-models';
import { img } from '../../lib/base';
import { palette } from '../../lib/products';
import { defaultColor, defaultItem, defaultScene, items, scenes } from '../../lib/color-scenes';
import type { Furniture, SceneDef } from '../../lib/color-scenes';
import type { Shape } from '../shape-models';
import './color-experience.css';

// Силуэты мебели (CSS/SVG, не фото). Опора предмета лежит на линии y = 500 * (1 - base / 100).
function Silhouette({ furniture }: { furniture: Furniture }) {
  switch (furniture) {
    case 'nightstand':
      return (
        <g>
          <rect x="70" y="150" width="660" height="210" rx="40" className="cx-soft" />
          <rect x="110" y="190" width="580" height="170" rx="28" className="cx-soft" />
          <circle cx="640" cy="90" r="38" className="cx-soft" />
          <rect x="285" y="293" width="230" height="16" rx="8" className="cx-furn" />
          <rect x="300" y="309" width="200" height="124" rx="10" className="cx-furn" />
          <rect x="318" y="326" width="164" height="42" rx="8" className="cx-shade" />
          <circle cx="400" cy="347" r="5" className="cx-knob" />
          <rect x="312" y="433" width="12" height="28" rx="5" className="cx-furn" />
          <rect x="476" y="433" width="12" height="28" rx="5" className="cx-furn" />
        </g>
      );
    case 'desk':
      return (
        <g>
          <rect x="520" y="60" width="150" height="150" rx="14" className="cx-soft" />
          <line x1="595" y1="60" x2="595" y2="210" className="cx-line" />
          <line x1="520" y1="135" x2="670" y2="135" className="cx-line" />
          <rect x="470" y="130" width="150" height="100" rx="10" className="cx-shade" />
          <rect x="535" y="230" width="20" height="40" className="cx-shade" />
          <rect x="130" y="272" width="600" height="18" rx="9" className="cx-furn" />
          <rect x="160" y="290" width="14" height="170" rx="6" className="cx-furn" />
          <rect x="686" y="290" width="14" height="170" rx="6" className="cx-furn" />
          <rect x="520" y="290" width="150" height="90" rx="10" className="cx-furn" />
          <circle cx="595" cy="335" r="5" className="cx-knob" />
        </g>
      );
    case 'sofa':
      return (
        <g>
          <rect x="60" y="120" width="260" height="180" rx="14" className="cx-soft" />
          <rect x="60" y="190" width="420" height="110" rx="46" className="cx-furn" />
          <rect x="40" y="260" width="460" height="100" rx="34" className="cx-furn" />
          <rect x="80" y="340" width="12" height="40" rx="5" className="cx-shade" />
          <rect x="450" y="340" width="12" height="40" rx="5" className="cx-shade" />
          <rect x="530" y="297" width="160" height="14" rx="7" className="cx-furn" />
          <rect x="548" y="311" width="12" height="150" rx="5" className="cx-furn" />
          <rect x="660" y="311" width="12" height="150" rx="5" className="cx-furn" />
          <path d="M700 110c30 20 50 70 40 120-30-10-50-60-40-120z" className="cx-soft" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M120 70c30 20 40 60 30 100-30-10-40-50-30-100z" className="cx-soft" />
          <rect x="170" y="238" width="460" height="16" rx="8" className="cx-furn" />
          <path d="M210 254v34M590 254v34" className="cx-line" />
          <rect x="170" y="388" width="460" height="16" rx="8" className="cx-furn" />
          <rect x="210" y="330" width="60" height="58" rx="8" className="cx-shade" />
          <rect x="285" y="344" width="46" height="44" rx="8" className="cx-soft" />
          <rect x="520" y="340" width="70" height="48" rx="8" className="cx-shade" />
          <circle cx="680" cy="100" r="30" className="cx-soft" />
        </g>
      );
  }
}

function SceneLayer({ scene, on }: { scene: SceneDef; on: boolean }) {
  const style = {
    '--cx-wall': scene.wall,
    '--cx-floor': scene.floor,
    '--cx-furn': scene.furnitureColor,
  } as CSSProperties;
  return (
    <div className={`cx-scene${on ? ' is-on' : ''}`} style={style} aria-hidden="true">
      {scene.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cx-scene-photo" src={img(scene.photo)} alt="" width={1200} height={750} />
      ) : (
        <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="500" className="cx-wall" />
          <rect y="352" width="800" height="148" className="cx-floor" />
          <rect y="352" width="800" height="6" className="cx-baseboard" />
          <Silhouette furniture={scene.furniture} />
        </svg>
      )}
    </div>
  );
}

export default function ColorExperience() {
  const [itemKey, setItemKey] = useState<Shape>(defaultItem);
  const [colorKey, setColorKey] = useState(defaultColor);
  const [sceneKey, setSceneKey] = useState(defaultScene);
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const item = items.find((i) => i.key === itemKey) ?? items[0];
  const color = palette.find((p) => p.key === colorKey) ?? palette[0];
  const scene = scenes.find((s) => s.key === sceneKey) ?? scenes[0];
  const photo = item.variants?.[color.key];

  const onSwatchKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = palette.length;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setColorKey(palette[next].key);
    swatchRefs.current[next]?.focus();
  };

  const stageStyle = {
    '--cx-tint': color.hex,
    '--lx': `${scene.light.x}%`,
    '--ly': `${scene.light.y}%`,
  } as CSSProperties;

  const itemStyle = {
    left: `${scene.spot.x}%`,
    bottom: `${scene.spot.base}%`,
    width: `${item.size * scene.scale}%`,
  } as CSSProperties;

  const q = `shape=${item.key}&color=${color.key}`;

  return (
    <section className="cx" aria-labelledby="cx-title">
      <div className="container wide">
        <Reveal>
          <div className="cx-head">
            <span className="cx-eyebrow">Цвет меняет всё</span>
            <h2 id="cx-title">Один предмет — множество настроений</h2>
            <p>
              Выбери изделие, примерь любой из {palette.length} цветов нашего пластика и поставь его в разные комнаты. Сцены
              нарисованы для примера, цвет изделия показан честно.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="cx-grid">
            <div className="cx-stage" style={stageStyle}>
              {scenes.map((s) => (
                <SceneLayer key={s.key} scene={s} on={s.key === scene.key} />
              ))}
              <div className="cx-glow" aria-hidden="true" />

              <div className="cx-item" style={itemStyle}>
                <div className="cx-item-shadow" aria-hidden="true" />
                <div className={`cx-item-body${item.key === 'lamp' ? ' is-lamp' : ''}`}>
                  {/* лампа смонтирована всегда: three грузится лениво, когда она в зоне видимости */}
                  <div className="cx-lamp" hidden={item.key !== 'lamp' || !!photo}>
                    <LampViewer color={color.hex} spin={1.1} glow={0.12} />
                  </div>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="cx-photo" src={img(photo)} alt={`${item.name}, ${color.name.toLowerCase()}`} width={600} height={600} />
                  ) : item.key === 'letters' ? (
                    <div className="cx-pop" key={color.key}>
                      <LettersPreview text="ДОМ" color={color.hex} />
                    </div>
                  ) : item.key !== 'lamp' ? (
                    <div className="cx-pop" key={color.key}>
                      <Model shape={item.key} color={color.hex} />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="cx-tag" aria-hidden="true">
                <i style={{ background: color.hex }} />
                {color.name}
              </div>
            </div>

            <div className="cx-panel">
              <div className="cx-live" aria-live="polite">
                <span className="cx-live-kicker">
                  {item.name} · {scene.name}
                </span>
                <b className="cx-live-name">{color.name}</b>
                <span className="cx-live-mood">{color.mood}</span>
              </div>

              <div className="cx-field">
                <span className="cx-label" id="cx-l-item">
                  Предмет
                </span>
                <div className="cx-pills" role="group" aria-labelledby="cx-l-item">
                  {items.map((it) => (
                    <button
                      key={it.key}
                      type="button"
                      className="cx-pill"
                      aria-pressed={it.key === item.key}
                      onClick={() => setItemKey(it.key)}
                    >
                      {it.key === 'lamp' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img('/img/lamp-shade.webp')} alt="" width={389} height={420} />
                      ) : it.key === 'letters' ? (
                        <span className="cx-pill-letter" aria-hidden="true">
                          Аб
                        </span>
                      ) : (
                        <svg viewBox={it.key === 'vase' ? '0 0 200 280' : '0 0 200 220'} aria-hidden="true">
                          <ModelMini shape={it.key} />
                        </svg>
                      )}
                      {it.name}
                    </button>
                  ))}
                </div>
                <p className="cx-note">{item.note}</p>
              </div>

              <div className="cx-field">
                <span className="cx-label" id="cx-l-color">
                  Цвет
                </span>
                <div className="cx-swatches" role="radiogroup" aria-labelledby="cx-l-color">
                  {palette.map((p, i) => (
                    <button
                      key={p.key}
                      ref={(el) => {
                        swatchRefs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={p.key === color.key}
                      aria-label={p.name}
                      title={p.name}
                      tabIndex={p.key === color.key ? 0 : -1}
                      className="cx-swatch"
                      style={{ background: p.hex }}
                      onClick={() => setColorKey(p.key)}
                      onKeyDown={(e) => onSwatchKey(e, i)}
                    />
                  ))}
                </div>
              </div>

              <div className="cx-field">
                <span className="cx-label" id="cx-l-scene">
                  Интерьер
                </span>
                <div className="cx-pills cx-pills-scene" role="group" aria-labelledby="cx-l-scene">
                  {scenes.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      className="cx-chip"
                      aria-pressed={s.key === scene.key}
                      onClick={() => setSceneKey(s.key)}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cx-cta">
                <Link href={`/generator/?${q}`} className="cx-btn cx-btn-main">
                  Собрать в этом цвете
                  <ArrowIcon />
                </Link>
                <Link href={`/catalog/?color=${color.key}`} className="cx-btn cx-btn-ghost">
                  Смотреть в каталоге
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
