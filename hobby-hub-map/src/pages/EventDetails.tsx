import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/UI/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import MapView from '@/components/Map/MapView';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  MessageCircle, 
  Send, 
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { eventService, EventResponse } from '@/services/eventService';
import { UserResponse } from '@/services/authService';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [participants, setParticipants] = useState<UserResponse[]>([]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const { toast } = useToast();

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const eventData = await eventService.getEventById(eventId);
        setEvent(eventData);
        
        // Fetch participants
        setParticipantsLoading(true);
        try {
          const participantsData = await eventService.getEventParticipants(eventId);
          setParticipants(participantsData);
        } catch (participantsError) {
          console.warn('Failed to fetch participants:', participantsError);
          // Don't show error for participants, just continue without them
        } finally {
          setParticipantsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Failed to load event details. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load event details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, toast]);

  const handleJoinEvent = async () => {
    if (!eventId || !event) return;

    try {
      setJoinLoading(true);
      
      const joinRequest = {
        eventId,
        message: comment.trim() || undefined,
        payEntryFee: event.price ? true : false
      };

      await eventService.joinEvent(eventId, joinRequest);
      
      // Refresh event data to update participation status
      const updatedEvent = await eventService.getEventById(eventId);
      setEvent(updatedEvent);
      
      // Refresh participants
      try {
        const updatedParticipants = await eventService.getEventParticipants(eventId);
        setParticipants(updatedParticipants);
      } catch (participantsError) {
        console.warn('Failed to refresh participants:', participantsError);
      }

      setComment('');
      toast({
        title: "Success!",
        description: event.requiresApproval 
          ? "Your join request has been sent for approval." 
          : "You have joined this event.",
      });
    } catch (error) {
      console.error('Failed to join event:', error);
      toast({
        title: "Error",
        description: "Failed to join event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!eventId) return;

    try {
      setJoinLoading(true);
      await eventService.leaveEvent(eventId);
      
      // Refresh event data
      const updatedEvent = await eventService.getEventById(eventId);
      setEvent(updatedEvent);
      
      // Refresh participants
      try {
        const updatedParticipants = await eventService.getEventParticipants(eventId);
        setParticipants(updatedParticipants);
      } catch (participantsError) {
        console.warn('Failed to refresh participants:', participantsError);
      }

      toast({
        title: "Left event",
        description: "You are no longer attending this event.",
      });
    } catch (error) {
      console.error('Failed to leave event:', error);
      toast({
        title: "Error",
        description: "Failed to leave event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setJoinLoading(false);
    }
  };

  const handleShareEvent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Event link copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Failed to share:', error);
      toast({
        title: "Error",
        description: "Failed to share event.",
        variant: "destructive"
      });
    }
  };

  const getEventStatus = (event: EventResponse) => {
    return eventService.getEventStatus(event);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-green-500 text-white">Upcoming</Badge>;
      case 'live':
        return <Badge className="bg-red-500 text-white animate-pulse">Live Now</Badge>;
      case 'ended':
        return <Badge className="bg-gray-500 text-white">Ended</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600 text-white">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getHobbyClass = (hobbyName?: string) => {
    if (!hobbyName) return 'bg-primary-500 text-white';
    
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
    
    return hobbyColors[hobbyName.toLowerCase()] || 'bg-primary-500 text-white';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || 'The event you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/events')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const eventLocation = {
    lat: event.latitude || 0,
    lng: event.longitude || 0,
    address: event.location || event.placeName || 'Location not specified'
  };

  const eventForMap = {
    id: event.eventId,
    title: event.title,
    description: event.description,
    hobbyType: event.hobbyName || 'Other',
    location: eventLocation,
    date: eventService.formatEventDate(event.startTime),
    time: event.endTime 
      ? `${eventService.formatEventTime(event.startTime)} - ${eventService.formatEventTime(event.endTime)}`
      : eventService.formatEventTime(event.startTime),
    attendees: participants.map(p => ({
      id: p.userId,
      username: p.username,
      profileImage: p.profileImageUrl
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/events')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details (Left Column) */}
          <div className="lg:col-span-2">
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {event.imageUrl && (
                <div 
                  className="h-64 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                />
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {event.hobbyName && (
                      <Badge className={getHobbyClass(event.hobbyName)}>
                        {event.hobbyName}
                      </Badge>
                    )}
                    {getStatusBadge(getEventStatus(event))}
                    {!event.isPublic && (
                      <Badge variant="outline">Private</Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareEvent}
                      className="flex items-center"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>{eventService.formatEventDate(event.startTime)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {event.endTime 
                        ? `${eventService.formatEventTime(event.startTime)} - ${eventService.formatEventTime(event.endTime)}`
                        : eventService.formatEventTime(event.startTime)
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{eventLocation.address}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>
                      {event.currentParticipants} / {event.maxParticipants} participants
                    </span>
                  </div>

                  {event.price && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${event.price.toFixed(2)} entry fee</span>
                    </div>
                  )}
                </div>
                
                {event.creatorName && (
                  <div className="flex items-center mb-6">
                    <span className="text-sm font-medium">
                      Created by <span className="text-primary-600">{event.creatorName}</span>
                    </span>
                  </div>
                )}
                
                {event.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">About this event</h3>
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                  </div>
                )}

                {event.requirements && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                    <p className="text-gray-700 whitespace-pre-line">{event.requirements}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Location Map */}
            {(event.latitude && event.longitude) && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6 pb-4">
                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                  <p className="text-gray-600 mb-4">{eventLocation.address}</p>
                </div>
                <div className="h-64">
                  <MapView
                    events={[eventForMap]} 
                    selectedEvent={event.eventId}
                    center={eventLocation}
                    zoom={15}
                  />
                </div>
              </div>
            )}
            
            {/* Join/Leave Event Section */}
            {getEventStatus(event) === 'upcoming' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    {event.isParticipant ? 'You\'re attending this event' : 'Join this event'}
                  </h3>
                  
                  {!event.isParticipant ? (
                    <div className="space-y-4">
                      {event.requiresApproval && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <MessageCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                            <div>
                              <h4 className="font-medium text-yellow-800">Approval Required</h4>
                              <p className="text-sm text-yellow-700">
                                This event requires approval from the organizer. You can include a message with your request.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {event.price && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                            <div>
                              <h4 className="font-medium text-blue-800">Entry Fee Required</h4>
                              <p className="text-sm text-blue-700">
                                This event has an entry fee of ${event.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(event.requiresApproval || event.price) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {event.requiresApproval ? 'Message (optional)' : 'Note (optional)'}
                          </label>
                          <Textarea
                            placeholder={event.requiresApproval 
                              ? "Tell the organizer why you'd like to join..."
                              : "Any additional notes..."
                            }
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4">
                        <div className="text-sm text-gray-600">
                          {event.currentParticipants >= event.maxParticipants ? (
                            <span className="text-red-600 font-medium">Event is full</span>
                          ) : (
                            <span>
                              {event.maxParticipants - event.currentParticipants} spots remaining
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={handleJoinEvent}
                          disabled={joinLoading || event.currentParticipants >= event.maxParticipants}
                          className="min-w-[120px]"
                        >
                          {joinLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : event.requiresApproval ? (
                            'Request to Join'
                          ) : (
                            'Join Event'
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <h4 className="font-medium text-green-800">You're attending!</h4>
                            <p className="text-sm text-green-700">
                              {event.participationStatus === 'pending' 
                                ? 'Your participation is pending approval.'
                                : 'You\'re confirmed for this event.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline"
                          onClick={handleLeaveEvent}
                          disabled={joinLoading}
                          className="min-w-[120px]"
                        >
                          {joinLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : (
                            'Leave Event'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Participants Sidebar (Right Column) */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Participants
                  </h3>
                  <span className="text-sm text-gray-500">
                    {event.currentParticipants} of {event.maxParticipants}
                  </span>
                </div>
                
                {participantsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                  </div>
                ) : participants.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {participants.map((participant) => (
                      <Link 
                        to={`/profile/${participant.userId}`}
                        key={participant.userId} 
                        className="flex flex-col items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <Avatar className="h-12 w-12 mb-1">
                          {participant.profileImageUrl && (
                            <AvatarImage src={participant.profileImageUrl} />
                          )}
                          <AvatarFallback>
                            {participant.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-center truncate w-full">
                          {participant.username.split(' ')[0]}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No participants yet</p>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {event.isPublic ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Public event
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-gray-600">
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      Private event
                    </div>
                  )}
                  
                  {event.requiresApproval && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageCircle className="h-4 w-4 mr-2 text-yellow-500" />
                      Requires approval
                    </div>
                  )}
                  
                  {event.price && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      ${event.price.toFixed(2)} entry fee
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
















// import React, { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Navbar from '@/UI/Navbar';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import MapView from '@/components/Map/MapView';
// import { CalendarDays, Clock, MapPin, Users, Share2, MessageCircle, Send } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';

// // Mock event data
// const MOCK_EVENT = {
//   id: 'event-1',
//   title: 'Sunday Football Match',
//   description: 'Friendly 5-a-side football match. All skill levels welcome! We need a few more players to make up teams. Bring water and appropriate footwear.',
//   hobbyType: 'Sports',
//   location: {
//     lat: 51.505,
//     lng: -0.09,
//     address: 'Hyde Park, London'
//   },
//   date: 'Sunday, May 5',
//   time: '10:00 AM - 12:00 PM',
//   creator: {
//     id: 'user-1',
//     username: 'John Doe',
//     profileImage: 'https://i.pravatar.cc/150?img=1'
//   },
//   attendees: [
//     { id: 'user-1', username: 'John Doe', profileImage: 'https://i.pravatar.cc/150?img=1', hobbies: ['Sports', 'Photography'] },
//     { id: 'user-2', username: 'Jane Smith', profileImage: 'https://i.pravatar.cc/150?img=2', hobbies: ['Sports', 'Music'] },
//     { id: 'user-3', username: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/150?img=3', hobbies: ['Sports', 'Gaming'] },
//     { id: 'user-4', username: 'Sam Williams', profileImage: 'https://i.pravatar.cc/150?img=4', hobbies: ['Sports', 'Tech'] },
//   ],
//   comments: [
//     { 
//       id: 'comment-1',
//       user: { id: 'user-2', username: 'Jane Smith', profileImage: 'https://i.pravatar.cc/150?img=2' },
//       text: 'Looking forward to this! What color shirts should we bring?',
//       timestamp: '2 days ago'
//     },
//     { 
//       id: 'comment-2',
//       user: { id: 'user-1', username: 'John Doe', profileImage: 'https://i.pravatar.cc/150?img=1' },
//       text: 'Great question! Let\'s do white vs dark colors. Just bring both options if you can.',
//       timestamp: '1 day ago'
//     },
//     { 
//       id: 'comment-3',
//       user: { id: 'user-3', username: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/150?img=3' },
//       text: 'Is it OK if I bring a friend who\'s visiting?',
//       timestamp: '5 hours ago'
//     }
//   ],
//   images: [
//     'https://images.unsplash.com/photo-1486286701208-1d58e9338013',
//   ]
// };

// const EventDetails: React.FC = () => {
//   const { eventId } = useParams<{ eventId: string }>();
//   const [comment, setComment] = useState('');
//   const [isAttending, setIsAttending] = useState(false);
//   const { toast } = useToast();

//   // In a real app, fetch event data based on eventId
//   const event = MOCK_EVENT;

//   if (!event) {
//     return <div>Event not found</div>;
//   }

//   const handleJoinEvent = () => {
//     setIsAttending(true);
//     toast({
//       title: "Success!",
//       description: "You have joined this event.",
//     });
//     // In a real app, update backend
//   };

//   const handleLeaveEvent = () => {
//     setIsAttending(false);
//     toast({
//       title: "Left event",
//       description: "You are no longer attending this event.",
//     });
//     // In a real app, update backend
//   };

//   const handleShareEvent = () => {
//     // For demo purposes, just copy the URL
//     navigator.clipboard.writeText(window.location.href);
//     toast({
//       title: "Link copied!",
//       description: "Event link copied to clipboard.",
//     });
//   };

//   const handleSubmitComment = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!comment.trim()) return;
    
//     // In a real app, send comment to backend
//     toast({
//       title: "Comment added",
//       description: "Your comment has been posted.",
//     });
    
//     setComment('');
//   };

//   // Function to get hobby class for styling
//   const getHobbyClass = (hobbyType: string) => {
//     const hobbyColors: Record<string, string> = {
//       'sports': 'bg-hobby-sports text-white',
//       'arts': 'bg-hobby-arts text-white',
//       'music': 'bg-hobby-music text-white',
//       'cooking': 'bg-hobby-cooking text-white',
//       'gaming': 'bg-hobby-gaming text-white',
//       'tech': 'bg-hobby-tech text-white',
//       'outdoor': 'bg-hobby-outdoor text-white',
//       'social': 'bg-hobby-social text-white',
//     };
    
//     return hobbyColors[hobbyType.toLowerCase()] || 'bg-primary-500 text-white';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Event Details (Left Column) */}
//           <div className="lg:col-span-2">
//             {/* Event Header */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               {event.images && event.images.length > 0 && (
//                 <div 
//                   className="h-64 w-full bg-cover bg-center"
//                   style={{ backgroundImage: `url(${event.images[0]})` }}
//                 />
//               )}
              
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <Badge className={`${getHobbyClass(event.hobbyType)}`}>
//                     {event.hobbyType}
//                   </Badge>
                  
//                   <div className="flex space-x-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={handleShareEvent}
//                       className="flex items-center"
//                     >
//                       <Share2 className="h-4 w-4 mr-1" />
//                       Share
//                     </Button>
                    
//                     {isAttending ? (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={handleLeaveEvent}
//                       >
//                         Leave
//                       </Button>
//                     ) : (
//                       <Button
//                         size="sm"
//                         onClick={handleJoinEvent}
//                       >
//                         Join Event
//                       </Button>
//                     )}
//                   </div>
//                 </div>
                
//                 <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
                
//                 <div className="flex items-center text-gray-600 mb-1">
//                   <CalendarDays className="h-4 w-4 mr-2" />
//                   <span>{event.date}</span>
//                 </div>
                
//                 <div className="flex items-center text-gray-600 mb-1">
//                   <Clock className="h-4 w-4 mr-2" />
//                   <span>{event.time}</span>
//                 </div>
                
//                 <div className="flex items-center text-gray-600 mb-4">
//                   <MapPin className="h-4 w-4 mr-2" />
//                   <span>{event.location.address}</span>
//                 </div>
                
//                 <div className="flex items-center mb-6">
//                   <Link to={`/profile/${event.creator.id}`} className="flex items-center">
//                     <Avatar className="h-8 w-8">
//                       {event.creator.profileImage && (
//                         <AvatarImage src={event.creator.profileImage} />
//                       )}
//                       <AvatarFallback>
//                         {event.creator.username.slice(0, 2).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="ml-2 text-sm font-medium">
//                       Created by <span className="text-primary-600">{event.creator.username}</span>
//                     </span>
//                   </Link>
//                 </div>
                
//                 <div className="mb-6">
//                   <h3 className="font-semibold text-lg mb-2">About this event</h3>
//                   <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Location Map */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               <div className="p-6 pb-4">
//                 <h3 className="font-semibold text-lg mb-2">Location</h3>
//                 <p className="text-gray-600 mb-4">{event.location.address}</p>
//               </div>
//               <div className="h-64">
//                 <MapView
//                   events={[event]} 
//                   selectedEvent={event.id}
//                   center={event.location}
//                   zoom={15}
//                 />
//               </div>
//             </div>
            
//             {/* Comments Section */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="p-6">
//                 <h3 className="font-semibold text-lg mb-4 flex items-center">
//                   <MessageCircle className="h-5 w-5 mr-2" />
//                   Discussion ({event.comments.length})
//                 </h3>
                
//                 <div className="space-y-4 mb-6">
//                   {event.comments.map(comment => (
//                     <div key={comment.id} className="flex space-x-3">
//                       <Link to={`/profile/${comment.user.id}`}>
//                         <Avatar className="h-9 w-9">
//                           {comment.user.profileImage && (
//                             <AvatarImage src={comment.user.profileImage} />
//                           )}
//                           <AvatarFallback>
//                             {comment.user.username.slice(0, 2).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                       </Link>
//                       <div>
//                         <div className="bg-gray-50 rounded-2xl p-3">
//                           <div className="flex justify-between items-start">
//                             <Link to={`/profile/${comment.user.id}`} className="font-medium text-sm">
//                               {comment.user.username}
//                             </Link>
//                             <span className="text-xs text-gray-500">{comment.timestamp}</span>
//                           </div>
//                           <p className="text-gray-700 mt-1">{comment.text}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <form onSubmit={handleSubmitComment}>
//                   <div className="flex space-x-3">
//                     <Avatar className="h-9 w-9">
//                       <AvatarImage src="https://i.pravatar.cc/150?img=5" />
//                       <AvatarFallback>ME</AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 relative">
//                       <Textarea
//                         placeholder="Write a comment..."
//                         value={comment}
//                         onChange={(e) => setComment(e.target.value)}
//                         className="pr-10"
//                         rows={2}
//                       />
//                       <Button
//                         type="submit"
//                         size="sm"
//                         variant="ghost"
//                         className="absolute right-2 bottom-2 p-1 h-auto"
//                         disabled={!comment.trim()}
//                       >
//                         <Send className="h-4 w-4" />
//                         <span className="sr-only">Send</span>
//                       </Button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
          
//           {/* Attendees (Right Column) */}
//           <div>
//             <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
//               <div className="p-6 border-b">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold text-lg flex items-center">
//                     <Users className="h-5 w-5 mr-2" />
//                     Attendees
//                   </h3>
//                   <span className="text-sm text-gray-500">{event.attendees.length} going</span>
//                 </div>
                
//                 <div className="flex flex-wrap -mx-1">
//                   {event.attendees.map((attendee) => (
//                     <Link 
//                       to={`/profile/${attendee.id}`}
//                       key={attendee.id} 
//                       className="px-1 mb-2 w-1/4"
//                     >
//                       <div className="flex flex-col items-center">
//                         <Avatar className="h-12 w-12 mb-1">
//                           {attendee.profileImage && (
//                             <AvatarImage src={attendee.profileImage} />
//                           )}
//                           <AvatarFallback>
//                             {attendee.username.slice(0, 2).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <span className="text-xs text-center truncate w-full">
//                           {attendee.username.split(' ')[0]}
//                         </span>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 <h3 className="font-semibold mb-3 text-sm">Shared Hobbies</h3>
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {[...new Set(event.attendees.flatMap(a => a.hobbies))].map((hobby, idx) => (
//                     <span
//                       key={idx}
//                       className={`tag ${getHobbyClass(hobby)}`}
//                     >
//                       {hobby}
//                     </span>
//                   ))}
//                 </div>
                
//                 <div className="pt-4 border-t">
//                   <Button className="w-full" onClick={isAttending ? handleLeaveEvent : handleJoinEvent}>
//                     {isAttending ? 'Leave Event' : 'Join Event'}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventDetails;
