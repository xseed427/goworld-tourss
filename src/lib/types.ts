import type { ImagePlaceholder } from './placeholder-images';

export type Tour = {
  id: string;
  title: string;
  city: string;
  days: number;
  price: {
    currency: string;
    amount: number;
  };
  rating: number;
  vendorId: string;
  image: ImagePlaceholder;
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  stars: number;
  amenities: string[];
  priceMin: number;
  vendorId: string;
  image: ImagePlaceholder;
};

export type Vehicle = {
  id: string;
  name: string;
  category: 'Bike' | 'Car' | 'Tempo Traveller';
  seats: number;
  pricePerDay: number;
  inclusions: string[];
  vendorId: string;
  image: ImagePlaceholder;
};

export type ItineraryItem = {
  id: string;
  time: string;
  title: string;
  note: string;
};

export type ItineraryDay = {
  day: number;
  date: Date;
  items: ItineraryItem[];
};

export type ItineraryPlan = {
  id: string;
  city: string;
  from: string; // ISO date string
  to: string; // ISO date string
  days: ItineraryDay[];
};
