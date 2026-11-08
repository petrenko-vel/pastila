# Pastila — карта проекта и дизайн-система

Документ для всех, кто работает над сайтом. Развиваем существующий проект, а не пишем заново.

## 1. Стек и устройство

- Next.js 14 (App Router), React 18, TypeScript strict. Статический экспорт (`output: 'export'`, `trailingSlash: true`), публикация на GitHub Pages с `basePath` из `NEXT_PUBLIC_BASE_PATH`.
- Импорты только относительные (алиас `@/` не работает). Ссылки на файлы из `public/` (картинки, видео, модели) всегда оборачивать в `img()` из `lib/base.ts`, иначе на GitHub Pages они сломаются. Внутренние ссылки через `next/link`.
- Нельзя `next/image` с оптимизацией (экспорт), используем обычный `<img>` с `width`/`height` (и `// eslint-disable-next-line @next/next/no-img-element`).
- Новые зависимости не добавляем (уже есть `three` для 3D-лампы).
- Динамические маршруты возможны только со `generateStaticParams`.
- Корзина и избранное хранятся в `localStorage` (`components/CartProvider.tsx`). Сервера нет.

## 2. Что уже есть (аудит)

Страницы: `/` главная, `/catalog`, `/generator`, `/cart`, `/privacy`, `/offer`, `/agreement`, `/delivery`, `/returns` (последние пять: заготовки без юридического текста).

Главная (`app/page.tsx`), сверху вниз:
1. **Hero** — `components/HeroCarousel.tsx` + `hero-carousel.css`: заголовок, карусель из 10 видео-карточек (3 карточки со своими роликами: `public/videos/*`), рукописные пометки, кнопки в каталог и генератор. НЕ ТРОГАТЬ.
2. **«Что печатаем»** — оранжевая панель с четырьмя карточками категорий (классы `works*`, `work-*`).
3. **«Мы всё продумали до мелочей»** (классы `thought*`) — четыре цветные карточки с фоновыми картинками `public/img/thought-1..4.webp`. Картинки удалять запрещено, текст править можно.
4. Отзывы (`ReviewsBlock` в `components/HomeClient.tsx`).
5. Скрыты флагом `SHOW_HIDDEN_BLOCKS` (`lib/flags.ts`): «Цветовая палитра», «Напечатали за 24ч», баннер генератора, «О нас», FAQ. Не удалять.
6. Футер (`components/Footer.tsx`): бегущая строка, светлая панель, розовый логотип, вращающаяся 3D-лампа.

Каталог: вкладки категорий, кнопка «Фильтры» (цвет, избранное), поиск, карточки `.pcard`. Генератор: ваза, свеча, лампа (3D), буквы; цвет, размер, цена, корзина. Корзина: список, количество, итог (оформления заказа нет).

Данные: `lib/products.ts` — `products` (демо-товары, цены и названия временные), `palette` (11 реальных цветов студии), `categoryNames`, `formatPrice`. Фото товаров сейчас временные (чужие), их заменят на свои.

## 3. Дизайн-система (не менять, использовать)

Цвета (CSS-переменные в `app/globals.css`, брать только их, новых цветов не добавлять):
- `--cinnabar #F0592E` — главный акцент (кнопки, выделения, стрелки).
- `--yellow #F7D943` — второй акцент (маркер, плашки, баннеры).
- `--carnation #FFA6C2` — розовый (бейджи, пилюли).
- `--mimosa #F7F4DA`, `--bg #FFF3EA` (фон сайта), `--beige/--bg-2 #FFE8D9` (персиковые карточки).
- `--bean #1E1E1E` — текст и тёмные кнопки, `--muted #6B6757` — второстепенный текст.
- Пастельные производные, уже используемые: оранжевая плашка `#FFB497`, розовые акценты `#FF8FB8`, `#D81B60` (только бегущая строка), светло-серый `#E8E8EB`/`#E9E9EB` (сцена генератора), кнопка «Собрать» `#FB7449`.
- Цвета изделий (`palette` в `lib/products.ts`) — это цвета пластика, не цвета интерфейса.

Типографика: заголовки и логотип — Jost 800 (`var(--font-logo)`), основной текст — Montserrat (`var(--font-main)`), рукописные пометки — Caveat (подключён в `HeroCarousel`, переменная `--hc-font-note`), заголовок hero — Inter Tight. Заголовки блоков обычно капсом Jost 800 (`.thought-head h2`, `.work-title`) или Montserrat 800.

Форма: большие скругления (`--radius: 28px`; карточки 22–40px, кнопки и чипы — пилюли 999px). Контейнер `container wide` (max-width 1360px, боковые отступы 24px, на телефоне 16px). Сетка блоков главной: `margin-top` 56–84px.

