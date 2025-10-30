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
  image?: ImagePlaceholder; // Make image optional for vendor created tours
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
  date: string; // ISO date string
  items: ItineraryItem[];
};

export type ItineraryPlan = {
  id: string;
  city: string;
  from: string; // ISO date string
  to: string; // ISO date string
  days: ItineraryDay[];
  userId?: string;
};

export type Vendor = {
  id: string;
  name: string;
  type: string;
  kyc: string;
  status: 'pending' | 'approved' | 'rejected';
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
};

export type UserProfile = {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    role: 'user' | 'vendor' | 'admin';
    status: 'active' | 'inactive';
};
