import Image from 'next/image';
import Link from 'next/link';
import { Users, IndianRupee, CheckCircle } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';

type VehicleCardProps = {
  vehicle: Vehicle;
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative">
<<<<<<< HEAD
          <Link href="#">
=======
          <Link href={`/vehicles/${vehicle.id}`}>
>>>>>>> 1f03250 (second commit)
            <Image
              src={vehicle.image.imageUrl}
              alt={vehicle.name}
              width={600}
              height={400}
              className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
              data-ai-hint={vehicle.image.imageHint}
            />
          </Link>
        </div>
        <div className="p-4">
          <h3 className="mb-2 h-12 font-headline text-lg font-bold leading-tight">
<<<<<<< HEAD
            <Link href="#" className="hover:text-primary">
=======
            <Link href={`/vehicles/${vehicle.id}`} className="hover:text-primary">
>>>>>>> 1f03250 (second commit)
              {vehicle.name}
            </Link>
          </h3>
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{vehicle.seats} Seater</span>
            </div>
            <div className="flex items-center font-semibold text-foreground">
              <IndianRupee className="mr-1 h-4 w-4" />
              <span>{vehicle.pricePerDay.toLocaleString('en-IN')} / day</span>
            </div>
          </div>
          <div className="mb-4 space-y-1 text-sm">
            {vehicle.inclusions.map((inclusion) => (
                <div key={inclusion} className="flex items-center text-muted-foreground">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>{inclusion}</span>
                </div>
            ))}
          </div>
          <Button asChild className="w-full">
<<<<<<< HEAD
            <Link href="#">Get Quote</Link>
=======
            <Link href={`/vehicles/${vehicle.id}`}>Get Quote</Link>
>>>>>>> 1f03250 (second commit)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
