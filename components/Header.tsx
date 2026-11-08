'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart, useFavs } from './CartProvider';
import { BagIcon, HeartIcon, SearchIcon } from './Icons';

const allNav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/generator', label: 'Генератор' },
  { href: '/about', label: 'О студии' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#reviews', label: 'Отзывы' },
];

const nav = allNav;

export default function Header() {
  const { count } = useCart();
  const { favs } = useFavs();
  const [open, setOpen] = useState(false);
  const isHome = usePathname() === '/';
  if (isHome) return null; // на главной своя панель в первом экране

  return (
    <header className="header">
      <div className="container header-in">
        <Link href="/" className="logo" aria-label="pastila — на главную" onClick={() => setOpen(false)}>
          pastila
        </Link>
        <nav id="main-nav" aria-label="Основная навигация" className={`nav ${open ? 'open' : ''}`}>
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
          <button className="burger" aria-label="Меню" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
