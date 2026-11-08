'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../components/CartProvider';
import CartLine from '../../components/cart/CartLine';
import { formatPrice } from '../../lib/products';

function plural(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'товар';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'товара';
  return 'товаров';
}

export default function CartPage() {
  const { items, ready, count, total, setQty, remove, clear } = useCart();
  const [confirm, setConfirm] = useState(false);

  if (!ready) {
    return (
      <div className="page container ct-page">
        <div className="page-head">
          <h1>Корзина</h1>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page container ct-page">
        <div className="page-head">
          <h1>Корзина</h1>
        </div>
        <div className="ct-empty">
          <div className="ct-empty-mark" aria-hidden="true">
            ♡
          </div>
          <h2>В корзине пока пусто</h2>
          <p>Загляните в каталог или соберите своё изделие в генераторе.</p>
          <div className="ct-empty-actions">
            <Link href="/catalog/" className="btn btn-brown">
              Перейти в каталог
            </Link>
            <Link href="/generator/" className="btn ct-btn-line">
              Собрать в генераторе
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page container ct-page ct-has-bar">
      <div className="page-head">
        <h1>Корзина</h1>
        <p>
          {count} {plural(count)}
        </p>
      </div>

      <div className="ct-layout">
        <section aria-label="Товары в корзине">
          <ul className="ct-list">
            {items.map((i) => (
              <CartLine key={i.id} item={i} onQty={(q) => setQty(i.id, q)} onRemove={() => remove(i.id)} />
            ))}
          </ul>

          <div className="ct-clear">
            {confirm ? (
              <div className="ct-confirm" role="alertdialog" aria-label="Очистить корзину?">
                <span>Удалить все товары из корзины?</span>
                <button
                  type="button"
                  className="btn btn-brown btn-sm"
                  onClick={() => {
                    clear();
                    setConfirm(false);
                  }}
                >
                  Да, очистить
                </button>
                <button type="button" className="btn ct-btn-line btn-sm" onClick={() => setConfirm(false)} autoFocus>
                  Оставить
                </button>
              </div>
            ) : (
              <button type="button" className="ct-link-btn" onClick={() => setConfirm(true)}>
                Очистить корзину
              </button>
            )}
          </div>
        </section>

        <aside className="ct-summary ct-summary-sticky" aria-label="Итог заказа">
          <h2>Ваш заказ</h2>
          <dl className="ct-sum-rows">
            <div>
              <dt>
                {count} {plural(count)}
              </dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <div className="ct-sum-total">
            <span>Итого</span>
            <b>{formatPrice(total)}</b>
          </div>
          <Link href="/checkout/" className="btn btn-brown ct-sum-btn">
            Оформить заказ
          </Link>
          <p className="ct-note">Доставка и оплата уточняются при оформлении.</p>
        </aside>
      </div>
    </div>
  );
}
