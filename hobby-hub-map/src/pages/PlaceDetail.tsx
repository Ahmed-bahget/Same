import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, MessageCircle, Phone, Mail, ArrowLeft, 
  Utensils, Building, Home, User, Map, ShoppingCart 
} from 'lucide-react';
import Navbar from '@/UI/Navbar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MapView from '@/components/Map/MapView';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HobbyIcon from '@/components/Events/HobbyIcon';
import { PlaceProps, PlaceCategoryType, PlaceTypeFilter, Product } from '@/types/place';
import PlaceCategoryIcon from '@/components/Places/PlaceCategoryIcon';
import ProductCard from '@/components/Places/ProductCard';
import { useChat } from '@/context/ChatContext';
import PlaceProviders from '@/components/Places/PlaceDetails/PlaceProviders';

// Mock data for place details - in a real app, this would come from an API
const MOCK_PLACE: PlaceProps = {
  id: 'place-1',
  name: 'Luxury Downtown Apartment',  
  description: 'Beautiful 2-bedroom apartment with amazing city views and modern amenities. This newly renovated apartment features hardwood floors, stainless steel appliances, and a spacious balcony with stunning city views. Located in the heart of downtown, it\'s just steps away from restaurants, shops, and public transportation.',
  type: 'rent',
  category: 'flat',
  hobbyType: 'Social',
  location: { 
    lat: 51.505, 
    lng: -0.09, 
    address: '123 Main Street, London' 
  },
  createdBy: {
    id: 'user-1',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/150?img=1'
  },
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  ],
  price: '£1,500/month'
};

const MOCK_RESTAURANT: PlaceProps = {
  id: 'place-3',
  name: 'The Green Garden Restaurant',
  description: 'Farm-to-table restaurant specializing in organic, seasonal cuisine.',
  type: 'regular',
  category: 'restaurant',
  hobbyType: 'Cooking',
  location: { 
    lat: 51.515, 
    lng: -0.08, 
    address: '789 Food Street, London' 
  },
  createdBy: {
    id: 'place-3',
    username: 'Michael Brown',
    profileImage: 'https://i.pravatar.cc/150?img=3'
  },
  images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
  products: [
    {
      id: 'product-1',
      name: 'Garden Salad',
      description: 'Fresh mixed greens with seasonal vegetables and house dressing',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      available: true,
      placeId: 'place-3'
    },
    {
      id: 'product-2',
      name: 'Pasta Primavera',
      description: 'Fresh pasta with seasonal vegetables in a light cream sauce',
      price: 14.50,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
      available: true,
      placeId: 'place-3'
    },
    {
      id: 'product-3',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
      available: true,
      placeId: 'place-3'
    },
    {
      id: 'product-4',
      name: 'Fresh Juice',
      description: 'Freshly squeezed seasonal fruits',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f9f4',
      available: false,
      placeId: 'place-3'
    }
  ]
};

const MOCK_SHOP: PlaceProps = {
  id: 'place-5',
  name: 'Artisan Coffee Shop',
  description: 'Specialty coffee shop with homemade pastries and cozy workspace.',
  type: 'regular',
  category: 'shop',
  hobbyType: 'Social',
  location: { 
    lat: 51.525, 
    lng: -0.085, 
    address: '222 Coffee Road, London' 
  },
  createdBy: {
    id: 'place-5',
    username: 'Jane Smith',
    profileImage: 'https://i.pravatar.cc/150?img=2'
  },
  images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb'],
  products: [
    {
      id: 'product-5',
      name: 'Espresso',
      description: 'Single shot of our signature espresso blend',
      price: 2.50,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
      available: true,
      placeId: 'place-5'
    },
    {
      id: 'product-6',
      name: 'Croissant',
      description: 'Freshly baked butter croissant',
      price: 3.25,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
      available: true,
      placeId: 'place-5'
    },
    {
      id: 'product-7',
      name: 'Latte',
      description: 'Double shot of espresso with steamed milk',
      price: 4.25,
      image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f',
      available: true,
      placeId: 'place-5'
    }
  ]
};

