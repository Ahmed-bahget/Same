import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Attendee {
  id: string;
  username: string;
  profileImage?: string;
  hobbies?: string[];
}

export interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  hobbyType: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  date: string;
  time: string;
  attendees?: Attendee[];
  currentParticipants?: number;
  maxParticipants?: number;
  price?: number;
  isJoined?: boolean;
  requiresApproval?: boolean;
  isPublic?: boolean;
  status?: 'upcoming' | 'live' | 'ended' | 'cancelled';
  isCompact?: boolean;
  onJoinClick?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  hobbyType,
  location,
  date,
  time,
  attendees = [],
  currentParticipants = 0,
  maxParticipants = 0,
  price,
  isJoined = false,
  requiresApproval = false,
  isPublic = true,
  status = 'upcoming',
  isCompact = false,
  onJoinClick
}) => {
  const hobbyColors: Record<string, string> = {
    'sports': 'bg-red-500 text-white',
    'arts': 'bg-yellow-500 text-white',
    'music': 'bg-purple-500 text-white',
    'cooking': 'bg-orange-500 text-white',
    'gaming': 'bg-blue-500 text-white',
    'tech': 'bg-indigo-500 text-white',
    'outdoor': 'bg-green-500 text-white',
    'social': 'bg-pink-500 text-white',
  };

  const statusColors: Record<string, string> = {
    'upcoming': 'bg-green-500',
    'live': 'bg-red-500 animate-pulse',
    'ended': 'bg-gray-500',
    'cancelled': 'bg-red-600'
  };

  const hobbyClass = hobbyColors[hobbyType.toLowerCase()] || 'bg-primary-500 text-white';
  const statusClass = statusColors[status] || 'bg-green-500';
  
  const participantCount = attendees.length || currentParticipants;
  const maxCount = maxParticipants;
  const isFull = maxCount > 0 && participantCount >= maxCount;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'live': return 'Live Now';
      case 'ended': return 'Ended';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };
  
  return (
    <Card className={`overflow-hidden card-hover ${isCompact ? 'max-w-full' : 'max-w-sm'} ${status === 'cancelled' ? 'opacity-60' : ''}`}>
      <div className={`h-2 w-full ${statusClass}`} />
      <CardContent className={`pt-4 ${isCompact ? 'p-3' : 'p-5'}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-1">
            <Badge className={hobbyClass}>{hobbyType}</Badge>
            {status !== 'upcoming' && (
              <Badge variant="secondary" className={statusClass + ' text-white'}>
                {getStatusLabel(status)}
              </Badge>
            )}
            {!isPublic && (
              <Badge variant="outline" className="text-xs">Private</Badge>
            )}
            {requiresApproval && (
              <Badge variant="outline" className="text-xs">Approval Required</Badge>
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{date}</span>
          </div>
        </div>

        <Link to={`/event/${id}`} className="block mb-2 hover:text-primary-600 transition-colors">
          <h3 className={`font-bold ${isCompact ? 'text-base' : 'text-lg'} line-clamp-1`}>{title}</h3>
        </Link>

        {!isCompact && description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>{time}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="line-clamp-1">{location.address || 'Location pin on map'}</span>
          </div>

          {price && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-1.5 text-gray-400" />
              <span>${price.toFixed(2)} entry fee</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {attendees.length > 0 ? (
              <div className="flex -space-x-3 mr-3">
                {attendees.slice(0, 3).map((attendee) => (
                  <Avatar key={attendee.id} className="h-8 w-8 border-2 border-white">
                    {attendee.profileImage ? (
                      <AvatarImage src={attendee.profileImage} />
                    ) : null}
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {attendee.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {attendees.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium">
                    +{attendees.length - 3}
                  </div>
                )}
              </div>
            ) : (
              <div className="mr-3">
                <Avatar className="h-8 w-8 bg-gray-100">
                  <AvatarFallback>
                    <Users className="h-4 w-4 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-1 text-gray-400" />
              <span className={isFull ? 'text-red-600 font-medium' : ''}>
                {participantCount}
                {maxCount > 0 && ` / ${maxCount}`}
                {maxCount > 0 ? (isFull ? ' (Full)' : ' spots') : ' joined'}
              </span>
            </div>
          </div>
          
          {isJoined && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
      </CardContent>

      {!isCompact && (
        <CardFooter className="bg-gray-50 px-5 py-3 flex justify-between items-center">
          <Link to={`/event/${id}`} className="text-sm text-primary-600 hover:underline">
            View Details
          </Link>
          
          {status === 'upcoming' && !isJoined && (
            <Button 
              onClick={() => onJoinClick && onJoinClick(id)} 
              size="sm"
              disabled={isFull}
              className="min-w-[100px]"
            >
              {isFull ? 'Full' : requiresApproval ? 'Request' : 'Join'}
            </Button>
          )}
          
          {isJoined && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Joined
            </Badge>
          )}
          
          {status === 'cancelled' && (
            <Badge variant="destructive">
              Cancelled
            </Badge>
          )}
          
          {status === 'ended' && (
            <Badge variant="secondary">
              Ended
            </Badge>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;

















// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Calendar, Clock, MapPin, Users } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';

// interface Attendee {
//   id: string;
//   username: string;
//   profileImage?: string;
//   hobbies?: string[];
// }

// export interface EventCardProps {
//   id: string;
//   title: string;
//   description?: string;
//   hobbyType: string;
//   location: {
//     lat: number;
//     lng: number;
//     address?: string;
//   };
//   date: string;
//   time: string;
//   attendees: Attendee[];
//   isCompact?: boolean;
//   onJoinClick?: (id: string) => void;
// }

// const EventCard: React.FC<EventCardProps> = ({
//   id,
//   title,
//   description,
//   hobbyType,
//   location,
//   date,
//   time,
//   attendees,
//   isCompact = false,
//   onJoinClick
// }) => {
//   const hobbyColors: Record<string, string> = {
//     'sports': 'bg-hobby-sports text-white',
//     'arts': 'bg-hobby-arts text-white',
//     'music': 'bg-hobby-music text-white',
//     'cooking': 'bg-hobby-cooking text-white',
//     'gaming': 'bg-hobby-gaming text-white',
//     'tech': 'bg-hobby-tech text-white',
//     'outdoor': 'bg-hobby-outdoor text-white',
//     'social': 'bg-hobby-social text-white',
//   };

//   const hobbyClass = hobbyColors[hobbyType.toLowerCase()] || 'bg-primary-500 text-white';
  
//   return (
//     <Card className={`overflow-hidden card-hover ${isCompact ? 'max-w-full' : 'max-w-sm'}`}>
//       <div className={`h-2 w-full ${hobbyClass}`} />
//       <CardContent className={`pt-4 ${isCompact ? 'p-3' : 'p-5'}`}>
//         <div className="flex justify-between items-start mb-3">
//           <Badge className={hobbyClass}>{hobbyType}</Badge>
//           <div className="text-xs text-gray-500 flex items-center">
//             <Calendar className="h-3 w-3 mr-1" />
//             <span>{date}</span>
//           </div>
//         </div>

//         <Link to={`/event/${id}`} className="block mb-2 hover:text-primary-600 transition-colors">
//           <h3 className={`font-bold ${isCompact ? 'text-base' : 'text-lg'} line-clamp-1`}>{title}</h3>
//         </Link>

//         {!isCompact && description && (
//           <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
//         )}

//         <div className="flex items-center text-sm text-gray-600 mb-2">
//           <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
//           <span>{time}</span>
//         </div>

//         <div className="flex items-center text-sm text-gray-600 mb-4">
//           <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
//           <span className="line-clamp-1">{location.address || 'Location pin on map'}</span>
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="flex -space-x-3">
//             {attendees.slice(0, 3).map((attendee) => (
//               <Avatar key={attendee.id} className="h-8 w-8 border-2 border-white">
//                 {attendee.profileImage ? (
//                   <AvatarImage src={attendee.profileImage} />
//                 ) : null}
//                 <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
//                   {attendee.username.slice(0, 2).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//             ))}
//             {attendees.length > 3 && (
//               <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium">
//                 +{attendees.length - 3}
//               </div>
//             )}
//           </div>
          
//           <div className="flex items-center text-sm">
//             <Users className="h-4 w-4 mr-1 text-gray-400" />
//             <span>{attendees.length} joined</span>
//           </div>
//         </div>
//       </CardContent>

//       {!isCompact && (
//         <CardFooter className="bg-gray-50 px-5 py-3 flex justify-between items-center">
//           <Link to={`/event/${id}`} className="text-sm text-primary-600 hover:underline">
//             View Details
//           </Link>
//           <Button onClick={() => onJoinClick && onJoinClick(id)} size="sm">
//             Join Event
//           </Button>
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// export default EventCard;
