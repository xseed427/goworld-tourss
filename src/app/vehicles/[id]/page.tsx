import { vehicles } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, IndianRupee, CheckCircle, Gauge, Calendar, GitMerge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = vehicles.find((v) => v.id === params.id);

  if (!vehicle) {
    notFound();
  }

  const specs = [
    { icon: Users, label: 'Seats', value: `${vehicle.seats} Adults` },
    { icon: Gauge, label: 'Engine', value: '1500cc' },
    { icon: GitMerge, label: 'Transmission', value: 'Automatic' },
    { icon: Calendar, label: 'Year', value: '2023' },
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
            {vehicle.image && (
                <Image
                    src={vehicle.image.imageUrl}
                    alt={vehicle.name}
                    width={1200}
                    height={800}
                    className="mb-4 w-full rounded-xl object-cover"
                    data-ai-hint={vehicle.image.imageHint}
                />
            )}
        </div>
        <div>
          <Badge variant="secondary">{vehicle.category}</Badge>
          <h1 className="my-2 font-headline text-4xl font-bold">{vehicle.name}</h1>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold">
              <IndianRupee className="inline h-6 w-6" />
              {vehicle.pricePerDay.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-muted-foreground">/ per day</span>
          </div>

          <Card className="rounded-xl bg-secondary/30">
            <CardHeader>
                <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {specs.map(spec => (
                    <div key={spec.label} className="flex items-center">
                        <spec.icon className="mr-2 h-5 w-5 text-primary"/>
                        <div>
                            <p className="text-xs text-muted-foreground">{spec.label}</p>
                            <p className="font-semibold">{spec.value}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>
          
          <Separator className="my-6"/>

           <h3 className="mb-4 font-headline text-xl font-bold">Inclusions</h3>
            <ul className="space-y-2">
                {vehicle.inclusions.map(item => (
                     <li key={item} className="flex items-center text-muted-foreground"><CheckCircle className="mr-2 h-5 w-5 text-green-500" />{item}</li>
                ))}
            </ul>
        </div>
      </div>
      
       <Card className="mt-12 rounded-xl">
        <CardHeader>
            <CardTitle>Get a Quote</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
             <div>
                <Label htmlFor="pickup">Pick-up Date</Label>
                <Input type="date" id="pickup" />
            </div>
            <div>
                <Label htmlFor="dropoff">Drop-off Date</Label>
                <Input type="date" id="dropoff" />
            </div>
            <Button className="self-end" size="lg">Calculate Price</Button>
        </CardContent>
      </Card>

    </div>
  );
}
