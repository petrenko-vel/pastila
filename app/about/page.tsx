import BrandStory from '../../components/home/BrandStory';
import Packaging from '../../components/home/Packaging';

export const metadata = {
  title: 'О Pastila — pastila',
  description: 'Небольшая студия дизайнерского декора: собственные модели, печать на 3D-принтерах, внимание к деталям.',
};

export default function Page() {
  return (
    <div style={{ paddingTop: 32, paddingBottom: 64 }}>
      <BrandStory titleTag="h1" hideCta />
      <Packaging />
    </div>
  );
}
