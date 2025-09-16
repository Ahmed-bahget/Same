
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/UI/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, MapPin, Image, MessageCircle, Plus, Map, Building } from 'lucide-react';
import MapView from '@/components/Map/MapView';
import EventCard from '@/components/Events/EventCard';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

// Mock user data with enhanced places field
const MOCK_USER = {
  id: 'user-1',
  username: 'John Doe',
  profileImage: 'https://i.pravatar.cc/300?img=1',
  coverImage: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
  bio: 'Passionate football player and photography enthusiast. Always looking for new adventures and people to share experiences with.',
  location: 'London, UK',
  joinDate: 'January 2023',
  hobbies: [
    { name: 'Football', type: 'Sports' },
    { name: 'Photography', type: 'Arts' },
    { name: 'Hiking', type: 'Outdoor' },
    { name: 'Gaming', type: 'Gaming' },
  ],
  events: [
    {
      id: 'event-1',
      title: 'Sunday Football Match',
      date: 'Sunday, May 5',
      time: '10:00 AM',
      hobbyType: 'Sports',
      location: {
        lat: 51.505,
        lng: -0.09,
        address: 'Hyde Park, London'
      },
      description: 'Friendly 5-a-side football match. All skill levels welcome!',
      attendees: [
        { id: 'user-1', username: 'John Doe', profileImage: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', username: 'Jane Smith', profileImage: 'https://i.pravatar.cc/150?img=2' },
        { id: 'user-3', username: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/150?img=3' },
        { id: 'user-4', username: 'Sam Williams', profileImage: 'https://i.pravatar.cc/150?img=4' },
      ]
    },
    {
      id: 'event-2',
      title: 'Photography Workshop',
      date: 'Saturday, May 11',
      time: '2:00 PM',
      hobbyType: 'Arts',
      location: {
        lat: 51.515,
        lng: -0.1,
        address: 'Trafalgar Square, London'
      },
      description: 'Learn urban photography techniques in this hands-on workshop.',
      attendees: [
        { id: 'user-1', username: 'John Doe', profileImage: 'https://i.pravatar.cc/150?img=1' },
        { id: 'user-2', username: 'Jane Smith', profileImage: 'https://i.pravatar.cc/150?img=2' },
        { id: 'user-5', username: 'Mike Brown', profileImage: 'https://i.pravatar.cc/150?img=5' },
        { id: 'user-6', username: 'Emma Wilson', profileImage: 'https://i.pravatar.cc/150?img=6' },
      ]
    }
  ],
  places: [
    {
      id: 'place-1',
      name: 'Hyde Park Football Pitch',
      type: 'event', // Regular place, event venue, rental, for sale
      hobbyType: 'Sports',
      description: 'Great open football pitch, perfect for 5-a-side games.',
      location: { lat: 51.505, lng: -0.09, address: 'Hyde Park, London' },
      images: ['https://images.unsplash.com/photo-1426604966848-d7adac402bff'],
      hasActiveEvents: true, // Flag to show if this place has active events
      activeEvent: {
        id: 'event-1',
        title: 'Sunday Football Match',
        date: 'Sunday, May 5',
        time: '10:00 AM'
      }
    },
    {
      id: 'place-2',
      name: 'Primrose Hill',
      type: 'regular',
      hobbyType: 'Photography',
      description: 'Amazing view of London skyline, perfect for sunset photography.',
      location: { lat: 51.538, lng: -0.159, address: 'Primrose Hill, London' },
      images: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21']
    },
    {
      id: 'place-3',
      name: 'Music Studio Space',
      type: 'rent',
      hobbyType: 'Music',
      description: 'Fully equipped music studio available for hourly rental.',
      price: '£25/hour',
      location: { lat: 51.522, lng: -0.15, address: 'Camden, London' },
      images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04']
    },
    {
      id: 'place-4',
      name: 'Guitar Collection',
      type: 'sell',
      hobbyType: 'Music',
      description: 'Vintage guitar collection for sale, great condition.',
      price: '£1,200',
      location: { lat: 51.52, lng: -0.14, address: 'Camden, London' },
      images: ['https://images.unsplash.com/photo-1556449895-a33c9dba33dd']
    }
  ],
  gallery: [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff',
      type: 'Photography',
      caption: 'Sunday morning nature walk'
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb',
      type: 'Photography',
      caption: 'Mountain adventure'
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
      type: 'Photography',
      caption: 'Beach sunset'
    }
  ]
};

interface Attendee {
  id: string;
  username: string;
  profileImage: string;
  hobbies?: { name: string; type: string }[]; // Ensure hobbies is optional
}

// Update Event interface to use the new Attendee type
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  hobbyType: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  description?: string;
  attendees: Attendee[];
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [mapView, setMapView] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // In a real app, fetch user data based on userId
  const user = MOCK_USER;

  if (!user) {
    return <div>User not found</div>;
  }

  // Function to get hobby class for styling
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
    
    return hobbyColors[hobbyType.toLowerCase()] || 'bg-primary-100 text-primary-800';
  };
  
  // Function to get badge class based on place type
  const getPlaceTypeClass = (placeType: string) => {
    switch (placeType) {
      case 'event':
        return 'bg-purple-500 text-white';
      case 'rent':
        return 'bg-blue-500 text-white';
      case 'sell':
        return 'bg-red-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };
  
  // Function to get label based on place type
  const getPlaceTypeLabel = (placeType: string) => {
    switch (placeType) {
      case 'event':
        return 'Event Venue';
      case 'rent':
        return 'For Rent';
      case 'sell':
        return 'For Sale';
      default:
        return 'Favorite Place';
    }
  };
  
  // Convert events to the format expected by MapView
  const mapEvents = user.events.map(event => ({
    ...event,
    attendees: event.attendees || []
  }));
  
  // Convert places to the format expected by MapView
  const mapPlaces = user.places.map(place => ({
    id: place.id,
    name: place.name,
    description: place.description,
    type: place.type,
    hobbyType: place.hobbyType,
    location: place.location,
    createdBy: {
      id: user.id,
      username: user.username
    },
    images: place.images || []
  }));

  const handleItemClick = (id: string, type: 'event' | 'place') => {
    if (type === 'event') {
      setSelectedEvent(id);
      setSelectedPlace(null);
    } else {
      setSelectedPlace(id);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Cover Photo */}
      <div 
        className="h-64 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${user.coverImage})` }}
      >
        <div className="h-full w-full bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      {/* Profile Header */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 mb-6">
          {/* Profile Picture */}
          <div className="absolute left-0 top-0">
            <img 
              src={user.profileImage} 
              alt={user.username}
              className="h-40 w-40 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
          
          {/* Profile Actions */}
          <div className="flex justify-end items-center h-20">
            <Button variant="outline" className="mr-3">
              <MessageCircle className="h-4 w-4 mr-2" /> Message
            </Button>
            <Button>
              Connect
            </Button>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="pt-24 md:flex md:space-x-8">
          {/* Left Column - User Info */}
          <div className="md:w-1/3 mb-8">
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location}</span>
              <span className="mx-2">&bull;</span>
              <span>Joined {user.joinDate}</span>
            </div>
            
            <p className="text-gray-700 mb-6">{user.bio}</p>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {user.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getHobbyClass(hobby.type)}`}
                  >
                    {hobby.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Tabs Content */}
          <div className="md:w-2/3">
            <Tabs defaultValue="events">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="events" className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" /> Events
                </TabsTrigger>
                <TabsTrigger value="places" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" /> Places
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center">
                  <Image className="h-4 w-4 mr-2" /> Gallery
                </TabsTrigger>
              </TabsList>
              
              {/* Events Tab */}
              <TabsContent value="events">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-xl">Events</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Create Event
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {user.events.map(event => (
                    <div key={event.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHobbyClass(event.hobbyType)}`}>
                          {event.hobbyType}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-700 mt-2 mb-3">{event.description}</p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                        <span>{event.location.address || 'Check location on map'}</span>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex -space-x-3">
                          {event.attendees.slice(0, 4).map(attendee => (
                            <HoverCard key={attendee.id}>
                              <HoverCardTrigger>
                                <Avatar className="h-8 w-8 border-2 border-white">
                                  {attendee.profileImage ? (
                                    <AvatarImage src={attendee.profileImage} />
                                  ) : null}
                                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                    {attendee.username.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-60">
                                <div className="flex justify-between space-x-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={attendee.profileImage} />
                                    <AvatarFallback>{attendee.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{attendee.username}</h4>
                                    {/* Modified: Only render hobbies if they exist */}
                                    {attendee.hobbies && attendee.hobbies.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {attendee.hobbies.map((hobby, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-xs">{hobby}</Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                          
                          {event.attendees.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-medium">
                              +{event.attendees.length - 4}
                            </div>
                          )}
                        </div>
                        
                        <Link to={`/event/${event.id}`}>
                          <Button size="sm" variant="outline">View Event</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Places Tab */}
              <TabsContent value="places">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-xl">Favorite Places</h3>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={mapView ? "default" : "outline"} 
                      onClick={() => setMapView(true)}
                      className="flex items-center"
                    >
                      <Map className="h-4 w-4 mr-2" /> Map
                    </Button>
                    <Button 
                      size="sm" 
                      variant={!mapView ? "default" : "outline"}
                      onClick={() => setMapView(false)}
                      className="flex items-center"
                    >
                      <Building className="h-4 w-4 mr-2" /> Cards
                    </Button>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Add Place
                    </Button>
                  </div>
                </div>
                
                {mapView ? (
                  <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <MapView
                      events={mapEvents}
                      places={mapPlaces}
                      onMarkerClick={handleItemClick}
                      selectedEvent={selectedEvent}
                      selectedPlace={selectedPlace}
                      showInfoOnHover={true}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.places.map(place => (
                      <div key={place.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          {place.images && place.images[0] && (
                            <div 
                              className="h-48 md:h-auto md:w-1/3 bg-cover bg-center" 
                              style={{ backgroundImage: `url(${place.images[0]})` }}
                            />
                          )}
                          <div className="p-4 md:w-2/3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{place.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{place.location.address}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlaceTypeClass(place.type)}`}>
                                  {getPlaceTypeLabel(place.type)}
                                </span>
                                {place.hobbyType && (
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHobbyClass(place.hobbyType)}`}>
                                    {place.hobbyType}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-700 mt-2 mb-3">{place.description}</p>
                            
                            {(place.type === 'rent' || place.type === 'sell') && place.price && (
                              <p className="text-sm font-semibold text-primary-600 mb-3">{place.price}</p>
                            )}
                            
                            {place.hasActiveEvents && place.activeEvent && (
                              <div className="mb-3 p-2 bg-purple-100 rounded-md">
                                <p className="text-xs font-semibold text-purple-700">Active Event</p>
                                <p className="text-sm">{place.activeEvent.title}</p>
                                <p className="text-xs text-gray-600">{place.activeEvent.date} at {place.activeEvent.time}</p>
                              </div>
                            )}
                            
                            <div className="mt-4 flex justify-between items-center">
                              <Button size="sm" variant="outline" onClick={() => handleItemClick(place.id, 'place')}>
                                View on Map
                              </Button>
                              
                              {place.type === 'event' && (
                                <Button size="sm">
                                  <Plus className="h-4 w-4 mr-1" /> Create Event Here
                                </Button>
                              )}
                              
                              {place.type === 'rent' && (
                                <Button size="sm">
                                  Book Now
                                </Button>
                              )}
                              
                              {place.type === 'sell' && (
                                <Button size="sm">
                                  Contact Seller
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Gallery Tab */}
              <TabsContent value="gallery">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-xl">Photo Gallery</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Photos
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.gallery.map(photo => (
                    <div key={photo.id} className="group relative rounded-lg overflow-hidden">
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <span className="text-white font-medium">{photo.caption}</span>
                        <span className={`text-xs mt-1 px-2 py-0.5 rounded-full self-start ${getHobbyClass(photo.type)}`}>
                          {photo.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
