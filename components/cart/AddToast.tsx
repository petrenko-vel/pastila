'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AddToast({
  toast,
  onClose,
}: {
  toast: { n: number; title: string } | null;
  onClose: () => void;
}) {
  const path = usePathname() || '';
  const hidden = path.startsWith('/cart') || path.startsWith('/checkout');
  return (
    <div className="ct-toast-region" role="status" aria-live="polite">
      {toast && !hidden && (
        <div className="ct-toast" key={toast.n}>
          <div className="ct-toast-text">
            <b>Добавлено в корзину</b>
            <span>{toast.title}</span>
          </div>
          <Link href="/cart/" className="ct-toast-link" onClick={onClose}>
            Перейти в корзину
          </Link>
          <button type="button" className="ct-toast-x" onClick={onClose} aria-label="Закрыть уведомление">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
