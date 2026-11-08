'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AddToast from './cart/AddToast';
import './cart/cart.css';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
  note?: string;
  /** необязательно: ключ цвета из palette */
  colorKey?: string;
  /** необязательно: ссылка на страницу изделия */
  href?: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  /** true после чтения localStorage (до этого корзина считается незагруженной) */
  ready: boolean;
  add: (item: Omit<CartItem, 'qty'>) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'pastila-cart';
const MAX_QTY = 99;

/** Безопасно читает старые и повреждённые данные. */
function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const o = r as Record<string, unknown>;
    const price = Number(o.price);
    const qty = Math.floor(Number(o.qty));
    if (typeof o.id !== 'string' || typeof o.title !== 'string' || !isFinite(price) || price < 0) continue;
    out.push({
      id: o.id,
      title: o.title,
      price,
      qty: isFinite(qty) && qty > 0 ? Math.min(qty, MAX_QTY) : 1,
      image: typeof o.image === 'string' ? o.image : undefined,
      note: typeof o.note === 'string' ? o.note : undefined,
      colorKey: typeof o.colorKey === 'string' ? o.colorKey : undefined,
      href: typeof o.href === 'string' ? o.href : undefined,
    });
  }
  return out;
}

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<{ n: number; title: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    setItems(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const hideToast = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  const add = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: Math.min(p.qty + 1, MAX_QTY) } : p));
      return [...prev, { ...item, qty: 1 }];
    });
    seq.current += 1;
    setToast({ n: seq.current, title: item.title });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4500);
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    const q = Math.min(Math.floor(qty), MAX_QTY);
    setItems((prev) => (q <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty: q } : p))));
  }, []);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, add, setQty, remove, clear]
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      <AddToast toast={toast} onClose={hideToast} />
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}

const FKEY = 'pastila-fav';
export function useFavs() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FKEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch {}
    const onStorage = () => {
      try {
        setFavs(JSON.parse(localStorage.getItem(FKEY) || '[]'));
      } catch {}
    };
    window.addEventListener('pastila-fav', onStorage);
    return () => window.removeEventListener('pastila-fav', onStorage);
  }, []);
  const toggle = (id: string) => {
    let current: string[] = [];
    try {
      current = JSON.parse(localStorage.getItem(FKEY) || '[]');
    } catch {}
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(FKEY, JSON.stringify(next));
    } catch {}
    setFavs(next);
    window.dispatchEvent(new Event('pastila-fav'));
  };
  return { favs, toggle };
}
