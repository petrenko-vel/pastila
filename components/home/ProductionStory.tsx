import Link from 'next/link';
import Reveal from '../Reveal';
import { ArrowIcon } from '../Icons';
import { img } from '../../lib/base';
import { palette } from '../../lib/products';
import './story-blocks.css';

type Art = 'sketch' | 'finish' | 'check';

type Stage = {
  id: string;
  title: string;
  text: string;
  /** путь к своей фотографии из public/img (заменить, когда будут снимки процесса); если null, рисуется графика */
  photo: string | null;
  photoAlt: string;
  photoSize?: { w: number; h: number };
  art?: Art;
  tone: 'beige' | 'yellow' | 'carnation' | 'mimosa';
};

// DEMO: тексты этапов обобщённые, владельцу студии нужно их подтвердить или переписать под реальный процесс.
const stages: Stage[] = [
  {
    id: 'idea',
    title: 'Идея',
    text: 'Всё начинается с формы, которую хочется взять в руки: набросок, настроение, вопрос «а что, если сделать иначе».',
    photo: null,
    photoAlt: '',
    art: 'sketch',
    tone: 'mimosa',
  },
  {
    id: 'model',
    title: 'Модель',
    text: 'Набросок превращается в 3D-модель. Модели у нас собственные, поэтому форма сразу придумывается с расчётом на печать.',
    photo: '/img/lamp-shade.webp',
    photoAlt: 'Рендер ребристого плафона',
    photoSize: { w: 389, h: 420 },
    tone: 'carnation',
  },
  {
    id: 'print',
    title: 'Печать',
    text: 'Модель печатается на 3D-принтере слой за слоем из пластика. Цвет выбирается из палитры студии.',
    photo: '/img/about-printer.webp',
    photoAlt: '3D-принтер',
    tone: 'yellow',
  },
  {
    id: 'finish',
    title: 'Доводка',
    text: 'После печати смотрим на деталь вблизи: поверхность, края, фактуру слоёв. Она часть характера предмета.',
    photo: null,
    photoAlt: '',
    art: 'finish',
    tone: 'beige',
  },
  {
    id: 'check',
    title: 'Проверка',
    text: 'Перед тем как предмет уйдёт к вам, его осматривают: форма, цвет, детали.',
    photo: null,
    photoAlt: '',
    art: 'check',
    tone: 'mimosa',
  },
];

function StageArt({ art }: { art: Art }) {
  if (art === 'sketch') {
    return (
      <svg viewBox="0 0 320 240" role="img" aria-label="Набросок формы" className="ps-art">
        <circle cx="262" cy="52" r="20" fill="var(--yellow)" />
        <path d="M70 190c-8-60 6-110 54-128 40-14 80 6 86 52 6 44-20 76-64 78-40 2-70-4-76-2z" fill="none" stroke="var(--bean)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" />
        <path d="M96 170c20-40 52-62 96-60" fill="none" stroke="var(--cinnabar)" strokeWidth="4" strokeLinecap="round" />
        <path d="M60 210h200" stroke="var(--bean)" strokeWidth="3" strokeLinecap="round" opacity=".25" />
      </svg>
    );
  }
  if (art === 'finish') {
    return (
      <svg viewBox="0 0 320 240" role="img" aria-label="Слои и фактура поверхности" className="ps-art">
        <rect x="60" y="30" width="200" height="180" rx="36" fill="var(--carnation)" />
        {[56, 76, 96, 116, 136, 156, 176].map((y, i) => (
          <path key={y} d={`M72 ${y}q${i % 2 ? 38 : 22} 10 88 0t88 0`} fill="none" stroke="var(--bean)" strokeWidth="2.5" strokeLinecap="round" opacity=".35" />
        ))}
        <circle cx="248" cy="48" r="14" fill="var(--yellow)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label="Отметка о проверке" className="ps-art">
      <rect x="70" y="50" width="130" height="150" rx="44" fill="var(--yellow)" />
      <circle cx="226" cy="90" r="44" fill="var(--cinnabar)" />
      <path d="M205 90l15 15 28-30" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductionStory() {
  return (
    <section className="ps-wrap" id="production" aria-labelledby="ps-title">
      <div className="container wide">
        <Reveal>
          <div className="ps-head">
            <span className="ps-kicker">Напечатано в Pastila</span>
            <h2 id="ps-title">От идеи до предмета</h2>
            <p>
              Производство для нас продолжение дизайна: форма, цвет и фактура решаются на каждом шаге, а не в самом конце.
            </p>
          </div>
        </Reveal>

        <ol className="ps-line">
          {stages.map((s, i) => (
            <li key={s.id} className={`ps-step ps-${s.tone}`}>
              <Reveal delay={i * 60} className="ps-reveal">
                <article className="ps-card">
                  <div className="ps-media">
                    {s.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img(s.photo)}
                        alt={s.photoAlt}
                        width={s.photoSize?.w ?? 640}
                        height={s.photoSize?.h ?? 480}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      s.art && <StageArt art={s.art} />
                    )}
                  </div>
                  <div className="ps-body">
                    <span className="ps-num" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="ps-colors">
            <div className="ps-colors-text">
              <h3>11 цветов пластика</h3>
              <p>Любой цвет доступен для любого изделия: его выбирают в каталоге или в генераторе.</p>
              <Link href="/generator" className="btn btn-brown ps-btn">
                Выбрать цвет
                <ArrowIcon size={14} />
              </Link>
            </div>
            <ul className="ps-swatches" aria-label="Цвета палитры">
              {palette.map((c) => (
                <li key={c.key}>
                  <span className="ps-dot" style={{ background: c.hex }} aria-hidden />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
