import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, IndianRupee } from 'lucide-react';
import type { Hotel } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type HotelCardProps = {
  hotel: Hotel;
};

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/hotels/${hotel.id}`}>
            <Image
              src={hotel.image.imageUrl}
              alt={hotel.name}
              width={600}
              height={400}
              className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
              data-ai-hint={hotel.image.imageHint}
            />
          </Link>
          <Badge className="absolute right-2 top-2 flex items-center bg-primary/80 backdrop-blur-sm">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-white text-white" />
            ))}
          </Badge>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{hotel.city}</span>
          </div>
          <h3 className="mb-2 h-12 font-headline text-lg font-bold leading-tight">
            <Link href={`/hotels/${hotel.id}`} className="hover:text-primary">
              {hotel.name}
            </Link>
          </h3>
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xs">starts from</span>
                 <div className="flex items-center font-semibold text-foreground">
                    <IndianRupee className="mr-1 h-4 w-4" />
                    <span>{hotel.priceMin.toLocaleString('en-IN')}</span>
                 </div>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href={`/hotels/${hotel.id}`}>Check Availability</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
