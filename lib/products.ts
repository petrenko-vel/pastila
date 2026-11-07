export type Category = 'switch' | 'vase' | 'lamp' | 'candle';

export type Product = {
  id: string;
  title: string;
  category: Category;
  color: string; // ключ из palette
  price: number;
  image: string;
  desc: string;
};

export const categoryNames: Record<Category, string> = {
  switch: 'Накладки на выключатели',
  vase: 'Вазы и кашпо',
  lamp: 'Лампы',
  candle: 'Свечи',
};

export const palette = [
  { key: 'cream', name: 'Сливочный', hex: '#ead9c6', mood: 'Спокойствие и мягкий свет утра' },
  { key: 'pink', name: 'Розовый', hex: '#ee8f9c', mood: 'Нежность и немного озорства' },
  { key: 'sand', name: 'Карамель', hex: '#c49a6c', mood: 'Тепло и уют по вечерам' },
  { key: 'olive', name: 'Оливковый', hex: '#6f7a35', mood: 'Свежесть и связь с природой' },
  { key: 'brown', name: 'Шоколад', hex: '#5a3322', mood: 'Глубина и характер' },
];

export const products: Product[] = [
  { id: 'vase-wave', title: 'Ваза «Волна»', category: 'vase', color: 'cream', price: 1990, image: '/img/thumb-vase.webp', desc: 'Волнистая ваза для сухоцветов и свежих веток.' },
  { id: 'switch-flower', title: 'Накладка «Цветок»', category: 'switch', color: 'pink', price: 590, image: '/img/thumb-switch.webp', desc: 'Объёмная накладка в форме цветка.' },
  { id: 'lamp-mushroom-olive', title: 'Лампа «Грибок»', category: 'lamp', color: 'olive', price: 3490, image: '/img/thumb-lamp.webp', desc: 'Настольная лампа с мягким рассеянным светом.' },
  { id: 'candle-bubble', title: 'Свеча «Бабл»', category: 'candle', color: 'cream', price: 890, image: '/img/thumb-candle.webp', desc: 'Декоративная свеча из шариков.' },
  { id: 'vase-rib', title: 'Ваза «Рифлёная»', category: 'vase', color: 'cream', price: 2190, image: '/img/cat-vase.webp', desc: 'Рельефные вертикальные линии и тёплый цвет.' },
  { id: 'lamp-mushroom-cream', title: 'Лампа «Молочный гриб»', category: 'lamp', color: 'cream', price: 3690, image: '/img/cat-lamp.webp', desc: 'Светильник с плафоном-шляпкой.' },
  { id: 'switch-flower-pink', title: 'Накладка «Ромашка»', category: 'switch', color: 'pink', price: 650, image: '/img/cat-switch.webp', desc: 'Маленький акцент большого настроения.' },
  { id: 'vase-wave-pink', title: 'Ваза «Розовая волна»', category: 'vase', color: 'pink', price: 2290, image: '/img/gen-vase-pink.webp', desc: 'Яркая ваза, на которую хочется смотреть.' },
];

export const formatPrice = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
