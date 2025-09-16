
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface PlaceProps {
  id: string;
  name: string;
  description: string;
  type: string; // "regular", "event", "rent", "sell"
  hobbyType?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdBy: {
    id: string;
    username: string;
    profileImage?: string;
  };
  images?: string[];
  price?: string;
  activeEvent?: {
    id: string;
    title: string;
    date: string;
    time?: string;
  };
}

interface PlaceCardProps {
  place: PlaceProps;
  isCompact?: boolean;
  onViewClick?: (id: string) => void;
  onBookClick?: (id: string) => void;
  onCreateEventClick?: (id: string) => void;
  onContactSellerClick?: (id: string) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isCompact = false,
  onViewClick,
  onBookClick,
  onCreateEventClick,
  onContactSellerClick
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-purple-500 text-white';
      case 'rent': return 'bg-blue-500 text-white';
      case 'sell': return 'bg-red-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Event Venue';
      case 'rent': return 'For Rent';
      case 'sell': return 'For Sale';
      default: return 'Regular Place';
    }
  };
  
  const getHobbyClass = (hobbyType: string) => {
    const hobbyColors: Record<string, string> = {
      'sports': 'bg-hobby-sports/20 text-hobby-sports',
      'arts': 'bg-hobby-arts/20 text-hobby-arts',
      'music': 'bg-hobby-music/20 text-hobby-music',
      'cooking': 'bg-hobby-cooking/20 text-hobby-cooking',
      'gaming': 'bg-hobby-gaming/20 text-hobby-gaming',
      'tech': 'bg-hobby-tech/20 text-hobby-tech',
      'outdoor': 'bg-hobby-outdoor/20 text-hobby-outdoor',
      'social': 'bg-hobby-social/20 text-hobby-social',
    };
    
    return hobbyColors[hobbyType?.toLowerCase()] || 'bg-primary-100 text-primary-800';
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className={isCompact ? "flex" : "block"}>
        {/* Image Section */}
        <div 
          className={`${isCompact ? 'w-1/3 h-auto' : 'h-48 w-full'} bg-gray-200 relative`}
        >
          {place.images && place.images[0] ? (
            <img 
              src={place.images[0]} 
              alt={place.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(place.type)}`}>
            {getTypeLabel(place.type)}
          </span>
        </div>
        
        {/* Content Section */}
        <CardContent className={`p-4 ${isCompact ? 'w-2/3' : 'w-full'}`}>
          <div className="flex justify-between items-start">
            <Link to={`/place/${place.id}`}>
              <h3 className="font-bold text-lg hover:text-primary-600 transition-colors">{place.name}</h3>
            </Link>
            
            {place.hobbyType && !isCompact && (
              <Badge className={getHobbyClass(place.hobbyType)}>
                {place.hobbyType}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="line-clamp-1">{place.location.address || 'Location on map'}</span>
          </div>
          
          {!isCompact && (
            <>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{place.description}</p>
              
              {place.price && (
                <p className="text-sm font-semibold text-primary-600 mb-3">{place.price}</p>
              )}
              
              {place.activeEvent && (
                <div className="mb-3 p-2 bg-purple-100 rounded-md">
                  <div className="flex items-center text-xs font-semibold text-purple-700">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Active Event</span>
                  </div>
                  <p className="text-sm mt-1">{place.activeEvent.title}</p>
                  <p className="text-xs text-gray-600">{place.activeEvent.date} {place.activeEvent.time && `at ${place.activeEvent.time}`}</p>
                </div>
              )}
            </>
          )}
          
          <div className={`${isCompact ? 'mt-2' : 'mt-4'} flex ${isCompact ? 'justify-end' : 'justify-between'} items-center`}>
            {!isCompact && (
              <Link to={`/place/${place.id}`} className="text-sm text-primary-600 hover:underline">
                View Details
              </Link>
            )}
            
            <div className="flex space-x-2">
              {onViewClick && (
                <Button size="sm" variant="outline" onClick={() => onViewClick(place.id)}>
                  View Map
                </Button>
              )}
              
              {place.type === 'event' && onCreateEventClick && (
                <Button size="sm" onClick={() => onCreateEventClick(place.id)}>
                  Create Event
                </Button>
              )}
              
              {place.type === 'rent' && onBookClick && (
                <Button size="sm" onClick={() => onBookClick(place.id)}>
                  Book Now
                </Button>
              )}
              
              {place.type === 'sell' && onContactSellerClick && (
                <Button size="sm" onClick={() => onContactSellerClick(place.id)}>
                  Contact Seller
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PlaceCard;
