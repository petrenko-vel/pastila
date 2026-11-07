import LegalPage from '../../components/LegalPage';

export const metadata = { title: 'Пользовательское соглашение — pastila' };

export default function Page() {
  return (
    <LegalPage
      title="Пользовательское соглашение"
      intro="Правила пользования сайтом pastila."
      sections={["Общие условия","Использование сайта","Персональные данные","Интеллектуальная собственность","Изменение условий"]}
    />
  );
}
