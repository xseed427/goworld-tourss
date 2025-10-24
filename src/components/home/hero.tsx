'use client';

import * as React from 'react';
import Image from 'next/image';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn, formatDateForDisplay } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities } from '@/lib/data';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 font-headline text-4xl font-bold md:text-6xl">
          GoWorld Tours
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-white/90">
          Craft your own journey. Explore dream destinations with our curated tours and expert planning tools.
        </p>

        <div className="w-full max-w-3xl rounded-xl bg-white/90 p-4 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Select>
                <SelectTrigger className="h-12 text-base text-black">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <SelectValue placeholder="Where to?" />
                  </div>
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

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-12 w-full justify-start text-left font-normal text-black',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {formatDateForDisplay(date.from)} - {formatDateForDisplay(date.to)}
                      </>
                    ) : (
                      formatDateForDisplay(date.from)
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button className="h-12 text-base font-bold" size="lg">
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