const getPlaceTypeInfo = (type: PlaceTypeFilter) => {
  switch (type) {
    case 'rent':
      return { label: 'For Rent', color: 'bg-blue-500 text-white' };
    case 'sell':
      return { label: 'For Sale', color: 'bg-red-500 text-white' };
    case 'event':
      return { label: 'Event Venue', color: 'bg-purple-500 text-white' };
    default:
      return { label: 'Regular Place', color: 'bg-green-500 text-white' };
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

const PlaceDetail: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const { toast } = useToast();
  const { sendMessage } = useChat();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [messageText, setMessageText] = useState('');
  
  // In a real app, fetch place data based on placeId
  let place: PlaceProps;
  
  // Choose the right mock data based on the placeId
  switch(placeId) {
    case 'place-3':
      place = MOCK_RESTAURANT;
      break;
    case 'place-5':
      place = MOCK_SHOP;
      break;
    default:
      place = MOCK_PLACE;
  }

  // In a real app, check place exists
  if (!place) {
    return <div>Place not found</div>;
  }

  const typeInfo = getPlaceTypeInfo(place.type);
  const hasProducts = place.category === 'restaurant' || place.category === 'shop';
  
  const handleContactOwner = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to the place owner
      sendMessage(messageText, place.createdBy.id);
      setMessageText('');
    } else {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
    }
  };
  
  const handleBookPlace = () => {
    toast({
      title: "Booking initiated",
      description: "You will be redirected to complete your booking.",
    });
  };

  const handleCreateEvent = () => {
    toast({
      title: "Create event",
      description: "You will be redirected to create an event at this venue.",
    });
  };

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link to="/places" className="inline-flex items-center text-primary-600 hover:text-primary-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Places
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-80">
                  {place.images && place.images.length > 0 ? (
                    <>
                      <img
                        src={place.images[currentImageIndex]}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      {place.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {place.images.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2.5 h-2.5 rounded-full ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <PlaceCategoryIcon category={place.category} className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {place.images && place.images.length > 1 && (
                  <div className="p-2 overflow-x-auto flex space-x-2">
                    {place.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`h-16 w-24 flex-shrink-0 cursor-pointer ${
                          currentImageIndex === index ? 'ring-2 ring-primary-500' : ''
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={image} alt={`Thumbnail ${index}`} className="h-full w-full object-cover rounded" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Place Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{place.name}</h1>
                    <div className="flex items-center mt-1 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{place.location.address}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                    <Badge className="bg-gray-200 text-gray-800 flex items-center">
                      <PlaceCategoryIcon category={place.category} className="h-3.5 w-3.5 mr-1" />
                      {place.category === 'flat' ? 'Apartment' : 
                      place.category === 'restaurant' ? 'Restaurant' :
                      place.category === 'shop' ? 'Shop' : 'Venue'}
                    </Badge>
                    {place.hobbyType && (
                      <Badge className={getHobbyClass(place.hobbyType)}>
                        {place.hobbyType}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {place.price && (
                  <div className="text-xl font-bold text-primary-600 mb-4">
                    {place.price}
                  </div>
                )}
                
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    {hasProducts && (
                      <TabsTrigger value="products">
                        {place.category === 'restaurant' ? 'Menu' : 'Products'}
                      </TabsTrigger>
                    )}
                    {place.type === 'event' && (
                      <TabsTrigger value="events">Events</TabsTrigger>
                    )}
                    <TabsTrigger value="providers">
                      {place.category === 'flat' || place.category === 'venue' ? 'Brokers' : 
                      place.category === 'restaurant' || place.category === 'shop' ? 'Deliverers' : 'Services'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-700 whitespace-pre-line">{place.description}</p>
                    </div>
                    
                    {place.category === 'flat' && (
                      <div>
                        <h3 className="font-semibold mb-2">Apartment Features</h3>
                        <ul className="grid grid-cols-2 gap-2">
                          <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
                            2 Bedrooms
                          </li>
                          <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
                            1 Bathroom
                          </li>
                          <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
                            750 sq ft
                          </li>
                          <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
                            Balcony
                          </li>
                          <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
                            Fully furnished
                          </li>
                          <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
                            Pet friendly
                          </li>
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="location">
                    <div className="h-64 rounded-lg overflow-hidden">
                      <MapView 
                        places={[place]} 
                        center={place.location} 
                        zoom={15} 
                        selectedPlace={place.id}
                      />
                    </div>
                  </TabsContent>
                  
                  {hasProducts && (
                    <TabsContent value="products">
                      {place.products && place.products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {place.products.map(product => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <h3 className="text-lg font-medium text-gray-700">No products available</h3>
                          <p className="text-gray-500">Check back later for available items.</p>
                        </div>
                      )}
                    </TabsContent>
                  )}
                  
                  {place.type === 'event' && (
                    <TabsContent value="events">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Upcoming Events</h3>
                        {place.activeEvent ? (
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium text-lg">{place.activeEvent.title}</h4>
                              <div className="flex items-center text-gray-600 mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{place.activeEvent.date} {place.activeEvent.time && `at ${place.activeEvent.time}`}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <p>No upcoming events. Why not create one?</p>
                        )}
                        <Button onClick={handleCreateEvent}>
                          Create Event Here
                        </Button>
                      </div>
                    </TabsContent>
                  )}
                  
                  <TabsContent value="providers">
                    <PlaceProviders place={place} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Right Column - Contact Info and Actions */}
            <div className="space-y-6">
              {/* Owner Info Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Contact {place.type === 'sell' || place.type === 'rent' ? 'Owner' : 'Manager'}</h3>
                  
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      {place.createdBy.profileImage ? (
                        <AvatarImage src={place.createdBy.profileImage} alt={place.createdBy.username} />
                      ) : null}
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{place.createdBy.username}</div>
                      <div className="text-sm text-gray-500">
                        Member since 2022
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>+44 123 456 7890</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>contact@example.com</span>
                    </div>
                  </div>
                  
                  {/* Direct Message Form */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleContactOwner}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Action Buttons */}
              {place.type === 'rent' && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Interested?</h3>
                    <Button className="w-full mb-2" onClick={handleBookPlace}>
                      Book Viewing
                    </Button>
                    <Button variant="outline" className="w-full">
                      Save to Favorites
                    </Button>
                    <div className="mt-4 text-center">
                      <Link to="/brokers" className="text-primary-600 hover:underline text-sm">
                        Find a broker to help with your rental
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {place.type === 'sell' && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Interested?</h3>
                    <Button className="w-full mb-2" onClick={handleBookPlace}>
                      Schedule Viewing
                    </Button>
                    <Button variant="outline" className="w-full">
                      Save to Favorites
                    </Button>
                    <div className="mt-4 text-center">
                      <Link to="/brokers" className="text-primary-600 hover:underline text-sm">
                        Find a broker to help with your purchase
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {place.category === 'restaurant' && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Make a Reservation</h3>
                    <Button className="w-full mb-2" onClick={handleBookPlace}>
                      Reserve a Table
                    </Button>
                    <Link to="/cart">
                      <Button variant="outline" className="w-full mb-2">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Cart
                      </Button>
                    </Link>
                    <div className="mt-4 text-center">
                      <Link to="/deliverers" className="text-primary-600 hover:underline text-sm">
                        Find a deliverer to get this food delivered
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {place.category === 'shop' && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Shopping</h3>
                    <Link to="/cart">
                      <Button className="w-full mb-2">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Cart
                      </Button>
                    </Link>
                    <div className="mt-4 text-center">
                      <Link to="/deliverers" className="text-primary-600 hover:underline text-sm">
                        Find a deliverer to get these items delivered
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {place.type === 'event' && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Venue Booking</h3>
                    <Button className="w-full mb-2" onClick={handleCreateEvent}>
                      Create Event Here
                    </Button>
                    <Button variant="outline" className="w-full">
                      Check Availability
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* Map Preview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Location</h3>
                    <Link to={`/places?lat=${place.location.lat}&lng=${place.location.lng}`} className="text-primary-600 text-sm hover:underline flex items-center">
                      <Map className="h-3.5 w-3.5 mr-1" />
                      View on map
                    </Link>
                  </div>
                  <div className="h-40 rounded-md overflow-hidden">
                    <MapView 
                      places={[place]} 
                      center={place.location} 
                      zoom={14} 
                      selectedPlace={place.id}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{place.location.address}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default PlaceDetail;




// import React, { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { 
//   MapPin, Calendar, MessageCircle, Phone, Mail, ArrowLeft, 
//   Utensils, Building, Home, User, Map, ShoppingCart 
// } from 'lucide-react';
// import Navbar from '@/UI/Navbar';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import MapView from '@/components/Map/MapView';
// import { useToast } from '@/hooks/use-toast';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import HobbyIcon from '@/components/Events/HobbyIcon';
// import { PlaceProps, PlaceCategoryType, PlaceTypeFilter, Product } from '@/types/place';
// import PlaceCategoryIcon from '@/components/Places/PlaceCategoryIcon';
// import ProductCard from '@/components/Places/ProductCard';
// import { useChat } from '@/context/ChatContext';

// // Mock data for place details - in a real app, this would come from an API
// const MOCK_PLACE: PlaceProps = {
//   id: 'place-1',
//   name: 'Luxury Downtown Apartment',
//   description: 'Beautiful 2-bedroom apartment with amazing city views and modern amenities. This newly renovated apartment features hardwood floors, stainless steel appliances, and a spacious balcony with stunning city views. Located in the heart of downtown, it\'s just steps away from restaurants, shops, and public transportation.',
//   type: 'rent',
//   category: 'flat',
//   hobbyType: 'Social',
//   location: { 
//     lat: 51.505, 
//     lng: -0.09, 
//     address: '123 Main Street, London' 
//   },
//   createdBy: {
//     id: 'user-1',
//     username: 'John Doe',
//     profileImage: 'https://i.pravatar.cc/150?img=1'
//   },
//   images: [
//     'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
//     'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
//     'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
//   ],
//   price: '£1,500/month'
// };

// const MOCK_RESTAURANT: PlaceProps = {
//   id: 'place-3',
//   name: 'The Green Garden Restaurant',
//   description: 'Farm-to-table restaurant specializing in organic, seasonal cuisine.',
//   type: 'regular',
//   category: 'restaurant',
//   hobbyType: 'Cooking',
//   location: { 
//     lat: 51.515, 
//     lng: -0.08, 
//     address: '789 Food Street, London' 
//   },
//   createdBy: {
//     id: 'place-3',
//     username: 'Michael Brown',
//     profileImage: 'https://i.pravatar.cc/150?img=3'
//   },
//   images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
//   products: [
//     {
//       id: 'product-1',
//       name: 'Garden Salad',
//       description: 'Fresh mixed greens with seasonal vegetables and house dressing',
//       price: 8.99,
//       image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
//       available: true,
//       placeId: 'place-3'
//     },
//     {
//       id: 'product-2',
//       name: 'Pasta Primavera',
//       description: 'Fresh pasta with seasonal vegetables in a light cream sauce',
//       price: 14.50,
//       image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
//       available: true,
//       placeId: 'place-3'
//     },
//     {
//       id: 'product-3',
//       name: 'Chocolate Lava Cake',
//       description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
//       price: 7.99,
//       image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
//       available: true,
//       placeId: 'place-3'
//     },
//     {
//       id: 'product-4',
//       name: 'Fresh Juice',
//       description: 'Freshly squeezed seasonal fruits',
//       price: 4.50,
//       image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f9f4',
//       available: false,
//       placeId: 'place-3'
//     }
//   ]
// };

// const MOCK_SHOP: PlaceProps = {
//   id: 'place-5',
//   name: 'Artisan Coffee Shop',
//   description: 'Specialty coffee shop with homemade pastries and cozy workspace.',
//   type: 'regular',
//   category: 'shop',
//   hobbyType: 'Social',
//   location: { 
//     lat: 51.525, 
//     lng: -0.085, 
//     address: '222 Coffee Road, London' 
//   },
//   createdBy: {
//     id: 'place-5',
//     username: 'Jane Smith',
//     profileImage: 'https://i.pravatar.cc/150?img=2'
//   },
//   images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb'],
//   products: [
//     {
//       id: 'product-5',
//       name: 'Espresso',
//       description: 'Single shot of our signature espresso blend',
//       price: 2.50,
//       image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
//       available: true,
//       placeId: 'place-5'
//     },
//     {
//       id: 'product-6',
//       name: 'Croissant',
//       description: 'Freshly baked butter croissant',
//       price: 3.25,
//       image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
//       available: true,
//       placeId: 'place-5'
//     },
//     {
//       id: 'product-7',
//       name: 'Latte',
//       description: 'Double shot of espresso with steamed milk',
//       price: 4.25,
//       image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f',
//       available: true,
//       placeId: 'place-5'
//     }
//   ]
// };

// const getPlaceTypeInfo = (type: PlaceTypeFilter) => {
//   switch (type) {
//     case 'rent':
//       return { label: 'For Rent', color: 'bg-blue-500 text-white' };
//     case 'sell':
//       return { label: 'For Sale', color: 'bg-red-500 text-white' };
//     case 'event':
//       return { label: 'Event Venue', color: 'bg-purple-500 text-white' };
//     default:
//       return { label: 'Regular Place', color: 'bg-green-500 text-white' };
//   }
// };

// const getHobbyClass = (hobbyType: string) => {
//   const hobbyColors: Record<string, string> = {
//     'sports': 'bg-hobby-sports/20 text-hobby-sports',
//     'arts': 'bg-hobby-arts/20 text-hobby-arts',
//     'music': 'bg-hobby-music/20 text-hobby-music',
//     'cooking': 'bg-hobby-cooking/20 text-hobby-cooking',
//     'gaming': 'bg-hobby-gaming/20 text-hobby-gaming',
//     'tech': 'bg-hobby-tech/20 text-hobby-tech',
//     'outdoor': 'bg-hobby-outdoor/20 text-hobby-outdoor',
//     'social': 'bg-hobby-social/20 text-hobby-social',
//   };
  
//   return hobbyColors[hobbyType?.toLowerCase()] || 'bg-primary-100 text-primary-800';
// };

// const PlaceDetail: React.FC = () => {
//   const { placeId } = useParams<{ placeId: string }>();
//   const { toast } = useToast();
//   const { sendMessage } = useChat();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [messageText, setMessageText] = useState('');
  
//   // In a real app, fetch place data based on placeId
//   let place: PlaceProps;
  
//   // Choose the right mock data based on the placeId
//   switch(placeId) {
//     case 'place-3':
//       place = MOCK_RESTAURANT;
//       break;
//     case 'place-5':
//       place = MOCK_SHOP;
//       break;
//     default:
//       place = MOCK_PLACE;
//   }

//   // In a real app, check place exists
//   if (!place) {
//     return <div>Place not found</div>;
//   }

//   const typeInfo = getPlaceTypeInfo(place.type);
//   const hasProducts = place.category === 'restaurant' || place.category === 'shop';
  
//   const handleContactOwner = () => {
//     if (messageText.trim()) {
//       // In a real app, this would send the message to the place owner
//       sendMessage(messageText, place.createdBy.id);
//       setMessageText('');
//     } else {
//       toast({
//         title: "Empty message",
//         description: "Please enter a message before sending.",
//         variant: "destructive"
//       });
//     }
//   };
  
//   const handleBookPlace = () => {
//     toast({
//       title: "Booking initiated",
//       description: "You will be redirected to complete your booking.",
//     });
//   };

//   const handleCreateEvent = () => {
//     toast({
//       title: "Create event",
//       description: "You will be redirected to create an event at this venue.",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="container mx-auto px-4 py-6">
//         <div className="mb-6">
//           <Link to="/places" className="inline-flex items-center text-primary-600 hover:text-primary-800">
//             <ArrowLeft className="h-4 w-4 mr-1" />
//             Back to Places
//           </Link>
//         </div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Images and Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Image Gallery */}
//             <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//               <div className="relative h-80">
//                 {place.images && place.images.length > 0 ? (
//                   <>
//                     <img
//                       src={place.images[currentImageIndex]}
//                       alt={place.name}
//                       className="w-full h-full object-cover"
//                     />
//                     {place.images.length > 1 && (
//                       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                         {place.images.map((_, index) => (
//                           <button
//                             key={index}
//                             className={`w-2.5 h-2.5 rounded-full ${
//                               index === currentImageIndex ? 'bg-white' : 'bg-white/50'
//                             }`}
//                             onClick={() => setCurrentImageIndex(index)}
//                           />
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                     <PlaceCategoryIcon category={place.category} className="h-16 w-16 text-gray-400" />
//                   </div>
//                 )}
//               </div>
              
//               {place.images && place.images.length > 1 && (
//                 <div className="p-2 overflow-x-auto flex space-x-2">
//                   {place.images.map((image, index) => (
//                     <div 
//                       key={index}
//                       className={`h-16 w-24 flex-shrink-0 cursor-pointer ${
//                         currentImageIndex === index ? 'ring-2 ring-primary-500' : ''
//                       }`}
//                       onClick={() => setCurrentImageIndex(index)}
//                     >
//                       <img src={image} alt={`Thumbnail ${index}`} className="h-full w-full object-cover rounded" />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {/* Place Details */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <div className="flex flex-wrap justify-between items-start mb-4">
//                 <div>
//                   <h1 className="text-2xl font-bold">{place.name}</h1>
//                   <div className="flex items-center mt-1 text-gray-600">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     <span>{place.location.address}</span>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
//                   <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
//                   <Badge className="bg-gray-200 text-gray-800 flex items-center">
//                     <PlaceCategoryIcon category={place.category} className="h-3.5 w-3.5 mr-1" />
//                     {place.category === 'flat' ? 'Apartment' : 
//                      place.category === 'restaurant' ? 'Restaurant' :
//                      place.category === 'shop' ? 'Shop' : 'Venue'}
//                   </Badge>
//                   {place.hobbyType && (
//                     <Badge className={getHobbyClass(place.hobbyType)}>
//                       {place.hobbyType}
//                     </Badge>
//                   )}
//                 </div>
//               </div>
              
//               {place.price && (
//                 <div className="text-xl font-bold text-primary-600 mb-4">
//                   {place.price}
//                 </div>
//               )}
              
//               <Tabs defaultValue="details">
//                 <TabsList className="mb-4">
//                   <TabsTrigger value="details">Details</TabsTrigger>
//                   <TabsTrigger value="location">Location</TabsTrigger>
//                   {hasProducts && (
//                     <TabsTrigger value="products">
//                       {place.category === 'restaurant' ? 'Menu' : 'Products'}
//                     </TabsTrigger>
//                   )}
//                   {place.type === 'event' && (
//                     <TabsTrigger value="events">Events</TabsTrigger>
//                   )}
//                 </TabsList>
                
//                 <TabsContent value="details" className="space-y-4">
//                   <div>
//                     <h3 className="font-semibold mb-2">Description</h3>
//                     <p className="text-gray-700 whitespace-pre-line">{place.description}</p>
//                   </div>
                  
//                   {place.category === 'flat' && (
//                     <div>
//                       <h3 className="font-semibold mb-2">Apartment Features</h3>
//                       <ul className="grid grid-cols-2 gap-2">
//                         <li className="flex items-center">
//                           <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
//                           2 Bedrooms
//                         </li>
//                         <li className="flex items-center">
//                           <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
//                           1 Bathroom
//                         </li>
//                         <li className="flex items-center">
//                           <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
//                           750 sq ft
//                         </li>
//                         <li className="flex items-center">
//                           <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
//                           Balcony
//                         </li>
//                         <li className="flex items-center">
//                           <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
//                           Fully furnished
//                         </li>
//                         <li className="flex items-center">
//                           <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></span>
//                           Pet friendly
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </TabsContent>
                
//                 <TabsContent value="location">
//                   <div className="h-64 rounded-lg overflow-hidden">
//                     <MapView 
//                       places={[place]} 
//                       center={place.location} 
//                       zoom={15} 
//                       selectedPlace={place.id}
//                     />
//                   </div>
//                 </TabsContent>
                
//                 {hasProducts && (
//                   <TabsContent value="products">
//                     {place.products && place.products.length > 0 ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {place.products.map(product => (
//                           <ProductCard key={product.id} product={product} />
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8">
//                         <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
//                         <h3 className="text-lg font-medium text-gray-700">No products available</h3>
//                         <p className="text-gray-500">Check back later for available items.</p>
//                       </div>
//                     )}
//                   </TabsContent>
//                 )}
                
//                 {place.type === 'event' && (
//                   <TabsContent value="events">
//                     <div className="space-y-4">
//                       <h3 className="font-semibold">Upcoming Events</h3>
//                       {place.activeEvent ? (
//                         <Card>
//                           <CardContent className="p-4">
//                             <h4 className="font-medium text-lg">{place.activeEvent.title}</h4>
//                             <div className="flex items-center text-gray-600 mt-1">
//                               <Calendar className="h-4 w-4 mr-1" />
//                               <span>{place.activeEvent.date} {place.activeEvent.time && `at ${place.activeEvent.time}`}</span>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ) : (
//                         <p>No upcoming events. Why not create one?</p>
//                       )}
//                       <Button onClick={handleCreateEvent}>
//                         Create Event Here
//                       </Button>
//                     </div>
//                   </TabsContent>
//                 )}
//               </Tabs>
//             </div>
//           </div>
          
//           {/* Right Column - Contact Info and Actions */}
//           <div className="space-y-6">
//             {/* Owner Info Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4">Contact {place.type === 'sell' || place.type === 'rent' ? 'Owner' : 'Manager'}</h3>
                
//                 <div className="flex items-center mb-4">
//                   <Avatar className="h-10 w-10 mr-3">
//                     {place.createdBy.profileImage ? (
//                       <AvatarImage src={place.createdBy.profileImage} alt={place.createdBy.username} />
//                     ) : null}
//                     <AvatarFallback>
//                       <User className="h-5 w-5" />
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <div className="font-medium">{place.createdBy.username}</div>
//                     <div className="text-sm text-gray-500">
//                       Member since 2022
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3 mb-4">
//                   <div className="flex items-center text-gray-700">
//                     <Phone className="h-4 w-4 mr-2 text-gray-500" />
//                     <span>+44 123 456 7890</span>
//                   </div>
//                   <div className="flex items-center text-gray-700">
//                     <Mail className="h-4 w-4 mr-2 text-gray-500" />
//                     <span>contact@example.com</span>
//                   </div>
//                 </div>
                
//                 {/* Direct Message Form */}
//                 <div className="space-y-2">
//                   <Input
//                     placeholder="Type your message..."
//                     value={messageText}
//                     onChange={(e) => setMessageText(e.target.value)}
//                   />
//                   <Button className="w-full" onClick={handleContactOwner}>
//                     <MessageCircle className="h-4 w-4 mr-2" />
//                     Send Message
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
            
//             {/* Action Buttons */}
//             {place.type === 'rent' && (
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-4">Interested?</h3>
//                   <Button className="w-full mb-2" onClick={handleBookPlace}>
//                     Book Viewing
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     Save to Favorites
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
            
//             {place.type === 'sell' && (
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-4">Interested?</h3>
//                   <Button className="w-full mb-2" onClick={handleBookPlace}>
//                     Schedule Viewing
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     Save to Favorites
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
            
//             {place.category === 'restaurant' && (
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-4">Make a Reservation</h3>
//                   <Button className="w-full mb-2" onClick={handleBookPlace}>
//                     Reserve a Table
//                   </Button>
//                   <Link to="/cart">
//                     <Button variant="outline" className="w-full">
//                       <ShoppingCart className="h-4 w-4 mr-2" />
//                       View Cart
//                     </Button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             )}
            
//             {place.category === 'shop' && (
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-4">Shopping</h3>
//                   <Link to="/cart">
//                     <Button className="w-full">
//                       <ShoppingCart className="h-4 w-4 mr-2" />
//                       View Cart
//                     </Button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             )}
            
//             {place.type === 'event' && (
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-4">Venue Booking</h3>
//                   <Button className="w-full mb-2" onClick={handleCreateEvent}>
//                     Create Event Here
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     Check Availability
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
            
//             {/* Map Preview */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="font-semibold">Location</h3>
//                   <Link to={`/places?lat=${place.location.lat}&lng=${place.location.lng}`} className="text-primary-600 text-sm hover:underline flex items-center">
//                     <Map className="h-3.5 w-3.5 mr-1" />
//                     View on map
//                   </Link>
//                 </div>
//                 <div className="h-40 rounded-md overflow-hidden">
//                   <MapView 
//                     places={[place]} 
//                     center={place.location} 
//                     zoom={14} 
//                     selectedPlace={place.id}
//                   />
//                 </div>
//                 <p className="mt-2 text-sm text-gray-600">{place.location.address}</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaceDetail;
