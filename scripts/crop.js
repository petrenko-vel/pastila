// Вырезает картинки из референса (public/img/reference.webp, 1024x1536)
const sharp = require('sharp');
const path = require('path');
const src = path.join(__dirname, '..', 'public', 'img', 'reference.webp');
const out = (n) => path.join(__dirname, '..', 'public', 'img', n);

async function px(x, y) {
  const { data } = await sharp(src).extract({ left: x, top: y, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2] };
}

async function crop(name, [l, t, w, h], quality = 88) {
  await sharp(src).extract({ left: l, top: t, width: w, height: h }).webp({ quality }).toFile(out(name));
  console.log('ok', name, w + 'x' + h);
}

(async () => {
  const meta = await sharp(src).metadata();
  console.log('size', meta.width, meta.height);
  const bg = await px(20, 700);
  console.log('page bg', bg);
  for (const [n, x, y] of [['card pink', 100, 650], ['card beige', 400, 650], ['card green', 700, 480], ['brown btn', 80, 394], ['title brown', 100, 190], ['olive', 600, 300], ['pink', 1000, 1270], ['banner', 100, 1000], ['faq card', 780, 1250]]) {
    console.log(n, await px(x, y));
  }

  // HERO: правая часть, закрашиваем элементы навигации и текст фоном страницы
  const heroBox = { left: 335, top: 0, width: 689, height: 452 };
  // закрашиваем тексты: берём чистую колонку пикселей рядом и растягиваем по ширине
  const fillDefs = [
    { l: 790, t: 0, w: 234, h: 62, col: 1006 }, // иконки шапки
    { l: 335, t: 0, w: 245, h: 62, col: 480 }, // меню
    { l: 335, t: 100, w: 138, h: 132, col: 473 }, // «pastila»
    { l: 335, t: 225, w: 55, h: 78, col: 392 }, // конец заголовка
  ];
  const fills = [];
  for (const f of fillDefs) {
    const colBuf = await sharp(src)
      .extract({ left: f.col, top: f.t, width: 2, height: f.h })
      .resize(f.w, f.h, { fit: 'fill', kernel: 'nearest' })
      .blur(2)
      .png()
      .toBuffer();
    fills.push({ input: colBuf, left: f.l - heroBox.left, top: f.t - heroBox.top });
  }
  const heroBuf = await sharp(src).extract(heroBox).toBuffer();
  await sharp(heroBuf).composite(fills).webp({ quality: 90 }).toFile(out('hero.webp'));
  console.log('ok hero.webp');

  // карточки категорий (правая часть)
  await crop('cat-switch.webp', [196, 472, 148, 193]);
  await crop('cat-vase.webp', [500, 472, 163, 193]);
  await crop('cat-lamp.webp', [828, 472, 155, 193]);

  // палитра в жизни
  await crop('palette-photo.webp', [260, 710, 260, 214]);

  // напечатали за 24ч
  await crop('thumb-vase.webp', [562, 766, 92, 121]);
  await crop('thumb-switch.webp', [673, 766, 92, 121]);
  await crop('thumb-lamp.webp', [784, 766, 92, 121]);
  await crop('thumb-candle.webp', [893, 766, 92, 121]);

  // генератор
  await crop('gen-art.webp', [400, 928, 624, 262]);
  await crop('gen-vase-pink.webp', [770, 962, 154, 218]);

  // отзывы / о нас
  await crop('avatar.webp', [60, 1335, 60, 60]);
  await crop('about-printer.webp', [598, 1238, 115, 185]);
})();
