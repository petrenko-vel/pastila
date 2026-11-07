'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart, useFavs } from './CartProvider';
import { BagIcon, HeartIcon, SearchIcon } from './Icons';

const nav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/generator', label: 'Генератор' },
  { href: '/#about', label: 'О студии' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#reviews', label: 'Отзывы' },
];

export default function Header() {
  const { count } = useCart();
  const { favs } = useFavs();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-in">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          pastila
        </Link>
        <nav className={`nav ${open ? 'open' : ''}`}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/catalog?focus=search" aria-label="Поиск" className="icon-btn">
            <SearchIcon />
          </Link>
          <Link href="/catalog?fav=1" aria-label="Избранное" className="icon-btn fav-btn">
            <HeartIcon />
            {favs.length > 0 && <span className="dot">{favs.length}</span>}
          </Link>
          <Link href="/cart" aria-label="Корзина" className="icon-btn bag-btn">
            <BagIcon />
          </Link>
          <Link href="/cart" className="cart-pill">
            Корзина ({count})
          </Link>
          <button className="burger" aria-label="Меню" onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
