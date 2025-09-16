import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMap } from '@/hooks/useMap';
import Navbar from '@/UI/Navbar';
import MapView from '@/components/Map/MapView';
import EventCard from '@/components/Events/EventCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Search,
  Calendar,
  Filter,
  MapPin,
  Plus,
  CalendarDays,
  Grid,
  Map
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { eventService, EventResponse } from '@/services/eventService';

// Hobby options
const HOBBY_OPTIONS = [
  'All Hobbies',
  'Sports',
  'Arts',
  'Music',
  'Cooking',
  'Gaming',
  'Tech',
  'Outdoor',
  'Social'
];

const Events: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation, getUserLocation } = useMap();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [selectedHobby, setSelectedHobby] = useState('All Hobbies');
  const [selectedDate, setSelectedDate] = useState('Any date');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventResponse[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch upcoming events
        const upcomingEvents = await eventService.getUpcomingEvents(1, 50);
        setEvents(upcomingEvents);
        
        // If user location is available, also fetch nearby events
        if (userLocation) {
          try {
            const nearbyEvents = await eventService.getEventsByLocation(
              userLocation.lat,
              userLocation.lng,
              20 // 20km radius
            );
            // Merge and deduplicate events
            const allEvents = [...upcomingEvents];
            nearbyEvents.forEach(nearbyEvent => {
              if (!allEvents.find(e => e.eventId === nearbyEvent.eventId)) {
                allEvents.push(nearbyEvent);
              }
            });
            setEvents(allEvents);
          } catch (nearbyError) {
            console.warn('Failed to fetch nearby events:', nearbyError);
            // Continue with upcoming events only
          }
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userLocation, toast]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Filter events based on selected filters
  useEffect(() => {
    let filtered = events;
    
    if (selectedHobby !== 'All Hobbies') {
      filtered = filtered.filter(event => 
        event.hobbyName === selectedHobby || 
        event.hobbyName?.toLowerCase() === selectedHobby.toLowerCase()
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.hobbyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Date filtering
    if (selectedDate !== 'Any date') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(today.getDate() + 7);
      const weekend = new Date(today);
      weekend.setDate(today.getDate() + (6 - today.getDay())); // Next Saturday
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startTime);
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        
        switch (selectedDate) {
          case 'Today':
            return eventDay.getTime() === today.getTime();
          case 'Tomorrow':
            return eventDay.getTime() === tomorrow.getTime();
          case 'This week':
            return eventDate >= today && eventDate <= weekFromNow;
          case 'This weekend':
            return eventDay.getDay() === 6 || eventDay.getDay() === 0; // Saturday or Sunday
          case 'Next week':
            const nextWeekStart = new Date(weekFromNow);
            const nextWeekEnd = new Date(weekFromNow);
            nextWeekEnd.setDate(weekFromNow.getDate() + 7);
            return eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
          default:
            return true;
        }
      });
    }
    
    setFilteredEvents(filtered);
  }, [events, selectedHobby, searchQuery, selectedDate]);

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(eventId);
    navigate(`/event/${eventId}`);
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      await eventService.joinEvent(eventId);
      toast({
        title: "Success!",
        description: "You have successfully joined this event.",
      });
      
      // Refresh events to update participation status
      const updatedEvents = await eventService.getUpcomingEvents(1, 50);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Failed to join event:', error);
      toast({
        title: "Error",
        description: "Failed to join event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateEvent = () => {
    navigate('/event/create');
  };

  // Convert EventResponse to the format expected by EventCard
  const convertEventForCard = (event: EventResponse) => ({
    id: event.eventId,
    title: event.title,
    description: event.description,
    hobbyType: event.hobbyName || 'Other',
    location: {
      lat: event.latitude || 0,
      lng: event.longitude || 0,
      address: event.location || event.placeName || 'Location not specified'
    },
    date: eventService.formatEventDate(event.startTime),
    time: event.endTime 
      ? `${eventService.formatEventTime(event.startTime)} - ${eventService.formatEventTime(event.endTime)}`
      : eventService.formatEventTime(event.startTime),
    attendees: [], // You might want to fetch participants separately or include in the API response
    isJoined: event.isParticipant || false
  });

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="p-4 bg-white border-b">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">All Events</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search events..." 
                className="pl-9 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedHobby} onValueChange={setSelectedHobby}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Hobby" />
              </SelectTrigger>
              <SelectContent>
                {HOBBY_OPTIONS.map((hobby) => (
                  <SelectItem key={hobby} value={hobby}>
                    {hobby}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any date">Any date</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                <SelectItem value="This week">This week</SelectItem>
                <SelectItem value="This weekend">This weekend</SelectItem>
                <SelectItem value="Next week">Next week</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex space-x-1 rounded-md border p-1">
              <Button 
                variant={viewMode === 'map' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('map')}
                className="px-2"
              >
                <Map className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Map</span>
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-2"
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Grid</span>
              </Button>
            </div>
          </div>
          
          <Button onClick={handleCreateEvent} className="ml-auto md:ml-0">
            <Plus className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {viewMode === 'map' ? (
          <div className="flex-1 relative">
            <MapView 
              events={filteredEvents.map(convertEventForCard)}
              places={[]} // Remove places for now, implement separately if needed
              onMarkerClick={(id, type) => type === 'event' && handleEventClick(id)}
              selectedEvent={selectedEvent}
              center={userLocation || undefined}
              showInfoOnHover={true}
            />
            
            <div className="absolute bottom-4 left-4 right-4 max-w-xs mx-auto bg-white rounded-lg shadow-lg p-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#FF5A5F] mr-1"></span>
                  <span>Sports</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#FFB400] mr-1"></span>
                  <span>Arts</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#8A2BE2] mr-1"></span>
                  <span>Music</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#FF8C00] mr-1"></span>
                  <span>Cooking</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#1E90FF] mr-1"></span>
                  <span>Gaming</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="container mx-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              )}
              
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-semibold text-lg mb-1">No events found</h3>
                  <p className="text-gray-500">
                    {searchQuery || selectedHobby !== 'All Hobbies' || selectedDate !== 'Any date'
                      ? 'Try adjusting your filters or create your own event!'
                      : 'Be the first to create an event in your area!'
                    }
                  </p>
                  <Button className="mt-4" onClick={handleCreateEvent}>
                    <Plus className="h-4 w-4 mr-2" /> Create Event
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.eventId}
                      {...convertEventForCard(event)}
                      onJoinClick={handleJoinEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;














// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useMap } from '@/hooks/useMap';
// import Navbar from '@/UI/Navbar';
// import MapView from '@/components/Map/MapView';
// import EventCard from '@/components/Events/EventCard';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import {
//   Search,
//   Calendar,
//   Filter,
//   MapPin,
//   Plus,
//   CalendarDays,
//   Grid,
//   Map
// } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';

// // Mock events data
// const MOCK_EVENTS = [
//   {
//     id: 'event-1',
//     title: 'Sunday Football Match',
//     description: 'Friendly 5-a-side football match. All skill levels welcome!',
//     hobbyType: 'Sports',
//     location: {
//       lat: 51.505,
//       lng: -0.09,
//       address: 'Hyde Park, London'
//     },
//     date: 'Sunday, May 5',
//     time: '10:00 AM',
//     attendees: [
//       { id: 'user-1', username: 'John Doe', profileImage: 'https://i.pravatar.cc/150?img=1' },
//       { id: 'user-2', username: 'Jane Smith', profileImage: 'https://i.pravatar.cc/150?img=2' },
//       { id: 'user-3', username: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/150?img=3' },
//       { id: 'user-4', username: 'Sam Williams', profileImage: 'https://i.pravatar.cc/150?img=4' },
//     ]
//   },
//   {
//     id: 'event-2',
//     title: 'Urban Photography Walk',
//     description: 'Explore the city and capture amazing urban photographs. Bring your camera or smartphone!',
//     hobbyType: 'Arts',
//     location: {
//       lat: 51.515,
//       lng: -0.1,
//       address: 'Trafalgar Square, London'
//     },
//     date: 'Saturday, May 4',
//     time: '2:00 PM',
//     attendees: [
//       { id: 'user-2', username: 'Jane Smith', profileImage: 'https://i.pravatar.cc/150?img=2' },
//       { id: 'user-5', username: 'Mike Brown', profileImage: 'https://i.pravatar.cc/150?img=5' },
//       { id: 'user-6', username: 'Emma Wilson', profileImage: 'https://i.pravatar.cc/150?img=6' },
//     ]
//   },
//   {
//     id: 'event-3',
//     title: 'Guitar Jam Session',
//     description: 'Casual guitar jam session for all levels. Acoustic and electric welcome!',
//     hobbyType: 'Music',
//     location: {
//       lat: 51.525,
//       lng: -0.085,
//       address: 'Camden Lock, London'
//     },
//     date: 'Friday, May 3',
//     time: '7:00 PM',
//     attendees: [
//       { id: 'user-3', username: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/150?img=3' },
//       { id: 'user-7', username: 'David Lee', profileImage: 'https://i.pravatar.cc/150?img=7' },
//       { id: 'user-8', username: 'Sophie Chen', profileImage: 'https://i.pravatar.cc/150?img=8' },
//       { id: 'user-9', username: 'Lucas Martin', profileImage: 'https://i.pravatar.cc/150?img=9' },
//       { id: 'user-10', username: 'Olivia Davis', profileImage: 'https://i.pravatar.cc/150?img=10' },
//     ]
//   },
//   {
//     id: 'event-4',
//     title: 'Cooking Class: Italian Pasta',
//     description: 'Learn to make authentic Italian pasta from scratch with a professional chef.',
//     hobbyType: 'Cooking',
//     location: {
//       lat: 51.512,
//       lng: -0.115,
//       address: 'Covent Garden, London'
//     },
//     date: 'Monday, May 6',
//     time: '6:30 PM',
//     attendees: [
//       { id: 'user-5', username: 'Mike Brown', profileImage: 'https://i.pravatar.cc/150?img=5' },
//       { id: 'user-8', username: 'Sophie Chen', profileImage: 'https://i.pravatar.cc/150?img=8' },
//       { id: 'user-10', username: 'Olivia Davis', profileImage: 'https://i.pravatar.cc/150?img=10' },
//     ]
//   },
//   {
//     id: 'event-5',
//     title: 'Board Game Night',
//     description: 'Fun night of strategy and party board games. Beginners welcome!',
//     hobbyType: 'Gaming',
//     location: {
//       lat: 51.535,
//       lng: -0.105,
//       address: 'Angel, London'
//     },
//     date: 'Wednesday, May 8',
//     time: '7:00 PM',
//     attendees: [
//       { id: 'user-1', username: 'John Doe', profileImage: 'https://i.pravatar.cc/150?img=1' },
//       { id: 'user-4', username: 'Sam Williams', profileImage: 'https://i.pravatar.cc/150?img=4' },
//       { id: 'user-7', username: 'David Lee', profileImage: 'https://i.pravatar.cc/150?img=7' },
//       { id: 'user-9', username: 'Lucas Martin', profileImage: 'https://i.pravatar.cc/150?img=9' },
//     ]
//   }
// ];

// // Mock places data
// const MOCK_PLACES = [
//   {
//     id: 'place-1',
//     name: 'Hyde Park Football Pitch',
//     description: 'Great open football pitch, perfect for 5-a-side games',
//     type: 'event',
//     hobbyType: 'Sports',
//     location: {
//       lat: 51.505,
//       lng: -0.09,
//       address: 'Hyde Park, London'
//     },
//     createdBy: {
//       id: 'user-1',
//       username: 'John Doe'
//     },
//     images: ['https://images.unsplash.com/photo-1426604966848-d7adac402bff']
//   },
//   {
//     id: 'place-2',
//     name: 'Camden Music Studio',
//     description: 'Professional music studio available for rent by the hour',
//     type: 'rent',
//     hobbyType: 'Music',
//     location: {
//       lat: 51.525,
//       lng: -0.085,
//       address: 'Camden Lock, London'
//     },
//     createdBy: {
//       id: 'user-3',
//       username: 'Alex Johnson'
//     }
//   },
//   {
//     id: 'place-3',
//     name: 'Photography Equipment Shop',
//     description: 'Photography equipment for sale at great prices',
//     type: 'sell',
//     hobbyType: 'Arts',
//     location: {
//       lat: 51.515,
//       lng: -0.1,
//       address: 'Trafalgar Square, London'
//     },
//     createdBy: {
//       id: 'user-2',
//       username: 'Jane Smith'
//     }
//   }
// ];

// // Hobby options
// const HOBBY_OPTIONS = [
//   'All Hobbies',
//   'Sports',
//   'Arts',
//   'Music',
//   'Cooking',
//   'Gaming',
//   'Tech',
//   'Outdoor',
//   'Social'
// ];

// const Events: React.FC = () => {
//   const navigate = useNavigate();
//   const { userLocation, getUserLocation } = useMap();
//   const { toast } = useToast();
  
//   const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
//   const [selectedHobby, setSelectedHobby] = useState('All Hobbies');
//   const [selectedDate, setSelectedDate] = useState('Any date');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredEvents, setFilteredEvents] = useState(MOCK_EVENTS);
//   const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
//   const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
//   const [showPlaces, setShowPlaces] = useState(true);

//   useEffect(() => {
//     getUserLocation();
//   }, [getUserLocation]);

//   // Filter events based on selected filters
//   useEffect(() => {
//     let filtered = MOCK_EVENTS;
    
//     if (selectedHobby !== 'All Hobbies') {
//       filtered = filtered.filter(event => event.hobbyType === selectedHobby);
//     }
    
//     if (searchQuery) {
//       filtered = filtered.filter(event => 
//         event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         event.description?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     // Additional date filtering would be done here
    
//     setFilteredEvents(filtered);
//   }, [selectedHobby, searchQuery, selectedDate]);

//   const handleItemClick = (id: string, type: 'event' | 'place') => {
//     if (type === 'event') {
//       setSelectedEvent(id);
//       setSelectedPlace(null);
//       navigate(`/event/${id}`);
//     } else {
//       setSelectedPlace(id);
//       setSelectedEvent(null);
//       navigate(`/place/${id}`);
//     }
//   };

//   const handleJoinEvent = (eventId: string) => {
//     toast({
//       title: "Event Joined!",
//       description: "You have successfully joined this event.",
//     });
//     // In a real app, you would update the backend/state here
//   };

//   const handleCreateEvent = () => {
//     navigate('/event/create');
//     // In a real app, this would navigate to an event creation page
//   };

//   const filteredPlaces = showPlaces ? MOCK_PLACES.filter(place => {
//     if (selectedHobby !== 'All Hobbies' && place.hobbyType) {
//       return place.hobbyType === selectedHobby;
//     }
//     return true;
//   }) : [];

//   return (
//     <div className="h-screen flex flex-col bg-gray-50">
//       <Navbar />
      
//       <div className="p-4 bg-white border-b">
//         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
//           <h1 className="text-2xl font-bold">All Events</h1>
          
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
//               <Input 
//                 placeholder="Search events..." 
//                 className="pl-9 w-full md:w-64"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
            
//             <Select value={selectedHobby} onValueChange={setSelectedHobby}>
//               <SelectTrigger className="w-full md:w-40">
//                 <SelectValue placeholder="Hobby" />
//               </SelectTrigger>
//               <SelectContent>
//                 {HOBBY_OPTIONS.map((hobby) => (
//                   <SelectItem key={hobby} value={hobby}>
//                     {hobby}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
            
//             <Select value={selectedDate} onValueChange={setSelectedDate}>
//               <SelectTrigger className="w-full md:w-40">
//                 <SelectValue placeholder="Date" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Any date">Any date</SelectItem>
//                 <SelectItem value="Today">Today</SelectItem>
//                 <SelectItem value="Tomorrow">Tomorrow</SelectItem>
//                 <SelectItem value="This week">This week</SelectItem>
//                 <SelectItem value="This weekend">This weekend</SelectItem>
//                 <SelectItem value="Next week">Next week</SelectItem>
//               </SelectContent>
//             </Select>
            
//             <div className="flex space-x-1 rounded-md border p-1">
//               <Button 
//                 variant={viewMode === 'map' ? 'default' : 'ghost'} 
//                 size="sm"
//                 onClick={() => setViewMode('map')}
//                 className="px-2"
//               >
//                 <Map className="h-4 w-4" />
//                 <span className="sr-only md:not-sr-only md:ml-2">Map</span>
//               </Button>
//               <Button 
//                 variant={viewMode === 'grid' ? 'default' : 'ghost'} 
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//                 className="px-2"
//               >
//                 <Grid className="h-4 w-4" />
//                 <span className="sr-only md:not-sr-only md:ml-2">Grid</span>
//               </Button>
//             </div>
//           </div>
          
//           <Button onClick={handleCreateEvent} className="ml-auto md:ml-0">
//             <Plus className="h-4 w-4 mr-2" /> Create Event
//           </Button>
//         </div>
//       </div>
      
//       <div className="flex flex-1 overflow-hidden">
//         {viewMode === 'map' ? (
//           <div className="flex-1 relative">
//             <MapView 
//               events={filteredEvents}
//               places={filteredPlaces}
//               onMarkerClick={handleItemClick}
//               selectedEvent={selectedEvent}
//               selectedPlace={selectedPlace}
//               center={userLocation || undefined}
//               showInfoOnHover={true}
//             />
            
//             <div className="absolute bottom-4 left-4 right-4 max-w-xs mx-auto bg-white rounded-lg shadow-lg p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="font-semibold">Show Places</h3>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input 
//                     type="checkbox" 
//                     className="sr-only peer" 
//                     checked={showPlaces} 
//                     onChange={() => setShowPlaces(!showPlaces)} 
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
//                 </label>
//               </div>
              
//               <div className="grid grid-cols-2 gap-2 text-xs">
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-[#FF5A5F] mr-1"></span>
//                   <span>Sports</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-[#FFB400] mr-1"></span>
//                   <span>Arts</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-[#8A2BE2] mr-1"></span>
//                   <span>Music</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-[#FF8C00] mr-1"></span>
//                   <span>Cooking</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-[#1E90FF] mr-1"></span>
//                   <span>Gaming</span>
//                 </div>
//               </div>
              
//               {showPlaces && (
//                 <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
//                   <div className="flex items-center">
//                     <span className="w-3 h-3 bg-[#4285F4] mr-1" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}></span>
//                     <span>For Rent</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="w-3 h-3 bg-[#DB4437] mr-1" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></span>
//                     <span>For Sale</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="flex-1 p-4 overflow-y-auto">
//             <div className="container mx-auto">
//               <Tabs defaultValue="events">
//                 <TabsList className="mb-6">
//                   <TabsTrigger value="events" className="flex items-center">
//                     <Calendar className="h-4 w-4 mr-2" /> Events ({filteredEvents.length})
//                   </TabsTrigger>
//                   <TabsTrigger value="places" className="flex items-center">
//                     <MapPin className="h-4 w-4 mr-2" /> Places ({filteredPlaces.length})
//                   </TabsTrigger>
//                 </TabsList>
                
//                 <TabsContent value="events">
//                   {filteredEvents.length === 0 ? (
//                     <div className="text-center py-12">
//                       <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//                       <h3 className="font-semibold text-lg mb-1">No events found</h3>
//                       <p className="text-gray-500">Try adjusting your filters or create your own event!</p>
//                       <Button className="mt-4" onClick={handleCreateEvent}>
//                         <Plus className="h-4 w-4 mr-2" /> Create Event
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {filteredEvents.map((event) => (
//                         <EventCard
//                           key={event.id}
//                           {...event}
//                           onJoinClick={handleJoinEvent}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </TabsContent>
                
//                 <TabsContent value="places">
//                   {filteredPlaces.length === 0 ? (
//                     <div className="text-center py-12">
//                       <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//                       <h3 className="font-semibold text-lg mb-1">No places found</h3>
//                       <p className="text-gray-500">Try adjusting your filters or add your favorite place!</p>
//                       <Button className="mt-4" onClick={() => navigate('/place/create')}>
//                         <Plus className="h-4 w-4 mr-2" /> Add Place
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {filteredPlaces.map((place) => (
//                         <PlaceCard
//                           key={place.id}
//                           place={place}
//                           onClick={() => handleItemClick(place.id, 'place')}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Events;

// // PlaceCard component
// interface PlaceCardProps {
//   place: {
//     id: string;
//     name: string;
//     description: string;
//     type: string;
//     hobbyType?: string;
//     location: {
//       lat: number;
//       lng: number;
//       address?: string;
//     };
//     createdBy: {
//       id: string;
//       username: string;
//     };
//     images?: string[];
//   };
//   onClick: () => void;
// }

// const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'event': return 'bg-purple-500 text-white';
//       case 'rent': return 'bg-blue-500 text-white';
//       case 'sell': return 'bg-red-500 text-white';
//       default: return 'bg-green-500 text-white';
//     }
//   };
  
//   const getTypeLabel = (type: string) => {
//     switch (type) {
//       case 'event': return 'Event Venue';
//       case 'rent': return 'For Rent';
//       case 'sell': return 'For Sale';
//       default: return 'Regular Place';
//     }
//   };
  
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
//       <div className="h-48 bg-gray-200 relative">
//         {place.images && place.images[0] ? (
//           <img 
//             src={place.images[0]} 
//             alt={place.name} 
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-100">
//             <MapPin className="h-12 w-12 text-gray-400" />
//           </div>
//         )}
//         <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(place.type)}`}>
//           {getTypeLabel(place.type)}
//         </span>
//       </div>
      
//       <div className="p-4">
//         <h3 className="font-bold text-lg mb-1">{place.name}</h3>
        
//         {place.hobbyType && (
//           <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium mb-2">
//             {place.hobbyType}
//           </span>
//         )}
        
//         <p className="text-gray-600 text-sm line-clamp-2 mb-3">{place.description}</p>
        
//         <div className="flex items-center text-sm text-gray-500">
//           <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
//           <span className="line-clamp-1">{place.location.address || 'Location pin on map'}</span>
//         </div>
//       </div>
//     </div>
//   );
// };
