// Кропы товаров для Hero из референса (public/img/reference.webp), увеличение x2 + лёгкая резкость.
const sharp = require('sharp');
const path = require('path');
const src = path.join(__dirname, '..', 'public', 'img', 'reference.webp');
const out = (n) => path.join(__dirname, '..', 'public', 'img', n);

const items = [
  ['hero-lamp.webp', { left: 772, top: 176, width: 214, height: 262 }],
  ['hero-vase.webp', { left: 596, top: 177, width: 150, height: 245 }],
  ['hero-candle.webp', { left: 472, top: 306, width: 126, height: 118 }],
  ['hero-switch.webp', { left: 198, top: 474, width: 141, height: 184 }],
];

(async () => {
  for (const [name, box] of items) {
    const info = await sharp(src)
      .extract(box)
      .resize(box.width * 2, box.height * 2, { kernel: 'lanczos3' })
      .sharpen({ sigma: 0.7 })
      .webp({ quality: 84 })
      .toFile(out(name));
    console.log(name, info.width + 'x' + info.height, info.size + 'B');
  }
})();
