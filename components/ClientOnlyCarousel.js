import dynamic from 'next/dynamic';

const Carousel = dynamic(
  () => import('./ResponsiveCarousel'), // A wrapper you’ll create next
  { ssr: false }
);

export default Carousel;
