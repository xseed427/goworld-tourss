'use client';

import { useState } from 'react';
import { tours, cities } from '@/lib/data';
import TourCard from '@/components/shared/tour-card';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export default function ToursPage() {
  const [priceRange, setPriceRange] = useState([50000]);

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Explore Our Tours"
        subtitle="Find your next adventure from our curated list of tours."
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <Card className="sticky top-20 rounded-xl">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block font-semibold">City</Label>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="city-all" />
                    <Label htmlFor="city-all">All</Label>
                  </div>
                  {cities.map((city) => (
                    <div key={city} className="flex items-center space-x-2">
                      <RadioGroupItem value={city.toLowerCase()} id={`city-${city.toLowerCase()}`} />
                      <Label htmlFor={`city-${city.toLowerCase()}`}>{city}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-2 block font-semibold">Max Price</Label>
                <Slider
                  defaultValue={[50000]}
                  max={100000}
                  step={1000}
                  onValueChange={setPriceRange}
                />
                 <p className="mt-2 text-sm text-muted-foreground">
                  Up to ₹{priceRange[0].toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <Label className="mb-2 block font-semibold">Rating</Label>
                <div className="space-y-2">
                    {[5, 4, 3].map(star => (
                         <div key={star} className="flex items-center space-x-2">
                            <Checkbox id={`star-${star}`} />
                            <Label htmlFor={`star-${star}`}>{star} Stars & up</Label>
                        </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="grid grid-cols-1 gap-8 md:col-span-3 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </main>
      </div>
    </div>
  );
}
