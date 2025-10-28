import { tours } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, IndianRupee, MapPin, Star, PlusCircle, User, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = tours.find((t) => t.id === params.id);

  if (!tour) {
    notFound();
  }
  
  const highlights = [
    { icon: User, text: 'Private or small group' },
    { icon: Zap, text: 'Instant confirmation' },
    { icon: Calendar, text: 'Flexible cancellation' },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{tour.title}</h1>
        <div className="mt-2 flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" /> {tour.rating}
          </div>
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" /> {tour.city}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            {tour.image && (
                 <Image
                    src={tour.image.imageUrl}
                    alt={tour.title}
                    width={1200}
                    height={800}
                    className="mb-8 w-full rounded-xl object-cover"
                    data-ai-hint={tour.image.imageHint}
                />
            )}
           
           <h2 className="mb-4 font-headline text-2xl font-bold">About this tour</h2>
            <p className="text-muted-foreground">
                Embark on an unforgettable journey through the heart of {tour.city}. Our "{tour.title}" package is a {tour.days}-day immersion into the rich culture, history, and beauty of the region. From ancient monuments to bustling markets, this tour is crafted to provide a comprehensive and memorable experience. Perfect for history buffs, cultural enthusiasts, and anyone looking to explore the wonders of India.
            </p>
            
            <Separator className="my-8"/>

            <h2 className="mb-4 font-headline text-2xl font-bold">What's Included</h2>
            <ul className="grid grid-cols-1 gap-4 text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" />Expert local guide</li>
              <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" />Entry fees to all monuments</li>
              <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" />Private air-conditioned vehicle</li>
              <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" />Bottled water</li>
            </ul>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24 rounded-xl shadow-lg">
            <CardContent className="p-6">
                <div className="mb-4 flex items-baseline gap-2">
                    <span className="font-headline text-3xl font-bold">
                        <IndianRupee className="inline h-6 w-6" />
                        {tour.price.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-muted-foreground">per person</span>
                </div>
                 <div className="space-y-3">
                    {highlights.map(item => (
                        <div key={item.text} className="flex items-center text-sm">
                            <item.icon className="mr-2 h-4 w-4 text-primary"/>
                            <span>{item.text}</span>
                        </div>
                    ))}
                 </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2 p-6 pt-0">
              <Button size="lg">Add to Itinerary <PlusCircle className="ml-2"/></Button>
              <Button size="lg" variant="outline">Book Now</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Dummy icon for placeholder
const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
)
