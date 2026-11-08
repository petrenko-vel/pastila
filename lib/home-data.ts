/**
 * Данные блоков главной. Всё, что помечено // DEMO, демонстрационное: заменить на реальное.
 * Пути к картинкам без base: компоненты оборачивают их в img().
 */

// DEMO: реальных продаж пока нет, "бестселлеры" выбраны вручную. Первый id показывается крупно.
export const bestsellerIds: string[] = ['lamp-medusa', 'lamp-bubbles', 'lamp-pleats', 'lamp-column', 'letters-custom'];

export type NewStatus = 'new' | 'limited' | 'soon';
export const newStatusLabel: Record<NewStatus, string> = {
  new: 'Новинка',
  limited: 'Лимитированная серия',
  soon: 'Скоро в продаже',
};

// DEMO: статусы и подписи условные
export const newArrivals: { id: string; status: NewStatus; note: string }[] = [
  { id: 'lamp-clover', status: 'new', note: 'Плафон-цветок из свежей партии' },
  { id: 'lamp-scallop', status: 'new', note: 'Волнистый край, ребристая ножка' },
  { id: 'lamp-swirl', status: 'limited', note: 'Небольшая партия, пробуем форму' },
  { id: 'lamp-cube', status: 'soon', note: 'Дорабатываем рифление' },
];

export type KitItem = {
  /** id товара из lib/products.ts */
  id: string;
  /** позиция в сцене, % от ширины/высоты сцены (центр предмета) */
  x: number;
  y: number;
  /** ширина предмета, % от ширины сцены */
  w: number;
  /** поворот, градусы */
  rot?: number;
};
export type Kit = {
  key: string;
  label: string;
  tagline: string;
  /** фон сцены: токен бренда */
  wall: 'yellow' | 'carnation' | 'beige' | 'mimosa';
  items: KitItem[];
};

// DEMO: состав комплектов собран из существующих изделий, это не готовые наборы в продаже
export const kits: Kit[] = [
  {
    key: 'desk',
    label: 'Рабочий стол',
    tagline: 'Свет и буквы, чтобы за столом хотелось сидеть',
    wall: 'yellow',
    items: [
      { id: 'lamp-cube', x: 24, y: 46, w: 20, rot: -3 },
      { id: 'letters-custom', x: 66, y: 28, w: 22, rot: 4 },
      { id: 'lamp-column', x: 82, y: 52, w: 14, rot: 2 },
    ],
  },
  {
    key: 'bedroom',
    label: 'Спальня',
    tagline: 'Мягкий свет по обе стороны кровати',
    wall: 'carnation',
    items: [
      { id: 'lamp-medusa', x: 20, y: 52, w: 22, rot: -2 },
      { id: 'lamp-clover', x: 80, y: 54, w: 20, rot: 3 },
    ],
  },
  {
    key: 'living',
    label: 'Гостиная',
    tagline: 'Несколько ламп разной формы на одной полке',
    wall: 'mimosa',
    items: [
      { id: 'lamp-bubbles', x: 26, y: 26, w: 19, rot: -3 },
      { id: 'lamp-scallop', x: 56, y: 26, w: 19, rot: 2 },
      { id: 'lamp-swirl', x: 76, y: 63.6, w: 18, rot: -2 },
      { id: 'letters-custom', x: 30, y: 63.6, w: 18, rot: 3 },
    ],
  },
  {
    key: 'nook',
    label: 'Уютный уголок',
    tagline: 'Один тёплый акцент рядом с креслом',
    wall: 'beige',
    items: [
      { id: 'lamp-pleats', x: 70, y: 44, w: 20, rot: 2 },
      { id: 'lamp-clover', x: 28, y: 62.4, w: 17, rot: -4 },
    ],
  },
];

/** Фото покупателей. Пока пусто: блок показывает приглашение. Формат: { src: '/img/...', alt: '...' } */
export const customerPhotos: { src: string; alt: string }[] = [];

/** Ссылка на Instagram студии. Пусто: ссылка не показывается. */
export const instagramUrl = '';

// DEMO: временные фото ламп, заменить на фото изделий в интерьерах
export const interiorPhotos: { src: string; alt: string; productId: string }[] = [
  { src: '/img/lamp-1.webp', alt: 'Розовая лампа с длинными нитями', productId: 'lamp-medusa' },
  { src: '/img/lamp-4.webp', alt: 'Лампа с плафоном-цветком', productId: 'lamp-clover' },
  { src: '/img/lamp-3.webp', alt: 'Гофрированная лампа на ножках', productId: 'lamp-pleats' },
  { src: '/img/lamp-7.webp', alt: 'Белая лампа с закрученными рёбрами', productId: 'lamp-swirl' },
  { src: '/img/lamp-2.webp', alt: 'Лампа из объёмных пузырей', productId: 'lamp-bubbles' },
];

export const brandStory = {
  lead: 'Мы небольшая студия. Придумываем собственные модели и печатаем их на 3D-принтерах.',
  text: 'Хочется, чтобы привычные вещи, вроде лампы, вазы или накладки на выключатель, не терялись в интерьере, а радовали каждый день. Поэтому формы у нас мягкие, цвета чистые, а в каждой модели есть что-то неожиданное.',
  steps: [
    { title: 'Рисуем', text: 'Начинаем с эскиза и 3D-модели. Форму придумываем сами, не копируем чужие.' },
    { title: 'Пробуем', text: 'Печатаем тестовые образцы, смотрим на свет, вертим в руках, переделываем.' },
    { title: 'Печатаем', text: 'Готовое изделие печатаем в выбранном вами цвете из нашей палитры.' },
  ],
  details: 'Детали решают всё: как ложится свет через стенку плафона, как ощущаются края, как цвет смотрится рядом с вашей мебелью.',
  photo: '/img/about-printer.webp',
};

// DEMO: тексты упаковки нейтральные; photo заполнить, когда появятся реальные фото упаковки
export const packaging: {
  photo: string | null;
  items: { key: string; title: string; text: string; href?: string }[];
} = {
  photo: null,
  items: [
    { key: 'box', title: 'Фирменная упаковка', text: 'Изделие приезжает в аккуратной коробке с нашей символикой, а не в безликом пакете.' },
    { key: 'prep', title: 'Подготовка заказа', text: 'Перед отправкой осматриваем каждое изделие и бережно упаковываем, чтобы оно доехало целым.' },
    { key: 'gift', title: 'Подарочные варианты', text: 'Если заказ в подарок, напишите об этом при оформлении, и мы подумаем, как его оформить.' },
    { key: 'ship', title: 'Доставка', text: 'Способы и условия доставки собраны на отдельной странице.', href: '/delivery/' },
  ],
};
