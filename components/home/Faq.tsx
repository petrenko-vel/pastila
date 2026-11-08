'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Reveal from '../Reveal';
import { PlusIcon } from '../Icons';
import './story-blocks.css';

type FaqItem = {
  q: string;
  /** null: показывается нейтральный ответ-заглушка */
  answer: string | null;
  link?: { href: string; label: string };
};

const FALLBACK = 'Уточняем и скоро добавим здесь подробности.';

export const faqItems: FaqItem[] = [
  {
    q: 'Из чего изготовлены изделия?',
    answer: 'Изделия печатаются на 3D-принтере из пластика.',
  },
  {
    q: 'Можно ли выбрать другой цвет?',
    answer: 'Да. Любой из 11 цветов палитры доступен для любого изделия. Цвет выбирается в каталоге или в генераторе.',
    link: { href: '/generator', label: 'Открыть генератор' },
  },
  {
    // DEMO: наличие не подтверждено
    q: 'Есть ли изделия в наличии?',
    answer: 'Актуальную информацию о наличии смотрите в каталоге и на странице изделия.',
    link: { href: '/catalog', label: 'В каталог' },
  },
  {
    // DEMO: сроки не подтверждены
    q: 'Сколько занимает изготовление?',
    answer: 'Срок зависит от изделия и его размера. Точное время мы сообщаем при оформлении заказа.',
    link: { href: '/delivery', label: 'Доставка и оплата' },
  },
  {
    // DEMO: уход не подтверждён
    q: 'Как ухаживать за предметами?',
    answer: null,
  },
  {
    // DEMO: условия возврата не подтверждены
    q: 'Как оформить возврат?',
    answer: 'Условия возврата и обмена описаны на отдельной странице.',
    link: { href: '/returns', label: 'Возврат и обмен' },
  },
  {
    // DEMO: условия доставки не подтверждены
    q: 'Как осуществляется доставка?',
    answer: 'Способы и условия доставки собраны на отдельной странице.',
    link: { href: '/delivery', label: 'Доставка и оплата' },
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = faqItems.length;
    let t = -1;
    if (e.key === 'ArrowDown') t = (i + 1) % n;
    else if (e.key === 'ArrowUp') t = (i - 1 + n) % n;
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = n - 1;
    if (t >= 0) {
      e.preventDefault();
      btns.current[t]?.focus();
    }
  };

  return (
    <section className="faq2-wrap" id="faq" aria-labelledby="faq2-title">
      <div className="container wide">
        <Reveal>
          <div className="faq2">
            <div className="faq2-head">
              <span className="ps-kicker">FAQ</span>
              <h2 id="faq2-title">Частые вопросы</h2>
              <p>Коротко о материале, цвете, сроках и доставке.</p>
            </div>
            <ul className="faq2-list">
              {faqItems.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q} className={`faq2-item${isOpen ? ' open' : ''}`}>
                    <h3>
                      <button
                        type="button"
                        id={`faq2-btn-${i}`}
                        ref={(el) => {
                          btns.current[i] = el;
                        }}
                        aria-expanded={isOpen}
                        aria-controls={`faq2-panel-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        onKeyDown={(e) => onKey(e, i)}
                      >
                        <span>{f.q}</span>
                        <i aria-hidden>
                          <PlusIcon />
                        </i>
                      </button>
                    </h3>
                    <div className="faq2-panel" id={`faq2-panel-${i}`} role="region" aria-labelledby={`faq2-btn-${i}`}>
                      <div className="faq2-inner">
                        <p>{f.answer ?? FALLBACK}</p>
                        {f.link && (
                          <Link href={f.link.href} className="faq2-link" tabIndex={isOpen ? 0 : -1}>
                            {f.link.label} <span aria-hidden>→</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
