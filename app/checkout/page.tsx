'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useCart } from '../../components/CartProvider';
import { img } from '../../lib/base';
import { formatPrice } from '../../lib/products';
import { deliveryMethods, paymentMethods, submitOrder, type DeliveryMethod } from '../../lib/checkout';
import { itemColor } from '../../components/cart/cart-utils';

type Field = 'name' | 'phone' | 'email' | 'address' | 'consent';
type Errors = Partial<Record<Field, string>>;

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (!d) return '';
  if (d[0] === '8') d = '7' + d.slice(1);
  if (d[0] !== '7') d = '7' + d;
  d = d.slice(0, 11);
  let out = '+7';
  if (d.length > 1) out += ' (' + d.slice(1, 4);
  if (d.length >= 4) out += ')';
  if (d.length > 4) out += ' ' + d.slice(4, 7);
  if (d.length > 7) out += '-' + d.slice(7, 9);
  if (d.length > 9) out += '-' + d.slice(9, 11);
  return out;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function CheckoutPage() {
  const { items, ready, count, total } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<DeliveryMethod['id']>('delivery');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!ready) {
    return (
      <div className="page container ct-page">
        <div className="page-head">
          <h1>Оформление заказа</h1>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page container ct-page">
        <div className="page-head">
          <h1>Оформление заказа</h1>
        </div>
        <div className="ct-empty">
          <div className="ct-empty-mark" aria-hidden="true">
            ♡
          </div>
          <h2>Сначала добавьте что-нибудь в корзину</h2>
          <p>Оформлять пока нечего.</p>
          <div className="ct-empty-actions">
            <Link href="/catalog/" className="btn btn-brown">
              Перейти в каталог
            </Link>
            <Link href="/cart/" className="btn ct-btn-line">
              В корзину
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const needsAddress = deliveryMethods.find((m) => m.id === method)?.needsAddress ?? false;

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = 'Укажите имя, не короче двух символов.';
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 11) e.phone = 'Введите номер полностью, например +7 (900) 123-45-67.';
    if (!email.trim()) e.email = 'Укажите e-mail для связи по заказу.';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Проверьте e-mail: он должен выглядеть как name@example.com.';
    if (needsAddress && address.trim().length < 5) e.address = 'Укажите адрес доставки: город, улица, дом.';
    if (!consent) e.consent = 'Нужно согласие с политикой конфиденциальности и офертой.';
    return e;
  };

  const focusFirst = (e: Errors) => {
    const order: Field[] = ['name', 'phone', 'email', 'address', 'consent'];
    const first = order.find((k) => e[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setNotice(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirst(e);
      return;
    }
    setBusy(true);
    const res = await submitOrder({
      customer: { name: name.trim(), phone, email: email.trim() },
      delivery: { method, address: needsAddress ? address.trim() : undefined },
      paymentMethod: payment || undefined,
      comment: comment.trim() || undefined,
      items,
      total,
    });
    setBusy(false);
    if (res.ok) {
      setNotice('Заказ отправлен.');
    } else if (res.reason === 'not-configured') {
      setNotice('Заказ пока нельзя отправить: серверная часть магазина ещё не подключена. Мы сохранили вашу корзину.');
    } else {
      setNotice(res.message || 'Не удалось отправить заказ. Попробуйте ещё раз чуть позже. Корзина сохранена.');
    }
  };

  const clearErr = (k: Field) => setErrors((p) => (p[k] ? { ...p, [k]: undefined } : p));
  const err = (k: Field) => errors[k];
  const aria = (k: Field) => ({
    'aria-invalid': err(k) ? true : undefined,
    'aria-describedby': err(k) ? `ct-err-${k}` : undefined,
  });
  const Err = ({ k }: { k: Field }) =>
    err(k) ? (
      <p className="ct-err" id={`ct-err-${k}`}>
        {err(k)}
      </p>
    ) : null;

  return (
    <div className="page container ct-page ct-has-bar">
      <div className="page-head">
        <h1>Оформление заказа</h1>
        <p>
          <Link href="/cart/" className="ct-back">
            ← Вернуться в корзину
          </Link>
        </p>
      </div>

      <div className="ct-layout">
        <form ref={formRef} className="ct-form" onSubmit={onSubmit} noValidate id="ct-checkout-form">
          <fieldset className="ct-card">
            <legend>Контакты</legend>
            <div className="ct-field">
              <label htmlFor="ct-name">Имя</label>
              <input
                id="ct-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearErr('name');
                }}
                {...aria('name')}
              />
              <Err k="name" />
            </div>
            <div className="ct-two">
              <div className="ct-field">
                <label htmlFor="ct-phone">Телефон</label>
                <input
                  id="ct-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    clearErr('phone');
                  }}
                  {...aria('phone')}
                />
                <Err k="phone" />
              </div>
              <div className="ct-field">
                <label htmlFor="ct-email">E-mail</label>
                <input
                  id="ct-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearErr('email');
                  }}
                  {...aria('email')}
                />
                <Err k="email" />
              </div>
            </div>
          </fieldset>

          <fieldset className="ct-card">
            <legend>Получение</legend>
            <div className="ct-methods" role="radiogroup" aria-label="Способ получения">
              {deliveryMethods.map((m) => (
                <label key={m.id} className={'ct-method' + (method === m.id ? ' on' : '')}>
                  <input
                    type="radio"
                    name="delivery"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => {
                      setMethod(m.id);
                      clearErr('address');
                    }}
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
            {needsAddress ? (
              <div className="ct-field">
                <label htmlFor="ct-address">Адрес доставки</label>
                <input
                  id="ct-address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Город, улица, дом, квартира"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    clearErr('address');
                  }}
                  {...aria('address')}
                />
                <Err k="address" />
              </div>
            ) : (
              <p className="ct-hint">Детали самовывоза мы уточним с вами после оформления.</p>
            )}
          </fieldset>

          {paymentMethods.length > 0 && (
            <fieldset className="ct-card">
              <legend>Оплата</legend>
              <div className="ct-methods" role="radiogroup" aria-label="Способ оплаты">
                {paymentMethods.map((p) => (
                  <label key={p.id} className={'ct-method' + (payment === p.id ? ' on' : '')}>
                    <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="ct-card">
            <legend>Комментарий</legend>
            <div className="ct-field">
              <label htmlFor="ct-comment">Пожелания к заказу (необязательно)</label>
              <textarea id="ct-comment" name="comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </fieldset>

          <div className="ct-consent">
            <label className="ct-check">
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  clearErr('consent');
                }}
                {...aria('consent')}
              />
              <span>
                Я согласен(на) с{' '}
                <Link href="/privacy/" target="_blank">
                  политикой конфиденциальности
                </Link>{' '}
                и{' '}
                <Link href="/offer/" target="_blank">
                  офертой
                </Link>
              </span>
            </label>
            <Err k="consent" />
          </div>

          {notice && (
            <div className="ct-notice" role="alert">
              <p>{notice}</p>
              <Link href="/cart/" className="ct-back">
                Вернуться в корзину
              </Link>
            </div>
          )}
        </form>

        <aside className="ct-summary ct-summary-sticky" aria-label="Состав заказа">
          <h2>Ваш заказ</h2>
          <ul className="ct-mini">
            {items.map((i) => {
              const c = itemColor(i);
              return (
                <li key={i.id}>
                  {i.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img(i.image)} alt="" width={48} height={48} loading="lazy" />
                  ) : (
                    <div className="ct-ph" aria-hidden="true" />
                  )}
                  <div>
                    <b>{i.title}</b>
                    <small>
                      {c && <span className="ct-dot" style={{ background: c.hex }} aria-hidden="true" />}
                      {i.note ? i.note + ' · ' : ''}
                      {i.qty} шт.
                    </small>
                  </div>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </li>
              );
            })}
          </ul>
          <div className="ct-sum-total">
            <span>
              Итого, {count} шт.
            </span>
            <b>{formatPrice(total)}</b>
          </div>
          <button type="submit" form="ct-checkout-form" className="btn btn-brown ct-sum-btn" disabled={busy}>
            {busy ? 'Отправляем…' : 'Отправить заказ'}
          </button>
        </aside>
      </div>
    </div>
  );
}
