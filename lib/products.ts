export type Category = 'lamp' | 'shade' | 'vase' | 'switch' | 'letters' | 'other';

export type Product = {
  id: string;
  title: string;
  category: Category;
  color: string; // ключ из palette
  price: number;
  image: string;
  desc: string;
  /** если задан, вместо «В корзину» кнопка ведёт по ссылке (например в генератор) */
  href?: string;
  cta?: string;
  priceFrom?: boolean;
  /** дополнительные фото товара (public/img); основное фото `image` показывается первым */
  gallery?: string[];
};

export const categoryNames: Record<Category, string> = {
  lamp: 'Настольные лампы',
  shade: 'Плафоны',
  vase: 'Вазы',
  switch: 'Накладки',
  letters: 'Буквы',
  other: 'Другое',
};

// Цвета пластика, которые есть у студии. Доступны для любого изделия.
export const palette = [
  { key: 'pink', name: 'Розовый', hex: '#ee8f9c', mood: 'Нежность и немного озорства' },
  { key: 'gray', name: 'Тёмно-серый', hex: '#55585c', mood: 'Спокойный графит' },
  { key: 'black', name: 'Чёрный', hex: '#17171a', mood: 'Контраст и чёткие линии' },
  { key: 'orange', name: 'Оранжевый', hex: '#f07a1f', mood: 'Тепло и энергия' },
  { key: 'red', name: 'Красный', hex: '#d62828', mood: 'Яркий акцент' },
  { key: 'green', name: 'Зелёный', hex: '#4c9a4a', mood: 'Свежесть и природа' },
  { key: 'purple', name: 'Фиолетовый', hex: '#7a4fb5', mood: 'Необычный и чуть загадочный' },
  { key: 'yellow', name: 'Жёлтый', hex: '#f7d943', mood: 'Солнечное настроение' },
  { key: 'brown', name: 'Коричневый', hex: '#6b3d26', mood: 'Тёплая глубина' },
  { key: 'white', name: 'Белый', hex: '#f6f3ee', mood: 'Чистый и светлый' },
  { key: 'beige', name: 'Бежевый', hex: '#dcc7a8', mood: 'Мягкий нейтральный тон' },
];

export const products: Product[] = [
  {
    id: 'letters-custom',
    title: 'Воздушные буквы',
    category: 'letters',
    color: 'pink',
    price: 450,
    priceFrom: true,
    image: '/img/letters-1.webp',
    desc: 'Слово или имя из объёмных букв. Цена за одну букву.',
    href: '/generator?shape=letters',
    cta: 'Собрать',
  },
  { id: 'lamp-medusa', title: 'Лампа «Медуза»', category: 'lamp', color: 'pink', price: 4290, image: '/img/lamp-1.webp', desc: 'Розовый купол с длинными нитями и подсветкой.' },
  { id: 'lamp-bubbles', title: 'Лампа «Пузыри»', category: 'lamp', color: 'beige', price: 3790, image: '/img/lamp-2.webp', desc: 'Плафон и основание из объёмных пузырей.' },
  { id: 'lamp-pleats', title: 'Лампа «Складки»', category: 'lamp', color: 'orange', price: 3490, image: '/img/lamp-3.webp', desc: 'Гофрированный плафон на четырёх ножках.' },
  { id: 'lamp-clover', title: 'Лампа «Клевер»', category: 'lamp', color: 'pink', price: 3690, image: '/img/lamp-4.webp', desc: 'Светильник с плафоном-цветком.' },
  { id: 'lamp-scallop', title: 'Лампа «Волна»', category: 'lamp', color: 'pink', price: 3990, image: '/img/lamp-5.webp', desc: 'Плафон с волнистым краем на ребристой ножке.' },
  { id: 'lamp-column', title: 'Лампа «Колонна»', category: 'lamp', color: 'beige', price: 3890, image: '/img/lamp-6.webp', desc: 'Ребристый цилиндр из двух частей.' },
  { id: 'lamp-swirl', title: 'Лампа «Вихрь»', category: 'lamp', color: 'white', price: 4190, image: '/img/lamp-7.webp', desc: 'Плафон с закрученными рёбрами.' },
  { id: 'lamp-cube', title: 'Лампа «Куб»', category: 'lamp', color: 'white', price: 3590, image: '/img/lamp-8.webp', desc: 'Квадратный плафон с тонким рифлением.' },
];

export const formatPrice = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
