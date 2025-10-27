'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import type { ItineraryPlan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, toDate } from 'date-fns';
import { FileDown, Mail, PlusCircle, ShoppingCart } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function ItineraryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [activePlan, setActivePlan] = useState<ItineraryPlan | null>(null);

  // Fetch the most recent plan for the current user
  const latestPlanQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'plans'),
      orderBy('from', 'desc'),
      limit(1)
    );
  }, [firestore, user?.uid]);

  const { data: plans, isLoading: isPlanLoading } = useCollection<ItineraryPlan>(latestPlanQuery);

  useEffect(() => {
    if (plans && plans.length > 0) {
      setActivePlan(plans[0]);
    } else {
      setActivePlan(null);
    }
  }, [plans]);

  if (isUserLoading || isPlanLoading) {
    return (
        <div className="container mx-auto py-8 text-center">
            <PageHeader title="My Itinerary" />
            <p>Loading your itinerary...</p>
        </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <PageHeader title="My Itinerary" />
        <p className="mb-4 text-muted-foreground">Please log in to view your saved itinerary.</p>
        <Button asChild>
          <Link href="/login">
            Login
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!activePlan) {
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
        title={`Your Trip to ${activePlan.city}`}
        subtitle={`${format(toDate(activePlan.from), 'dd MMM')} - ${format(toDate(activePlan.to), 'dd MMM yyyy')}`}
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
        {activePlan.days.map((day) => (
          <Card key={day.day} className="rounded-xl">
            <CardHeader>
              <CardTitle>Day {day.day}: {format(toDate(day.date), 'EEEE, dd MMMM')}</CardTitle>
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
