import Hero from '@/components/home/hero';
import TrendingTours from '@/components/home/trending-tours';

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <Hero />
      <TrendingTours />
    </div>
  );
}
