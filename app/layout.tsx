import type { Metadata } from 'next';
import { Jost, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../components/CartProvider';
import Header from '../components/Header';

const jost = Jost({ subsets: ['latin', 'cyrillic'], weight: ['500', '700', '800'], variable: '--font-logo', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700', '800'], variable: '--font-main', display: 'swap' });

export const metadata: Metadata = {
  title: 'pastila — дофаминовый декор на 3D печати',
  description: 'Яркие детали для уютного дома, которые хочется рассматривать: вазы, лампы, свечи и накладки на выключатели.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jost.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
