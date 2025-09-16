
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import HobbyIcon, { HobbyType } from '../Events/HobbyIcon';

interface HobbiesCardProps {
  hobby: {
    name: string;
    type: HobbyType;
    description?: string;
    communitySize?: number;
    upcomingEvents?: number;
    image?: string;
  };
}

const HobbiesCard: React.FC<HobbiesCardProps> = ({ hobby }) => {
  return (
    <Card className="w-full hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 rounded-full bg-primary-100">
          <HobbyIcon hobbyType={hobby.type} className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <CardTitle className="text-xl">{hobby.name}</CardTitle>
          <CardDescription>
            {hobby.communitySize ? (
              <span className="flex items-center gap-1 text-sm">
                <Users className="h-3.5 w-3.5" /> {hobby.communitySize.toLocaleString()} enthusiasts
              </span>
            ) : 'Discover this hobby'}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4">{hobby.description || 'Join the community and explore this exciting hobby!'}</p>
        
        {hobby.upcomingEvents && (
          <div className="flex items-center gap-1 text-sm text-primary-600 mb-2">
            <Calendar className="h-3.5 w-3.5" /> {hobby.upcomingEvents} upcoming events
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Badge variant="outline" className="hover:bg-primary-100">
          {hobby.type}
        </Badge>
        
        <Link to={`/hobbies/${hobby.name.toLowerCase()}`}>
          <Button variant="outline">Explore</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default HobbiesCard;
