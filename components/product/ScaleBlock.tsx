/**
 * «Масштаб»: силуэт изделия рядом с известным предметом.
 * Показывается только при реальной высоте (heightCm). Размеры эталонов приблизительные.
 */
const refs = [
  { key: 'mug', label: 'Чашка', cm: 9.5 },
  { key: 'book', label: 'Книга', cm: 22 },
  { key: 'hand', label: 'Ладонь', cm: 18 },
] as const;

export default function ScaleBlock({ heightCm, widthCm, title }: { heightCm: number; widthCm?: number | null; title: string }) {
  const refCm = refs.find((r) => r.key === 'book')!.cm;
  const maxCm = Math.max(heightCm, refCm, refs[0].cm);
  const H = 160; // высота области, px
  const px = (cm: number) => Math.max(8, (cm / maxCm) * H);
  const objW = px(widthCm && widthCm > 0 ? widthCm : heightCm * 0.5);

  return (
    <section className="pd-block" aria-labelledby="pd-scale-h">
      <h2 id="pd-scale-h" className="pd-h2">Масштаб</h2>
      <figure className="pd-scale" aria-label={`${title}: высота ${heightCm} см рядом с чашкой и книгой`}>
        <div className="pd-scale-stage" style={{ height: H + 24 }}>
          <div className="pd-sil pd-sil-obj" style={{ height: px(heightCm), width: objW }}>
            <span>{heightCm} см</span>
          </div>
          <div className="pd-sil pd-sil-ref" style={{ height: px(9.5), width: px(8) }}>
            <span>Чашка</span>
          </div>
          <div className="pd-sil pd-sil-ref" style={{ height: px(22), width: px(15) }}>
            <span>Книга</span>
          </div>
        </div>
        <figcaption>Силуэты в одном масштабе. Размеры чашки и книги приблизительные.</figcaption>
      </figure>
    </section>
  );
}
