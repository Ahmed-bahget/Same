
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UserCardProps {
  id: string;
  username: string;
  profileImage?: string;
  hobbies: string[];
  distance?: number;
  location?: string;
  onConnectClick?: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  username,
  profileImage,
  hobbies,
  distance,
  location,
  onConnectClick,
}) => {
  const getHobbyClass = (hobby: string) => {
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
    
    return hobbyColors[hobby.toLowerCase()] || 'bg-primary-100 text-primary-800';
  };
  
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-5">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={username} />
            ) : null}
            <AvatarFallback className="bg-primary-100 text-primary-800">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <Link to={`/profile/${id}`}>
              <h3 className="font-bold text-lg hover:text-primary-600 transition-colors">
                {username}
              </h3>
            </Link>
            
            {(location || distance) && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {location && <span className="mr-1">{location}</span>}
                {distance && <span>({distance} km away)</span>}
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Hobbies</h4>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, index) => (
              <span
                key={index}
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getHobbyClass(hobby)}`}
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Link to={`/profile/${id}`} className="text-sm text-primary-600 hover:underline">
            View Profile
          </Link>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onConnectClick && onConnectClick(id)}
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
