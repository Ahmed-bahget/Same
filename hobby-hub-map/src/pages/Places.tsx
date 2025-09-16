
import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Building, Home, Search, Utensils, Store } from 'lucide-react';
import Navbar from '@/UI/Navbar';
import MapView from '@/components/Map/MapView';
import { useMap } from '@/hooks/useMap';
import PlaceCard from '@/components/Places/PlaceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PlaceCategoryType, PlaceTypeFilter, PlaceProps } from '@/types/place';
import PlaceFilters from '@/components/Places/PlaceFilters';
import AddPlaceDialog from '@/components/Places/AddPlaceDialog';
import { placeService } from '@/services/placeService';

const Places: React.FC = () => {
  const { toast } = useToast();
  const { userLocation, getUserLocation } = useMap();
  const [places, setPlaces] = useState<PlaceProps[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<{
    types: PlaceTypeFilter[];
    categories: PlaceCategoryType[];
  }>({
    types: ['rent', 'sell', 'event', 'regular'],
    categories: ['flat', 'restaurant', 'shop', 'venue']
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    // Fetch places from backend
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await placeService.getAllPlaces();
        console.log('Places response:', response);
        if (response.success && response.data) {
          setPlaces(Array.isArray(response.data) ? response.data : []);
        } else {
          setError(response.message || 'Failed to fetch places');
          setPlaces([]);
        }
      } catch (err: any) {
        console.error('Places fetch error:', err);
        setError(err.message || 'Failed to fetch places');
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    // Filter places based on search term and filters
    const filtered = Array.isArray(places) ? places.filter(place => {
      // Check if place matches search term
      const matchesSearch =
        !searchTerm ||
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (place.location.address && place.location.address.toLowerCase().includes(searchTerm.toLowerCase()));
      // Check if place type is in filters
      const matchesType = filters.types.includes(place.type);
      // Check if place category is in filters
      const matchesCategory = filters.categories.includes(place.category);
      return matchesSearch && matchesType && matchesCategory;
    }) : [];
    setFilteredPlaces(filtered);
  }, [searchTerm, places, filters]);

  const handlePlaceClick = (id: string, type: 'event' | 'place') => {
    if (type === 'place') {
      setSelectedPlace(id);
      // In a real app, you could redirect to a place detail page here
      // navigate(`/place/${id}`);
    }
  };

  const handleViewClick = (id: string) => {
    setSelectedPlace(id);
    setViewMode('map');
  };

  const handleAddPlace = (newPlace: PlaceProps) => {
    const updatedPlaces = [...places, {...newPlace, id: `place-${places.length + 1}`}];
    setPlaces(updatedPlaces);
    toast({
      title: "Place added successfully",
      description: `Your place "${newPlace.name}" has been added.`,
    });
    setIsAddPlaceOpen(false);
  };

  const handleFilterChange = (type: 'types' | 'categories', value: PlaceTypeFilter | PlaceCategoryType) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[type];
      let updatedValues;
      
      if (type === 'types') {
        updatedValues = currentValues.includes(value as PlaceTypeFilter)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value as PlaceTypeFilter];
          
        return {
          ...prevFilters,
          types: updatedValues.length ? updatedValues : ['rent', 'sell', 'event', 'regular']
        };
      } else {
        updatedValues = currentValues.includes(value as PlaceCategoryType)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value as PlaceCategoryType];
          
        return {
          ...prevFilters,
          categories: updatedValues.length ? updatedValues : ['flat', 'restaurant', 'shop', 'venue']
        };
      }
    });
  };

  const handleContactSellerClick = (id: string) => {
    toast({
      title: "Contact request sent",
      description: "The seller will be notified of your interest.",
    });
  };

  const handleBookClick = (id: string) => {
    toast({
      title: "Booking initiated",
      description: "You will be redirected to complete your booking.",
    });
  };
  
  const handleCreateEventClick = (id: string) => {
    toast({
      title: "Create event",
      description: "You will be redirected to create an event at this venue.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold mb-2">Explore Places</h1>
          <p className="text-gray-600">Discover places to rent, buy, or visit in your area</p>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-gray-500 text-lg">Loading places...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-red-500 text-lg">{error}</span>
          </div>
        ) : (
          <>
            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    className="pl-10"
                    placeholder="Search by name, description or location"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'map' ? "default" : "outline"}
                    onClick={() => setViewMode('map')}
                  >
                    <MapPin className="mr-1 h-4 w-4" />
                    Map
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? "default" : "outline"}
                    onClick={() => setViewMode('list')}
                  >
                    <Building className="mr-1 h-4 w-4" />
                    List
                  </Button>
                  <Button onClick={() => setIsAddPlaceOpen(true)}>
                    Add Place
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              <PlaceFilters 
                filters={filters} 
                toggleFilter={handleFilterChange} 
              />
            </div>

            {/* View Content */}
            <div className="relative">
              {viewMode === 'map' ? (
                <div className="h-[calc(100vh-300px)] min-h-[400px] rounded-lg overflow-hidden">
                  <MapView
                    places={filteredPlaces}
                    onMarkerClick={handlePlaceClick}
                    selectedPlace={selectedPlace}
                    showInfoOnHover={true}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlaces.length > 0 ? filteredPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onViewClick={handleViewClick}
                      onBookClick={place.type === 'rent' ? handleBookClick : undefined}
                      onCreateEventClick={place.type === 'event' ? handleCreateEventClick : undefined}
                      onContactSellerClick={place.type === 'sell' ? handleContactSellerClick : undefined}
                    />
                  )) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-sm">
                      <MapPin className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No places found</h3>
                      <p className="text-gray-500 text-center">
                        Try adjusting your filters or search term, or add a new place.
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setIsAddPlaceOpen(true)}
                      >
                        Add Place
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <AddPlaceDialog
        open={isAddPlaceOpen}
        onClose={() => setIsAddPlaceOpen(false)}
        onAddPlace={handleAddPlace}
        userLocation={userLocation}
      />
    </div>
  );
};

export default Places;
