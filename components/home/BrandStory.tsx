import Link from 'next/link';
import Reveal from '../Reveal';
import { ArrowIcon } from '../Icons';
import { img } from '../../lib/base';
import { brandStory } from '../../lib/home-data';
import './home-blocks.css';

/** titleTag="h1" и hideCta используются на странице /about. */
export default function BrandStory({ titleTag = 'h2', hideCta = false }: { titleTag?: 'h1' | 'h2'; hideCta?: boolean }) {
  const Title = titleTag;
  return (
    <section className="container wide brand" aria-labelledby="brand-title">
      <Reveal>
        <div className="brand-panel">
          <div className="brand-main">
            <Title id="brand-title" className="brand-title">
              Мы верим, что обычные вещи могут быть <mark>необычными</mark>
            </Title>
            <p className="brand-lead">{brandStory.lead}</p>
            <p className="brand-text">{brandStory.text}</p>
            <ol className="brand-steps">
              {brandStory.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="brand-num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="brand-details">{brandStory.details}</p>
            {!hideCta && (
              <Link href="/about/" className="brand-btn">
                Познакомиться с Pastila <ArrowIcon size={14} />
              </Link>
            )}
          </div>
          <div className="brand-art" aria-hidden="true">
            <span className="brand-blob" />
            <span className="brand-ring" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(brandStory.photo)} alt="" width={640} height={800} loading="lazy" />
            <span className="brand-note">сделано<br />руками и принтером</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
