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
import { addDays, eachDayOfInterval, format, differenceInDays } from 'date-fns';
import { cities } from '@/lib/data';
import type { ItineraryPlan, ItineraryDay, ItineraryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function PlannerPage() {
  const { toast } = useToast();
  const [plan, setPlan] = useState<ItineraryPlan | null>(null);
  const [city, setCity] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const savedPlan = localStorage.getItem('itineraryPlan');
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan) as ItineraryPlan;
      parsedPlan.days.forEach(day => day.date = new Date(day.date));
      setPlan(parsedPlan);
      setCity(parsedPlan.city);
      setDateRange({ from: new Date(parsedPlan.from), to: new Date(parsedPlan.to) });
    }
  }, []);

  const handleCreatePlan = () => {
    if (!city || !dateRange?.from || !dateRange?.to) {
      toast({ title: "Please select a city and date range.", variant: "destructive" });
      return;
    }

    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).map((date, index) => ({
      day: index + 1,
      date: date,
      items: [],
    }));

    const newPlan: ItineraryPlan = {
      id: uuidv4(),
      city,
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
      days,
    };
    setPlan(newPlan);
    localStorage.setItem('itineraryPlan', JSON.stringify(newPlan));
    toast({ title: "Itinerary created!", description: "You can now add activities to each day." });
  };
  
  const handleAddItem = (dayIndex: number) => {
    if (!plan) return;

    const newItem: ItineraryItem = { id: uuidv4(), time: '09:00', title: '', note: '' };
    const updatedDays = [...plan.days];
    updatedDays[dayIndex].items.push(newItem);
    
    const updatedPlan = { ...plan, days: updatedDays };
    setPlan(updatedPlan);
    localStorage.setItem('itineraryPlan', JSON.stringify(updatedPlan));
  };
  
  const handleItemChange = (dayIndex: number, itemIndex: number, field: keyof ItineraryItem, value: string) => {
    if (!plan) return;
    
    const updatedDays = [...plan.days];
    (updatedDays[dayIndex].items[itemIndex] as any)[field] = value;
    
    const updatedPlan = { ...plan, days: updatedDays };
    setPlan(updatedPlan);
    localStorage.setItem('itineraryPlan', JSON.stringify(updatedPlan));
  };

  const handleRemoveItem = (dayIndex: number, itemIndex: number) => {
    if (!plan) return;

    const updatedDays = [...plan.days];
    updatedDays[dayIndex].items.splice(itemIndex, 1);
    
    const updatedPlan = { ...plan, days: updatedDays };
    setPlan(updatedPlan);
    localStorage.setItem('itineraryPlan', JSON.stringify(updatedPlan));
  };


  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Itinerary Planner"
        subtitle="Build your perfect trip, day by day."
      />
      <Card className="mb-8 rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={setCity}>
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
            <Button onClick={handleCreatePlan} className="h-11 self-end">
              {plan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {plan && (
        <div className="space-y-6">
          {plan.days.map((day, dayIndex) => (
            <Card key={day.day} className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Day {day.day}: {format(day.date, 'EEEE, dd MMMM')}</span>
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
                           <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(dayIndex, itemIndex)} className="md:col-span-1 self-center justify-self-end">
                             <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                       </div>
                    </div>
                  ))}
                  {day.items.length === 0 && <p className="text-muted-foreground text-center py-4">No activities planned for this day.</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
