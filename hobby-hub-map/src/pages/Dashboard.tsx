
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMap } from '@/hooks/useMap';
import Navbar from '@/UI/Navbar';
import MapView from '@/components/Map/MapView';
import EventCard from '@/components/Events/EventCard';
import UserCard from '@/components/Users/UserCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  Calendar,
  Filter,
  Search,
  Users,
  CalendarDays,
  MapPin,
  Plus,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CreateEventModal from '@/components/Events/CreateEventModal';
import { eventService } from '@/services/eventService';
import { authService, User } from '@/services/authService';

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

// Dashboard component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userLocation, getUserLocation } = useMap();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('events');
  const [selectedHobby, setSelectedHobby] = useState('All Hobbies');
  const [selectedDate, setSelectedDate] = useState('Any date');
  const [distanceRange, setDistanceRange] = useState([10]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
    // Get user location if authenticated
    if (isAuthenticated) {
      getUserLocation();
    }
  }, [isAuthenticated, navigate, getUserLocation]);

  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setErrorEvents(null);
      try {
        const response = await eventService.getUpcomingEvents();
        console.log('Events response:', response);
        if (response.success && response.data) {
          setAllEvents(Array.isArray(response.data) ? response.data : []);
        } else {
          setErrorEvents(response.message || 'Failed to fetch events');
          setAllEvents([]);
        }
      } catch (err: any) {
        console.error('Events fetch error:', err);
        setErrorEvents(err.message || 'Failed to fetch events');
        setAllEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    // Fetch users from backend
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const response = await authService.searchUsers({});
        console.log('Users response:', response);
        if (response.success && response.data) {
          setAllUsers(Array.isArray(response.data) ? response.data : []);
        } else {
          setErrorUsers(response.message || 'Failed to fetch users');
          setAllUsers([]);
        }
      } catch (err: any) {
        console.error('Users fetch error:', err);
        setErrorUsers(err.message || 'Failed to fetch users');
        setAllUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter events based on selected filters
  useEffect(() => {
    let filtered = Array.isArray(allEvents) ? allEvents : [];
    if (selectedHobby !== 'All Hobbies') {
      filtered = filtered.filter(event => event.hobbyName === selectedHobby || event.hobbyType === selectedHobby);
    }
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Additional date filtering would be done here
    setFilteredEvents(filtered);
  }, [selectedHobby, searchQuery, selectedDate, allEvents]);

  // Filter users based on selected filters
  useEffect(() => {
    let filtered = Array.isArray(allUsers) ? allUsers : [];
    if (selectedHobby !== 'All Hobbies') {
      filtered = filtered.filter(user =>
        user.hobbies && user.hobbies.some(hobby => hobby.hobbyName === selectedHobby || hobby.type === selectedHobby)
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Distance filtering would be done here using distanceRange
    setFilteredUsers(filtered);
  }, [selectedHobby, searchQuery, distanceRange, allUsers]);

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(eventId);
    // In a real app, you might center the map on this event
  };

  const handleJoinEvent = (eventId: string) => {
    toast({
      title: "Event Joined!",
      description: "You have successfully joined this event.",
    });
    // In a real app, you would update the backend/state here
  };

  const handleConnectUser = (userId: string) => {
    toast({
      title: "Connection Request Sent",
      description: "A connection request has been sent to this user.",
    });
    // In a real app, you would update the backend/state here
  };

  const handleCreateEvent = () => {
    setShowModal(true);
    // navigate('/event/create');
    // In a real app, this would navigate to an event creation page
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        <div className="w-full max-w-sm border-r bg-white p-4 hidden md:block">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" className="text-gray-500">
                Reset
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events or users..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hobby</label>
              <Select value={selectedHobby} onValueChange={setSelectedHobby}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hobby" />
                </SelectTrigger>
                <SelectContent>
                  {HOBBY_OPTIONS.map((hobby) => (
                    <SelectItem key={hobby} value={hobby}>
                      {hobby}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
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
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Distance</label>
                <span className="text-sm text-gray-500">{distanceRange[0]} km</span>
              </div>
              <Slider
                defaultValue={[10]}
                max={50}
                step={1}
                value={distanceRange}
                onValueChange={setDistanceRange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 km</span>
                <span>50 km</span>
              </div>
            </div>
            {/* <Button onClick={handleCreateEvent}>Create Event</Button> */}
            {showModal && (
              <CreateEventModal
                onEventCreate={(data) => {
                  console.log('Created Event:', data);
                  setShowModal(false); // close modal
                }}
                trigger={<Button onClick={handleCreateEvent}>Create Event</Button>}
              />
            )}
            {/* <Button className="w-full" onClick={handleCreateEvent}>
              <Plus className="h-4 w-4 mr-2" /> Create New Event
            </Button> */}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 flex flex-col">
          {/* Map View */}
          <div className="flex-1">
            {loadingEvents ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-gray-500 text-lg">Loading events...</span>
              </div>
            ) : errorEvents ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-red-500 text-lg">{errorEvents}</span>
              </div>
            ) : (
              <MapView
                events={filteredEvents}
                onMarkerClick={handleEventClick}
                selectedEvent={selectedEvent}
                center={userLocation || undefined}
              />
            )}
          </div>

          {/* Bottom Panel */}
          <div className="bg-white border-t p-4 max-h-[40vh] overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="events" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" /> Events
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" /> People
                  </TabsTrigger>
                </TabsList>

                <div className="md:hidden">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" /> Filters
                  </Button>
                </div>
              </div>

              <TabsContent value="events" className="m-0 pt-2">
                {loadingEvents ? (
                  <div className="text-center py-8">
                    <span className="text-gray-500 text-lg">Loading events...</span>
                  </div>
                ) : errorEvents ? (
                  <div className="text-center py-8">
                    <span className="text-red-500 text-lg">{errorEvents}</span>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="font-semibold text-lg mb-1">No events found</h3>
                    <p className="text-gray-500">Try adjusting your filters or create your own event!</p>
                    <Button className="mt-4" onClick={handleCreateEvent}>
                      <Plus className="h-4 w-4 mr-2" /> Create Event
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.eventId || event.id}
                        {...event}
                        isCompact
                        onJoinClick={handleJoinEvent}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="people" className="m-0 pt-2">
                {loadingUsers ? (
                  <div className="text-center py-8">
                    <span className="text-gray-500 text-lg">Loading people...</span>
                  </div>
                ) : errorUsers ? (
                  <div className="text-center py-8">
                    <span className="text-red-500 text-lg">{errorUsers}</span>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="font-semibold text-lg mb-1">No people found</h3>
                    <p className="text-gray-500">Try adjusting your filters to find people with matching hobbies.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        {...user}
                        onConnectClick={handleConnectUser}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
