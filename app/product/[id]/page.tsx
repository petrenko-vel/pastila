import { notFound } from 'next/navigation';
import ProductView from '../../../components/product/ProductView';
import { products } from '../../../lib/products';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const p = products.find((x) => x.id === params.id);
  return { title: p ? `${p.title} — pastila` : 'Товар — pastila', description: p?.desc };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((x) => x.id === params.id);
  if (!product) notFound();
  return <ProductView id={product.id} />;
}
