import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Calendar, IndianRupee, PlusCircle } from 'lucide-react';
import type { Tour } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type TourCardProps = {
  tour: Tour;
};

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/tours/${tour.id}`}>
            <Image
              src={tour.image.imageUrl}
              alt={tour.title}
              width={600}
              height={400}
              className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
              data-ai-hint={tour.image.imageHint}
            />
          </Link>
          <Badge className="absolute right-2 top-2 bg-primary/80 backdrop-blur-sm">
            <Star className="mr-1 h-3 w-3" />
            {tour.rating}
          </Badge>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{tour.city}</span>
          </div>
          <h3 className="mb-2 h-12 font-headline text-lg font-bold leading-tight">
            <Link href={`/tours/${tour.id}`} className="hover:text-primary">
              {tour.title}
            </Link>
          </h3>
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{tour.days} Days</span>
            </div>
            <div className="flex items-center font-semibold text-foreground">
              <IndianRupee className="mr-1 h-4 w-4" />
              <span>{tour.price.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1" variant="outline">
                <Link href={`/tours/${tour.id}`}>View Details</Link>
            </Button>
            <Button className="flex-1">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add to Itinerary
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
