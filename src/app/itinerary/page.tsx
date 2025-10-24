'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import type { ItineraryPlan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { FileDown, Mail, PlusCircle, ShoppingCart } from 'lucide-react';

export default function ItineraryPage() {
  const [plan, setPlan] = useState<ItineraryPlan | null>(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem('itineraryPlan');
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan) as ItineraryPlan;
      parsedPlan.days.forEach(day => day.date = new Date(day.date));
      setPlan(parsedPlan);
    }
  }, []);

  if (!plan) {
    return (
      <div className="container mx-auto py-8 text-center">
        <PageHeader title="My Itinerary" />
        <p className="mb-4 text-muted-foreground">You don't have a saved itinerary yet.</p>
        <Button asChild>
          <Link href="/planner">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create a New Plan
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title={`Your Trip to ${plan.city}`}
        subtitle={`${format(new Date(plan.from), 'dd MMM')} - ${format(new Date(plan.to), 'dd MMM yyyy')}`}
      />
      <div className="mb-8 flex justify-center gap-2">
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Email Itinerary
        </Button>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Convert to Cart
        </Button>
      </div>
      <div className="space-y-6">
        {plan.days.map((day) => (
          <Card key={day.day} className="rounded-xl">
            <CardHeader>
              <CardTitle>Day {day.day}: {format(day.date, 'EEEE, dd MMMM')}</CardTitle>
            </CardHeader>
            <CardContent>
              {day.items.length > 0 ? (
                <ul className="space-y-4">
                  {day.items.map((item) => (
                    <li key={item.id} className="flex items-start rounded-lg border p-4">
                      <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <span className="font-bold">{item.time}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No activities for this day.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
