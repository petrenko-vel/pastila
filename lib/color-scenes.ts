import type { Shape } from '../components/shape-models';

/**
 * Данные блока «Один предмет — множество настроений».
 * Новая сцена или новый предмет = запись в массиве.
 */

export type ItemDef = {
  key: Shape;
  name: string;
  /** подпись под названием */
  note: string;
  /** относительный размер на сцене (доля ширины сцены, %) */
  size: number;
  /**
   * Для будущих реальных фото: путь из public/ для каждого цвета (ключ из palette).
   * Если для выбранного цвета путь есть, показывается фото вместо модели.
   * Пока пусто: фото цветов не придумываем и фильтрами не красим.
   */
  variants?: Record<string, string>;
};

export const items: ItemDef[] = [
  { key: 'lamp', name: 'Лампа', note: 'Плафон из 3D-модели: цвет меняется на лету, лампу можно вращать', size: 30 },
  { key: 'vase', name: 'Ваза', note: 'Мягкая форма, которая держит букет и интерьер', size: 15 },
  { key: 'candle', name: 'Свеча', note: 'Объёмная свеча из пузырей', size: 19 },
  { key: 'letters', name: 'Буквы', note: 'Слово из объёмных букв', size: 24 },
];

export type Furniture = 'nightstand' | 'desk' | 'sofa' | 'shelf';

export type SceneDef = {
  key: string;
  name: string;
  /** какая силуэтная мебель рисуется (CSS/SVG, не фото) */
  furniture: Furniture;
  /** цвета подложки: стена и пол (цвета бренда) */
  wall: string;
  floor: string;
  /** цвет силуэтов мебели */
  furnitureColor: string;
  /** где стоит предмет: x — центр, % ширины; base — высота опоры от низа сцены, % высоты */
  spot: { x: number; base: number };
  /** множитель размера предмета в этой сцене */
  scale: number;
  /** положение мягкого света (% ширины / высоты) */
  light: { x: number; y: number };
  /** необязательно: реальное интерьерное фото (путь из public/) — заменит нарисованную сцену */
  photo?: string;
};

// DEMO: нарисованные сцены, не фотографии. Цвета только из палитры бренда.
export const scenes: SceneDef[] = [
  {
    key: 'bedroom',
    name: 'Спальня',
    furniture: 'nightstand',
    wall: '#FFE8D9',
    floor: '#FFB497',
    furnitureColor: '#F7F4DA',
    spot: { x: 50, base: 41 },
    scale: 1,
    light: { x: 50, y: 40 },
  },
  {
    key: 'desk',
    name: 'Рабочий стол',
    furniture: 'desk',
    wall: '#F7F4DA',
    floor: '#E8E8EB',
    furnitureColor: '#FFE8D9',
    spot: { x: 36, base: 45 },
    scale: 0.92,
    light: { x: 36, y: 38 },
  },
  {
    key: 'living',
    name: 'Гостиная',
    furniture: 'sofa',
    wall: '#FFF3EA',
    floor: '#FFE8D9',
    furnitureColor: '#FFA6C2',
    spot: { x: 76, base: 40 },
    scale: 1.05,
    light: { x: 74, y: 40 },
  },
  {
    key: 'nook',
    name: 'Уютный уголок',
    furniture: 'shelf',
    wall: '#FFB497',
    floor: '#FFE8D9',
    furnitureColor: '#FFF3EA',
    spot: { x: 50, base: 52 },
    scale: 0.88,
    light: { x: 50, y: 38 },
  },
];

export const defaultItem: Shape = 'lamp';
export const defaultColor = 'pink';
export const defaultScene = 'bedroom';
