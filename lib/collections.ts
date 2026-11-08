/**
 * Авторские коллекции Pastila. Это КОНЦЕПЦИИ, а не утверждение, что все уже в продаже.
 * Новая коллекция = новая запись в массиве. `productIds` — id из lib/products.ts (может быть пустым).
 */
export type CollectionStatus = 'concept' | 'available' | 'coming-soon';

export type Collection = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: CollectionStatus;
  /** токен цвета из globals.css: фон карточки коллекции */
  tone: 'cinnabar' | 'yellow' | 'carnation' | 'bean' | 'beige';
  /** обложка из public/img (если нет, блок покажет композицию из товаров) */
  cover?: string;
  productIds: string[];
};

export const collections: Collection[] = [
  {
    slug: 'puffy',
    title: 'Puffy Collection',
    tagline: 'Объёмные, мягкие формы',
    description: 'Предметы, которые хочется потрогать: круглые, надутые, дружелюбные.',
    status: 'concept',
    tone: 'carnation',
    productIds: ['letters-custom', 'lamp-bubbles'],
  },
  {
    slug: 'color-therapy',
    title: 'Color Therapy',
    tagline: 'Яркие цветовые сочетания',
    description: 'Насыщенные оттенки и смелые пары: цвет как главный материал.',
    status: 'concept',
    tone: 'yellow',
    productIds: ['lamp-pleats', 'lamp-clover'],
  },
  {
    slug: 'soft-objects',
    title: 'Soft Objects',
    tagline: 'Плавные органические формы',
    description: 'Спокойные линии без острых углов: вазы и светильники, которые вписываются в любое пространство.',
    status: 'concept',
    tone: 'beige',
    productIds: ['lamp-scallop', 'lamp-swirl', 'lamp-column'],
  },
  {
    slug: 'holiday',
    title: 'Holiday Edition',
    tagline: 'Сезонные коллекции',
    description: 'Украшения и подарки к праздникам. Коллекция готовится.',
    status: 'coming-soon',
    tone: 'cinnabar',
    productIds: [],
  },
];
