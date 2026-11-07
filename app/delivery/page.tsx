import LegalPage from '../../components/LegalPage';

export const metadata = { title: 'Доставка и оплата — pastila' };

export default function Page() {
  return (
    <LegalPage
      title="Доставка и оплата"
      intro="Как получить заказ и чем за него заплатить."
      sections={["Способы доставки","Сроки и стоимость доставки","Способы оплаты","Получение заказа"]}
    />
  );
}
