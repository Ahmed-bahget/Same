import { HobbyType } from '@/components/Events/HobbyIcon';

export type PlaceTypeFilter = 'rent' | 'sell' | 'event' | 'regular';
export type PlaceCategoryType = 'flat' | 'villa' | 'restaurant' | 'shop' | 'venue' | 'broker' | 'deliverer';

export interface PlaceLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface CreatedBy {
  id: string;
  username: string;
  profileImage?: string;
}

export interface ActiveEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  placeId: string;
}

export interface PlaceProps {
  id: string;
  name: string;
  description: string;
  type: PlaceTypeFilter;
  category: PlaceCategoryType;
  location: PlaceLocation;
  createdBy: CreatedBy;
  images?: string[];
  hobbyType?: HobbyType;
  price?: string;
  products?: Product[];
  activeEvent?: ActiveEvent;
  places?: string[];  // For providers to link to places
}




// export type PlaceCategoryType = 'flat' | 'restaurant' | 'shop' | 'venue';
// export type PlaceTypeFilter = 'rent' | 'sell' | 'event' | 'regular';

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image?: string;
//   available: boolean;
//   placeId: string;
// }

// export interface CartItem extends Product {
//   quantity: number;
// }

// export interface Message {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
//   timestamp: Date;
//   isRead: boolean;
//   order?: CartItem[];
// }

// export interface Chat {
//   id: string;
//   participants: string[];
//   lastMessage?: Message;
//   unreadCount: number;
// }

// export interface PlaceProps {
//   id: string;
//   name: string;
//   description: string;
//   type: PlaceTypeFilter;
//   category: PlaceCategoryType;
//   hobbyType?: string;
//   location: {
//     lat: number;
//     lng: number;
//     address?: string;
//   };
//   createdBy: {
//     id: string;
//     username: string;
//     profileImage?: string;
//     hobbies?: string[];
//   };
//   images?: string[];
//   price?: string;
//   products?: Product[];
//   activeEvent?: {
//     id: string;
//     title: string;
//     date: string;
//     time?: string;
//   };
// }
