import type { Metadata } from 'next';
import { Jost, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../components/CartProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';

const jost = Jost({ subsets: ['latin', 'cyrillic'], weight: ['500', '700', '800'], variable: '--font-logo', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700', '800'], variable: '--font-main', display: 'swap' });

export const metadata: Metadata = {
  title: 'pastila — дизайнерские вазы, светильники и декор из 3D-печати',
  description:
    'Придумываем необычные формы, печатаем их на 3D-принтере, а цвет выбираешь ты: вазы, светильники, свечи и накладки на выключатели. Готовое в каталоге, свой вариант в генераторе.',
  openGraph: {
    title: 'pastila — дизайнерские вазы, светильники и декор из 3D-печати',
    description: 'Необычные формы по собственным моделям, печать на 3D-принтере, выбор цвета. Каталог и генератор.',
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jost.variable} ${montserrat.variable}`}>
      <body id="top">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
