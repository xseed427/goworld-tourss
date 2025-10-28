import { hotels } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, IndianRupee, Wifi, Utensils, ParkingSquare, Dumbbell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const hotel = hotels.find((h) => h.id === params.id);

  if (!hotel) {
    notFound();
  }

  const amenitiesIcons: { [key: string]: React.ElementType } = {
    'Wifi': Wifi,
    'Pool': Dumbbell, // Using Dumbell as a proxy for pool/fitness
    'Gym': Dumbbell,
    'Free Breakfast': Utensils,
    'Parking': ParkingSquare,
    'Beach Access': Wifi // No direct icon, using wifi as placeholder
  };

  const galleryImages = [
      hotel.image,
      PlaceHolderImages.find(p => p.id === 'hotel2')!,
      PlaceHolderImages.find(p => p.id === 'hotel3')!,
      PlaceHolderImages.find(p => p.id === 'hotel4')!,
  ]

  return (
    <div className="container mx-auto py-12">
       <div className="mb-4">
            <h1 className="font-headline text-4xl font-bold">{hotel.name}</h1>
            <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" /> {hotel.city}
                </div>
            </div>
        </div>
      
      <Carousel className="mb-8 w-full">
        <CarouselContent>
          {galleryImages.map((img, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Image
                src={img.imageUrl}
                alt={`${hotel.name} gallery image ${index + 1}`}
                width={800}
                height={600}
                className="aspect-video w-full rounded-lg object-cover"
                data-ai-hint={img.imageHint}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <h2 className="mb-4 font-headline text-2xl font-bold">About this hotel</h2>
            <p className="text-muted-foreground">
                Welcome to {hotel.name}, your perfect getaway in the heart of {hotel.city}. With a {hotel.stars}-star rating, we offer unparalleled comfort and luxury. Whether you're here for business or leisure, our world-class amenities and exceptional service will make your stay unforgettable. Enjoy stunning views, exquisite dining, and a relaxing atmosphere.
            </p>

            <h2 className="mb-4 mt-8 font-headline text-2xl font-bold">Amenities</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {hotel.amenities.map(amenity => {
                    const Icon = amenitiesIcons[amenity] || Star;
                    return (
                        <div key={amenity} className="flex items-center rounded-lg border p-3">
                           <Icon className="mr-3 h-5 w-5 text-primary"/>
                           <span>{amenity}</span>
                        </div>
                    )
                })}
            </div>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24 rounded-xl shadow-lg">
            <CardHeader>
                <CardTitle>Reserve Your Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">Starts from</span>
                <span className="font-headline text-3xl font-bold">
                  <IndianRupee className="inline h-6 w-6" />
                  {hotel.priceMin.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full">Check Availability</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
