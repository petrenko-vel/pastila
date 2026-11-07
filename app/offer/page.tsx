import LegalPage from '../../components/LegalPage';

export const metadata = { title: 'Публичная оферта — pastila' };

export default function Page() {
  return (
    <LegalPage
      title="Публичная оферта"
      intro="Условия, на которых pastila продаёт изделия."
      sections={["Общие положения и термины","Предмет договора","Оформление и подтверждение заказа","Цена и порядок оплаты","Доставка","Возврат и обмен","Ответственность сторон","Реквизиты продавца"]}
    />
  );
}
