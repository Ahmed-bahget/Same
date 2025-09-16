import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ThumbsUp, Award, Check, Clock, Package, Home } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BrokerProps, DelivererProps, ProviderProps } from '@/types/provider';

interface ProviderCardProps {
  provider: ProviderProps;
  onContactClick?: (providerId: string) => void;
  onHireClick?: (providerId: string) => void;
  compact?: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  onContactClick,
  onHireClick,
  compact = false
}) => {
  const isBroker = provider.type === 'broker';
  const broker = provider as BrokerProps;
  const deliverer = provider as DelivererProps;
  
  const getSpecializationLabel = (spec: string) => {
    const labels: Record<string, string> = {
      'flat': 'Apartments',
      'villa': 'Villas',
      'commercial': 'Commercial',
      'land': 'Land',
      'food': 'Food',
      'groceries': 'Groceries',
      'retail': 'Retail',
      'documents': 'Documents',
      'other': 'Other'
    };
    
    return labels[spec] || spec;
  };
  
  const renderProviderStats = () => {
    if (isBroker) {
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="h-4 w-4" />
          <span>{broker.dealsClosed} deals closed</span>
          <span className="text-green-600 font-medium">{broker.commissionRate}% commission</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>{deliverer.deliveriesCompleted} deliveries</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{deliverer.avgDeliveryTime || '--'} min avg</span>
        </div>
      );
    }
  };
  
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <CardContent className={`p-0 ${compact ? 'pb-0' : ''}`}>
        <div className="relative">
          {/* Provider Badge */}
          <div className="absolute top-2 left-2 z-10">
            <Badge className={isBroker ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600"}>
              {isBroker ? 'Broker' : 'Deliverer'}
            </Badge>
          </div>
          
          {/* Verified Badge */}
          {provider.verified && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-green-500 hover:bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}
          
          <div className="bg-gradient-to-b from-blue-50 to-gray-50 p-4 flex flex-col md:flex-row items-center gap-4">
            {/* Avatar */}
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage src={provider.profileImage} alt={provider.name} />
              <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            {/* Provider Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-semibold text-lg">{provider.name}</h3>
              
              <div className="flex flex-wrap items-center gap-1 mt-1 justify-center md:justify-start">
                {/* Rating */}
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1">{provider.rating.toFixed(1)}</span>
                </div>
                
                <span className="text-gray-400 mx-1">•</span>
                
                {/* Location */}
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 ml-1">{provider.location.address.split(',')[0]}</span>
                </div>
                
                {!compact && <span className="text-gray-400 mx-1">•</span>}
                
                {/* Join Date - only in non-compact mode */}
                {!compact && (
                  <div className="text-sm text-gray-600">
                    Since {new Date(provider.joinDate).getFullYear()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {!compact && (
          <div className="p-4">
            {/* Provider Bio */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.bio}</p>
            
            {/* Specializations */}
            <div className="flex flex-wrap gap-1 mb-3">
              {provider.specializations.map(spec => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {getSpecializationLabel(spec)}
                </Badge>
              ))}
            </div>
            
            {/* Provider Type-Specific Stats */}
            {renderProviderStats()}
            
            {/* Badges */}
            {provider.badges && provider.badges.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                {provider.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {!compact && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => onContactClick && onContactClick(provider.id)}
          >
            Contact
          </Button>
          <Button 
            className="flex-1" 
            onClick={() => onHireClick && onHireClick(provider.id)}
          >
            {isBroker ? 'Hire Broker' : 'Request Delivery'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProviderCard;