import Link from 'next/link';
import Reveal from '../Reveal';
import { ArrowUpRightIcon } from '../Icons';
import { img } from '../../lib/base';
import { customerPhotos, instagramUrl, interiorPhotos } from '../../lib/home-data';
import './home-blocks.css';

export default function RealLife() {
  const hasCustomer = customerPhotos.length > 0;
  const tiles = hasCustomer
    ? customerPhotos.map((p) => ({ src: p.src, alt: p.alt, href: undefined as string | undefined }))
    : interiorPhotos.map((p) => ({ src: p.src, alt: p.alt, href: `/product/${p.productId}/` }));

  return (
    <section className="container wide rl" aria-labelledby="rl-title">
      <Reveal>
        <div className="hb-head">
          <h2 id="rl-title" className="hb-title">Уже живут у вас дома</h2>
          {instagramUrl && (
            <a href={instagramUrl} className="hb-link" target="_blank" rel="noopener noreferrer">
              Мы в Instagram <ArrowUpRightIcon size={14} />
            </a>
          )}
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="rl-mosaic">
          {tiles.slice(0, 5).map((t, i) => {
            const inner = (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img(t.src)} alt={t.alt} width={640} height={640} loading="lazy" />
            );
            return t.href ? (
              <Link key={t.src} href={t.href} className={`rl-tile rl-t${i + 1}`}>
                {inner}
              </Link>
            ) : (
              <div key={t.src} className={`rl-tile rl-t${i + 1}`}>{inner}</div>
            );
          })}
          {!hasCustomer && (
            <div className="rl-invite">
              <span className="rl-note">ваш дом</span>
              <p className="rl-invite-title">Скоро здесь появятся ваши фото</p>
              <p className="rl-invite-text">Покажите, как изделия Pastila выглядят в вашем интерьере.</p>
              {instagramUrl && (
                <a href={instagramUrl} className="rl-invite-btn" target="_blank" rel="noopener noreferrer">
                  Отметить нас <ArrowUpRightIcon size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
