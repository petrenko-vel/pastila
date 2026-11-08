/**
 * Характеристики и дополнительные материалы товаров.
 * Реальных значений пока нет: всё неизвестное = null, в интерфейсе показывается «Уточняется».
 * Чтобы добавить данные, создайте запись в `productDetails` по id товара из lib/products.ts.
 * Пример:
 *   'lamp-medusa': { heightCm: 32, widthCm: 20, weightG: 640, leadTime: '3–5 дней', interiorImage: '/img/medusa-interior.webp' }
 */
export type Review = { author: string; rating: number; text: string; date: string };

export type ProductDetails = {
  heightCm?: number | null;
  widthCm?: number | null;
  depthCm?: number | null;
  weightG?: number | null;
  /** точный материал/тип пластика, если известен */
  material?: string | null;
  /** наличие, например «Под заказ» */
  availability?: string | null;
  /** срок изготовления */
  leadTime?: string | null;
  /** фото в реальном интерьере (public/img) */
  interiorImage?: string;
  /** видео или 360° (public/videos) */
  video?: string;
  reviews?: Review[];
};

/** Общие факты, известные про все изделия студии */
export const commonFacts: string[] = [
  'Печатается на 3D-принтере',
  'Пластик',
  'Собственная модель студии',
];

export const productDetails: Record<string, ProductDetails> = {};

export const emptyDetails: ProductDetails = {};

export const getDetails = (id: string): ProductDetails => productDetails[id] ?? emptyDetails;
