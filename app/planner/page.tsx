'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { cn, formatDateForDisplay } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { eachDayOfInterval, format, toDate } from 'date-fns';
import { cities } from '@/lib/data';
import type { ItineraryPlan, ItineraryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useMemoFirebase, useCollection, setDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, doc, query, orderBy } from 'firebase/firestore';

export default function PlannerPage() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [activePlan, setActivePlan] = useState<ItineraryPlan | null>(null);
  const [city, setCity] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Fetch user's plans from Firestore
  const plansQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'plans'), orderBy('from', 'desc'));
  }, [firestore, user?.uid]);

  const { data: userPlans, isLoading: arePlansLoading } = useCollection<ItineraryPlan>(plansQuery);

  // Effect to set the active plan
  useEffect(() => {
    if (userPlans && userPlans.length > 0) {
      if (!activePlan || !userPlans.find(p => p.id === activePlan.id)) {
        const latestPlan = userPlans[0];
        setActivePlan({
          ...latestPlan,
          from: latestPlan.from,
          to: latestPlan.to,
        });
      }
    } else {
      setActivePlan(null);
    }
  }, [userPlans, activePlan]);

  // Effect to update form fields when active plan changes
  useEffect(() => {
    if (activePlan) {
      setCity(activePlan.city);
      setDateRange({ from: toDate(activePlan.from), to: toDate(activePlan.to) });
    } else {
      setCity('');
      setDateRange(undefined);
    }
  }, [activePlan]);

  const handleCreateOrUpdatePlan = () => {
    if (!user) {
      toast({ title: 'Please log in to create a plan.', variant: 'destructive' });
      router.push('/login');
      return;
    }
    if (!city || !dateRange?.from || !dateRange?.to) {
      toast({ title: 'Please select a city and date range.', variant: 'destructive' });
      return;
    }
    if (!firestore) return;

    const planId = activePlan?.id || uuidv4();
    const fromISO = dateRange.from.toISOString();
    const toISO = dateRange.to.toISOString();

    const existingDays = activePlan?.id === planId ? activePlan.days : [];

    const newDaysInterval = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

    const newDays = newDaysInterval.map((date, index) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const existingDay = existingDays.find(d => format(toDate(d.date), 'yyyy-MM-dd') === dateString);
      return existingDay ? { ...existingDay, day: index + 1, date: date.toISOString() } : {
        day: index + 1,
        date: date.toISOString(),
        items: [],
      };
    });

    const planToSave: ItineraryPlan = {
      id: planId,
      userId: user.uid,
      city,
      from: fromISO,
      to: toISO,
      days: newDays,
    };
    
    const planRef = doc(firestore, 'users', user.uid, 'plans', planId);
    setDocumentNonBlocking(planRef, planToSave, { merge: true });

    setActivePlan(planToSave);

    toast({
      title: activePlan ? 'Plan Updated!' : 'Itinerary Created!',
      description: 'Your plan has been saved to your account.',
    });
  };

  const updatePlanInFirestore = (updatedPlan: ItineraryPlan) => {
    if (!user || !firestore) return;
    const planRef = doc(firestore, 'users', user.uid, 'plans', updatedPlan.id);
    setDocumentNonBlocking(planRef, updatedPlan, { merge: true });
  }

  const handleAddItem = (dayIndex: number) => {
    if (!activePlan) return;

    const newItem: ItineraryItem = { id: uuidv4(), time: '09:00', title: '', note: '' };
    const updatedDays = [...activePlan.days];
    updatedDays[dayIndex].items.push(newItem);

    const updatedPlan = { ...activePlan, days: updatedDays };
    setActivePlan(updatedPlan);
    updatePlanInFirestore(updatedPlan);
  };

  const handleItemChange = (dayIndex: number, itemIndex: number, field: keyof ItineraryItem, value: string) => {
    if (!activePlan) return;

    const updatedDays = [...activePlan.days];
    (updatedDays[dayIndex].items[itemIndex] as any)[field] = value;

    const updatedPlan = { ...activePlan, days: updatedDays };
    setActivePlan(updatedPlan);
    updatePlanInFirestore(updatedPlan);
  };

  const handleRemoveItem = (dayIndex: number, itemIndex: number) => {
    if (!activePlan) return;

    const updatedDays = [...activePlan.days];
    updatedDays[dayIndex].items.splice(itemIndex, 1);

    const updatedPlan = { ...activePlan, days: updatedDays };
    setActivePlan(updatedPlan);
    updatePlanInFirestore(updatedPlan);
  };

  if (isUserLoading || arePlansLoading) {
    return <div className="container mx-auto py-8 text-center">Loading your plans...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Itinerary Planner" subtitle="Build your perfect trip, day by day." />
      <Card className="mb-8 rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={setCity} disabled={!user}>
                <SelectTrigger id="city" className="h-11">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!user}
                    className={cn(
                      'h-11 w-full justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {formatDateForDisplay(dateRange.from)} - {formatDateForDisplay(dateRange.to)}
                        </>
                      ) : (
                        formatDateForDisplay(dateRange.from)
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleCreateOrUpdatePlan} className="h-11 self-end" disabled={!user}>
              {activePlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
          {!user && <p className="mt-4 text-center text-sm text-muted-foreground">Please <a href="/login" className="underline">log in</a> to start planning.</p>}
        </CardContent>
      </Card>

      {user && activePlan && (
        <div className="space-y-6">
          {activePlan.days.map((day, dayIndex) => (
            <Card key={day.day} className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Day {day.day}: {format(toDate(day.date), 'EEEE, dd MMMM')}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleAddItem(dayIndex)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {day.items.map((item, itemIndex) => (
                    <div key={item.id} className="flex gap-4 items-start p-3 bg-secondary/30 rounded-lg">
                      <GripVertical className="h-5 w-5 mt-2.5 text-muted-foreground cursor-grab" />
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 flex-1">
                        <Input
                          type="time"
                          value={item.time}
                          onChange={(e) => handleItemChange(dayIndex, itemIndex, 'time', e.target.value)}
                          className="md:col-span-2"
                        />
                        <Input
                          placeholder="Activity Title (e.g., Visit India Gate)"
                          value={item.title}
                          onChange={(e) => handleItemChange(dayIndex, itemIndex, 'title', e.target.value)}
                          className="md:col-span-5"
                        />
                        <Input
                          placeholder="Notes (e.g., tickets, address)"
                          value={item.note}
                          onChange={(e) => handleItemChange(dayIndex, itemIndex, 'note', e.target.value)}
                          className="md:col-span-4"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(dayIndex, itemIndex)}
                          className="md:col-span-1 self-center justify-self-end"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {day.items.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No activities planned for this day.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
       {user && !arePlansLoading && !activePlan && (
        <div className="text-center text-muted-foreground">
          <p>You have no saved plans. Create one above to get started!</p>
        </div>
      )}
    </div>
  );
}
