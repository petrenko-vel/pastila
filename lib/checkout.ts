import type { CartItem } from '../components/CartProvider';

/** Способы получения. Цен, сроков и служб нет: это структура на будущее. */
export type DeliveryMethod = {
  id: 'delivery' | 'pickup';
  label: string;
  hint?: string;
  /** нужно ли поле адреса */
  needsAddress: boolean;
};

export const deliveryMethods: DeliveryMethod[] = [
  { id: 'delivery', label: 'Доставка', needsAddress: true },
  { id: 'pickup', label: 'Самовывоз', needsAddress: false },
];

/** Способы оплаты. Пока пусто: в интерфейсе блок не показывается. */
export type PaymentMethod = { id: string; label: string; hint?: string };
export const paymentMethods: PaymentMethod[] = [];

export type OrderPayload = {
  customer: { name: string; phone: string; email: string };
  delivery: { method: DeliveryMethod['id']; address?: string };
  paymentMethod?: string;
  comment?: string;
  items: CartItem[];
  total: number;
};

export type SubmitResult =
  | { ok: true; orderId?: string }
  | { ok: false; reason: 'not-configured' | 'network' | 'rejected'; message?: string };

/** Станет true, когда появится серверная часть (API заказов). */
export const isCheckoutConfigured = false;

export async function submitOrder(order: OrderPayload): Promise<SubmitResult> {
  if (!isCheckoutConfigured) return { ok: false, reason: 'not-configured' };
  // TODO: отправка order на сервер, когда он появится.
  void order;
  return { ok: false, reason: 'not-configured' };
}
