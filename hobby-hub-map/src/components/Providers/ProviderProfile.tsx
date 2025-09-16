import React, { useState } from 'react';
import { Phone, Mail, MapPin, Star, Calendar, Clock, Award, AlertCircle, Package, Home, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProviderProps, BrokerProps, DelivererProps, Transaction, Review } from '@/types/provider';
import MapView from '@/components/Map/MapView';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/context/ChatContext';

interface ProviderProfileProps {
  provider: ProviderProps;
  onHire?: (providerId: string) => void;
}

const ProviderProfile: React.FC<ProviderProfileProps> = ({ provider, onHire }) => {
  const { toast } = useToast();
  const { sendMessage } = useChat();
  const [messageText, setMessageText] = useState('');
  
  const isBroker = provider.type === 'broker';
  const broker = provider as BrokerProps;
  const deliverer = provider as DelivererProps;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const handleContactProvider = () => {
    if (messageText.trim()) {
      sendMessage(messageText, provider.id);
      setMessageText('');
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${provider.name}.`,
      });
    } else {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
    }
  };
  
  const handleHireProvider = () => {
    if (onHire) {
      onHire(provider.id);
    } else {
      toast({
        title: isBroker ? "Broker request sent" : "Delivery request sent",
        description: `Your request has been sent to ${provider.name}.`,
      });
    }
  };
  
  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const renderTransactionList = () => {
    const sortedTransactions = [...provider.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return (
      <div className="space-y-4">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {transaction.placeName || 
                        (transaction.type === 'sale' ? 'Property Sale' : 
                         transaction.type === 'rental' ? 'Property Rental' : 'Delivery')}
                    </h4>
                    <div className="text-sm text-gray-600">{formatDate(transaction.date)}</div>
                  </div>
                  {getTransactionStatusBadge(transaction.status)}
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <div className="flex items-center mr-4">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                    <span>
                      {transaction.type === 'sale' ? 'Sale' : 
                       transaction.type === 'rental' ? 'Rental' : 'Delivery'}
                    </span>
                  </div>
                  
                  {transaction.amount > 0 && (
                    <div className="flex items-center mr-4">
                      <span className="font-medium text-gray-900">
                        ${transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {transaction.commission > 0 && (
                    <div className="flex items-center">
                      <span className="text-green-600 font-medium">
                        ${transaction.commission.toLocaleString()} {isBroker ? 'commission' : 'earned'}
                      </span>
                    </div>
                  )}
                </div>
                
                {transaction.details && (
                  <p className="text-sm text-gray-700 mb-2">{transaction.details}</p>
                )}
                
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={transaction.client.profileImage} />
                    <AvatarFallback>{transaction.client.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{transaction.client.username}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">No transactions yet</h3>
            <p className="text-gray-500">This provider hasn't completed any transactions.</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderReviewsList = () => {
    const sortedReviews = [...provider.reviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return (
      <div className="space-y-4">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={review.createdBy.profileImage} />
                      <AvatarFallback>{review.createdBy.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.createdBy.username}</div>
                      <div className="text-xs text-gray-500">{formatDate(review.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">No reviews yet</h3>
            <p className="text-gray-500">This provider hasn't received any reviews.</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Provider Header/Banner */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-100 to-primary-50"></div>
        <div className="px-6 pb-6 relative">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md absolute -top-12">
            <AvatarImage src={provider.profileImage} alt={provider.name} />
            <AvatarFallback className="text-xl">{provider.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-2">{provider.name}</h1>
                {provider.verified && (
                  <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
                )}
              </div>
              
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{provider.location.address}</span>
              </div>
              
              <div className="flex flex-wrap mt-2 gap-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{provider.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({provider.reviews.length} reviews)</span>
                </div>
                
                <span className="text-gray-400 mx-1">•</span>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">
                    Member since {new Date(provider.joinDate).toLocaleDateString('en-GB', {month: 'short', year: 'numeric'})}
                  </span>
                </div>
                
                {isBroker ? (
                  <>
                    <span className="text-gray-400 mx-1">•</span>
                    <div className="flex items-center">
                      <Home className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">{broker.dealsClosed} deals</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400 mx-1">•</span>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">{deliverer.deliveriesCompleted} deliveries</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline"
                onClick={handleContactProvider}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button 
                onClick={handleHireProvider}
              >
                {isBroker ? 'Hire Broker' : 'Request Delivery'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Provider Details Tabs */}
      <Tabs defaultValue="about">
        <TabsList className="mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="transactions">
            {isBroker ? 'Deals History' : 'Delivery History'}
          </TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="location">Coverage Area</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About {provider.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{provider.bio}</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Info */}
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{provider.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{provider.contactInfo.email}</span>
                    </div>
                    {provider.contactInfo.website && (
                      <div className="flex items-center text-primary-600 hover:underline">
                        <a href={provider.contactInfo.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Specializations */}
                <div>
                  <h3 className="font-medium mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.specializations.map(spec => (
                      <Badge key={spec} variant="secondary">
                        {spec.charAt(0).toUpperCase() + spec.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Provider Specific Details */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">
                  {isBroker ? 'Broker Details' : 'Deliverer Details'}
                </h3>
                
                {isBroker ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">License Number</p>
                      <p className="font-medium">{broker.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Licensed Since</p>
                      <p className="font-medium">{new Date(broker.licensedSince).getFullYear()}</p>
                    </div>
                    {broker.agency && (
                      <div>
                        <p className="text-sm text-gray-600">Agency</p>
                        <p className="font-medium">{broker.agency}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Commission Rate</p>
                      <p className="font-medium text-green-600">{broker.commissionRate}%</p>
                    </div>
                    {broker.totalSalesVolume !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600">Total Sales Volume</p>
                        <p className="font-medium">${broker.totalSalesVolume.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Type</p>
                      <p className="font-medium capitalize">{deliverer.vehicle}</p>
                    </div>
                    {deliverer.avgDeliveryTime !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600">Average Delivery Time</p>
                        <p className="font-medium">{deliverer.avgDeliveryTime} minutes</p>
                      </div>
                    )}
                    {deliverer.maxWeight !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600">Maximum Weight</p>
                        <p className="font-medium">{deliverer.maxWeight} kg</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Delivery Fee</p>
                      <p className="font-medium">
                        ${deliverer.deliveryFee.base.toFixed(2)} + ${deliverer.deliveryFee.perKm.toFixed(2)}/km 
                        <span className="text-sm text-gray-500"> (min. ${deliverer.deliveryFee.minimum.toFixed(2)})</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Availability Hours */}
              {provider.availabilityHours && provider.availabilityHours.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Availability</h3>
                  <div className="space-y-2">
                    {provider.availabilityHours.map((schedule, index) => (
                      <div key={index} className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {schedule.days.join(', ')} {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Badges/Achievements */}
              {provider.badges && provider.badges.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.badges.map((badge, index) => (
                      <div key={index} className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          {renderTransactionList()}
        </TabsContent>
        
        <TabsContent value="reviews">
          {renderReviewsList()}
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Coverage Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapView 
                  places={[{ 
                    id: provider.id,
                    name: provider.name,
                    description: "providerDescription",
                    category: provider.type,
                    type: 'regular',
                    location: provider.location,
                    createdBy: {
                      id: provider.id,
                      username: provider.name,
                      profileImage: provider.profileImage
                    }
                  }]} 
                  center={provider.location}
                  zoom={13}
                  showRadius={provider.location.coverageRadius}
                />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Service Address</h3>
                <p className="text-gray-700">{provider.location.address}</p>
                
                {provider.location.coverageRadius && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Coverage area:</span> {provider.location.coverageRadius} km radius
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderProfile;