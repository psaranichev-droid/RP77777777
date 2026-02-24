import { HeroSlider } from '../components/HeroSlider';
import { ProductGrid } from '../components/ProductGrid';
import { Features } from '../components/Features';
import { useSEOAndSchema } from '../hooks/useSEO';
import { getOrganizationSchema } from '../utils/seo';

const HomePage = () => {
  useSEOAndSchema(
    {
      title: 'Paper Shop - Качественная бумага и картон для вашего бизнеса',
      description: 'Интернет-магазин офсетной, мелованной и дизайнерской бумаги. Доставка по России. Оптовые цены. ✓ Быстро ✓ Надежно ✓ Выгодно',
      keywords: 'бумага для печати, картон, офсетная бумага, мелованная бумага, дизайнерская бумага, оптом',
      canonical: 'https://yoursite.com/',
    },
    getOrganizationSchema()
  );

  return (
    <>
      <HeroSlider />
      <ProductGrid />
      <Features />
    </>
  );
};

export default HomePage;
