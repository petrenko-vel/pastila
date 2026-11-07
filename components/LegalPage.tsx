import Link from 'next/link';

type Props = {
  title: string;
  intro: string;
  sections: string[];
};

/** Заготовка страницы документа: структура есть, юридический текст владелец магазина добавляет сам. */
export default function LegalPage({ title, intro, sections }: Props) {
  return (
    <div className="page container legal">
      <div className="page-head">
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>

      <div className="legal-note" role="note">
        <b>Текст документа ещё не заполнен.</b> Здесь появится полная редакция. Реквизиты продавца (ИП или ООО, ИНН, адрес,
        контакты) и юридические формулировки должен подготовить владелец магазина или юрист.
      </div>

      <ol className="legal-list">
        {sections.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      <Link href="/" className="legal-back">
        ← На главную
      </Link>
    </div>
  );
}
