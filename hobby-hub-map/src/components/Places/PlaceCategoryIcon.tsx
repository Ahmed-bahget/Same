
import React from 'react';
import { Home, Utensils, Building, MapPin, Store } from 'lucide-react';
import { PlaceCategoryType } from '@/types/place';

interface PlaceCategoryIconProps {
  category: PlaceCategoryType;
  className?: string;
}

const PlaceCategoryIcon: React.FC<PlaceCategoryIconProps> = ({ category, className = "" }) => {
  const icons: Record<PlaceCategoryType, React.ComponentType<any>> = {
    flat: Home,
    restaurant: Utensils,
    shop: Store,
    venue: Building
  };

  const IconComponent = icons[category] || MapPin;
  return <IconComponent className={className} />;
};

export default PlaceCategoryIcon;
