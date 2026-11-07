import LegalPage from '../../components/LegalPage';

export const metadata = { title: 'Политика конфиденциальности — pastila' };

export default function Page() {
  return (
    <LegalPage
      title="Политика конфиденциальности"
      intro="Как pastila работает с персональными данными посетителей и покупателей."
      sections={["Общие положения","Какие данные собираем","Для чего используем данные","Как храним и защищаем","Передача данных третьим лицам","Права пользователя","Контакты оператора"]}
    />
  );
}
