'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../components/CartProvider';
import { img } from '../../lib/base';
import { formatPrice } from '../../lib/products';

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [done, setDone] = useState(false);

  if (done)
    return (
      <div className="page container">
        <div className="page-head">
          <h1>Спасибо за заказ ♡</h1>
          <p>Это демо-версия сайта: оплата не подключена, ничего не отправлено.</p>
          <Link href="/catalog" className="btn btn-brown" style={{ marginTop: 22 }}>
            В каталог
          </Link>
        </div>
      </div>
    );

  return (
    <div className="page container">
      <div className="page-head">
        <h1>Корзина</h1>
      </div>

      {items.length === 0 ? (
        <>
          <p className="empty">В корзине пока пусто ♡</p>
          <div style={{ textAlign: 'center' }}>
            <Link href="/catalog" className="btn btn-brown">
              Перейти в каталог
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="cart-list">
            {items.map((i) => (
              <div className="cart-row" key={i.id}>
                {i.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(i.image)} alt="" />
                ) : (
                  <div className="ph" />
                )}
                <div>
                  <h3>{i.title}</h3>
                  {i.note && <small>{i.note}</small>}
                  <div>
                    <button className="x-btn" onClick={() => remove(i.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="qty">
                  <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Меньше">
                    −
                  </button>
                  <span>{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Больше">
                    +
                  </button>
                </div>
                <b className="row-sum price">{formatPrice(i.price * i.qty)}</b>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <button className="x-btn" onClick={clear}>
              Очистить корзину
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span className="price">{formatPrice(total)}</span>
              <button
                className="btn btn-brown"
                onClick={() => {
                  setDone(true);
                  clear();
                }}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
