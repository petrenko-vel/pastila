import { Suspense } from 'react';
import CatalogView from './CatalogView';

export const metadata = { title: 'Каталог — pastila' };

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="page container" />}>
      <CatalogView />
    </Suspense>
  );
}
