import LegalPage from '../../components/LegalPage';

export const metadata = { title: 'Возврат и обмен — pastila' };

export default function Page() {
  return (
    <LegalPage
      title="Возврат и обмен"
      intro="Что делать, если изделие не подошло или пришло с дефектом."
      sections={["Возврат изделий надлежащего качества","Возврат при браке","Изделия по индивидуальному заказу","Как оформить возврат"]}
    />
  );
}
