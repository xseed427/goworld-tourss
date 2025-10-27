import { tours } from '@/lib/data';
import TourCard from '../shared/tour-card';
import { PageHeader } from '../shared/page-header';

export default function TrendingTours() {
  const trendingTours = tours.slice(0, 4); // Display first 4 as trending

  return (
    <section className="container mx-auto pb-16">
      <PageHeader
        title="Trending Tours"
        subtitle="Explore our most popular destinations and packages."
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {trendingTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}
