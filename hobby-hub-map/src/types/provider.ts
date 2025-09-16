import { PlaceProps } from './place';

export type ProviderType = 'broker' | 'deliverer';

export type SpecializationType = 
  | 'flat' 
  | 'villa' 
  | 'commercial' 
  | 'land'         // For brokers
  | 'food' 
  | 'groceries' 
  | 'retail' 
  | 'documents'    // For deliverers
  | 'other';

export interface ProviderLocation {
  lat: number;
  lng: number;
  address: string;
  coverageRadius?: number; // in kilometers
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  createdBy: {
    id: string;
    username: string;
    profileImage?: string;
  };
}

export interface Transaction {
  id: string;
  type: 'sale' | 'rental' | 'delivery';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  date: string;
  amount: number;
  commission: number;
  client: {
    id: string;
    username: string;
    profileImage?: string;
  };
  placeId?: string;
  placeName?: string;
  details?: string;
  reviewId?: string;
}

export interface ProviderProps {
  id: string;
  type: ProviderType;
  name: string;
  bio: string;
  profileImage?: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  location: ProviderLocation;
  specializations: SpecializationType[];
  rating: number;
  reviews: Review[];
  transactions: Transaction[];
  availabilityHours?: {
    days: string[];
    startTime: string;
    endTime: string;
  }[];
  verified: boolean;
  joinDate: string;
  badges?: string[];
  places?: string[]; // IDs of places this provider is associated with
}

export interface BrokerProps extends ProviderProps {
  type: 'broker';
  licensedSince: string;
  licenseNumber: string;
  agency?: string;
  dealsClosed: number;
  totalSalesVolume?: number;
  commissionRate: number; // percentage
}

export interface DelivererProps extends ProviderProps {
  type: 'deliverer';
  vehicle: 'bicycle' | 'motorcycle' | 'car' | 'van' | 'on-foot';
  deliveriesCompleted: number;
  avgDeliveryTime?: number; // in minutes
  maxWeight?: number; // in kg
  deliveryFee: {
    base: number;
    perKm: number;
    minimum: number;
  };
}