Компоненты, которые нужно переиспользовать:
- Кнопки: `.btn .btn-brown` (тёмная), `.btn-sm`, пилюли футера `.foot-pill`, оранжевая «Собрать» (`.prow-stack .btn`).
- Чипы и фильтры: `.chip`, `.chip.on`; цветные кружки `.pdot` (`.on` — выбранный).
- Карточка товара: `.pcard` (+ `.pimg`, `.pbody`, `.prow`, `.price`), иконка сердца `.heart-mini`.
- Появление при скролле: `components/Reveal.tsx` (`delay` в мс).
- Иконки: `components/Icons.tsx` (ArrowIcon, ArrowUpRightIcon, HeartIcon, PlusIcon, SunIcon, FilterIcon…).
- Избранное: `useFavs()`, корзина: `useCart()` из `components/CartProvider.tsx`.
- 3D-плафон: `components/LampViewer.tsx` (пропсы `color`, `interactive`, `spin`, `glow`, `tilt`, `lean`).

Состояния: hover — подъём на 2–6px и/или смена цвета на `--bean`; focus-visible — контур 3px (`--bean` на светлом, `--yellow` в футере); active — `scale(.98)`; всё с `prefers-reduced-motion`. Анимации только осмысленные (появление, hover, лёгкое покачивание).

Адаптив: брейкпоинты 1023px (планшет/телефон) и 560px (телефон). Никакого горизонтального скролла.

## 4. Правила совместной работы

- Каждый агент правит только свои файлы (см. ниже), общие файлы (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `Header.tsx`, `lib/flags.ts`, `lib/base.ts`) правит только Technical Lead. Свои стили агент кладёт в свой `*.css` рядом с компонентом и импортирует его из компонента. Классы с префиксом блока (например `bs-`, `kit-`), чтобы не конфликтовать.
- Hero, `HeroCarousel`, блок «Мы всё продумали» (и его картинки) не трогать.
- Не выдумывать цены, наличие, отзывы, характеристики, контакты, юридический текст. Если данных нет, делается структура (поле `null`/`undefined` в данных) и нейтральная подпись; всё демонстрационное помечается в данных комментарием `// DEMO`.
- Картинки только из `public/img` и `public/videos`. Чужие фото в проекте временные: подписывать как «временное фото» не нужно, но данные должны позволять легко заменить путь.
- Проверка: `npx tsc --noEmit --incremental false -p tsconfig.json`. `next dev`/`next build` параллельно не запускать (общая папка `.next`).

## 5. Контракты между блоками

- Страница товара: `/product/<id>/` (id из `lib/products.ts`).
- Фильтры каталога через query: `?cat=<category>`, `?color=<paletteKey>`, `?collection=<slug>` (slug из `lib/collections.ts`), `?fav=1`.
- Корзина: `useCart().add({ id, title, price, image, note })`. Для изделия с выбранным цветом `id = \`${product.id}__${colorKey}\``, `note = \`Цвет: ${color.name}\``. Количество увеличивается автоматически, если такой `id` уже есть.
- Коллекции: `lib/collections.ts` (данные), новая коллекция добавляется записью в массив.
- Контакты, соцсети, e-mail: `lib/site-config.ts`; пустые значения не выводятся.

## 6. Распределение зон

| Агент | Файлы |
|---|---|
| 00 Tech Lead | `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `Header.tsx`, `lib/flags.ts`, интеграция, сборка, деплой |
| 01 Design System | этот документ (его ведёт Tech Lead) |
| 02 Homepage | `components/home/{Bestsellers,InteriorKits,NewArrivals,RealLife,BrandStory,Packaging}.tsx`, `components/home/home-blocks.css`, `lib/home-data.ts` |
| 03 Collections | `components/collections/*`, `lib/collections.ts` |
| 04 Color Experience | `components/color-experience/*`, `lib/color-scenes.ts`, `components/shape-models.tsx`, `app/generator/page.tsx` |
| 05 Product & Catalog | `app/product/**`, `components/product/*`, `app/catalog/*`, `lib/products.ts` (только добавлять), `lib/product-details.ts` |
| 06 Cart & Checkout | `components/CartProvider.tsx`, `app/cart/page.tsx`, `app/checkout/page.tsx`, `components/cart/*` |
| 07 Production, FAQ, Footer | `components/home/{ProductionStory,Faq}.tsx`, `components/home/story-blocks.css`, `components/Footer.tsx`, `lib/site-config.ts` |
| 08 QA | проверка и исправления по результатам; правки только точечные |
