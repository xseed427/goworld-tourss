import { hotels, cities } from '@/lib/data';
import HotelCard from '@/components/shared/hotel-card';
import { PageHeader } from '@/components/shared/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function HotelsPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Find Your Perfect Stay"
        subtitle="From luxury resorts to cozy homestays."
      />

      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-sm">
          <Select defaultValue="delhi">
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city.toLowerCase()}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
