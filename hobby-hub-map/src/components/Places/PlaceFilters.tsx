
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Filter, Home, Utensils, Store, Building, MapPin } from 'lucide-react';
import { PlaceTypeFilter, PlaceCategoryType } from '@/types/place';

interface PlaceFiltersProps {
  filters: {
    types: PlaceTypeFilter[];
    categories: PlaceCategoryType[];
  };
  toggleFilter: (type: 'types' | 'categories', value: any) => void;
}

const PlaceFilters: React.FC<PlaceFiltersProps> = ({ filters, toggleFilter }) => {
  // Define filter options
  const typeFilters: { value: PlaceTypeFilter; label: string; color: string }[] = [
    { value: 'rent', label: 'For Rent', color: 'bg-blue-500 hover:bg-blue-600' },
    { value: 'sell', label: 'For Sale', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'event', label: 'Event Venue', color: 'bg-purple-500 hover:bg-purple-600' },
    { value: 'regular', label: 'Regular Place', color: 'bg-green-500 hover:bg-green-600' }
  ];

  const categoryFilters: { value: PlaceCategoryType; label: string; icon: React.ReactNode }[] = [
    { value: 'flat', label: 'Flats', icon: <Home className="h-4 w-4 mr-1" /> },
    { value: 'restaurant', label: 'Restaurants', icon: <Utensils className="h-4 w-4 mr-1" /> },
    { value: 'shop', label: 'Shops', icon: <Store className="h-4 w-4 mr-1" /> },
    { value: 'venue', label: 'Venues', icon: <Building className="h-4 w-4 mr-1" /> }
  ];

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Type:</span>
        {typeFilters.map((typeFilter) => (
          <Badge
            key={typeFilter.value}
            variant={filters.types.includes(typeFilter.value) ? "default" : "outline"}
            className={`cursor-pointer ${filters.types.includes(typeFilter.value) ? typeFilter.color : ''}`}
            onClick={() => toggleFilter('types', typeFilter.value)}
          >
            {typeFilter.label}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Category:</span>
        {categoryFilters.map((categoryFilter) => (
          <Badge
            key={categoryFilter.value}
            variant={filters.categories.includes(categoryFilter.value) ? "default" : "outline"}
            className="cursor-pointer flex items-center"
            onClick={() => toggleFilter('categories', categoryFilter.value)}
          >
            {categoryFilter.icon}
            {categoryFilter.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PlaceFilters;
