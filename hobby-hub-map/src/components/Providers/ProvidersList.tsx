import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Star, MapPin, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Slider
} from '@/components/ui/slider';
import { ProviderProps, ProviderType, SpecializationType } from '@/types/provider';
import ProviderCard from './ProviderCard';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/context/ChatContext';

interface ProvidersListProps {
  providers: ProviderProps[];
  providerType?: ProviderType;
  placeCategory?: string;
  onHireProvider?: (providerId: string) => void;
}

const ProvidersList: React.FC<ProvidersListProps> = ({ 
  providers, 
  providerType,
  placeCategory,
  onHireProvider
}) => {
  const { toast } = useToast();
  const { sendMessage } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filteredProviders, setFilteredProviders] = useState(providers);
  const [minRating, setMinRating] = useState(0);
  const [specializations, setSpecializations] = useState<SpecializationType[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  
  // Filter providers based on search term and filters
  React.useEffect(() => {
    let filtered = providers;
    
    // Filter by provider type if specified
    if (providerType) {
      filtered = filtered.filter(provider => provider.type === providerType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(lowercaseSearch) || 
        provider.bio.toLowerCase().includes(lowercaseSearch) ||
        provider.location.address.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Filter by minimum rating
    filtered = filtered.filter(provider => provider.rating >= minRating);
    
    // Filter by verification status
    if (showVerifiedOnly) {
      filtered = filtered.filter(provider => provider.verified);
    }
    
    // Filter by specializations
    if (specializations.length > 0) {
      filtered = filtered.filter(provider => 
        specializations.some(spec => provider.specializations.includes(spec))
      );
    }
    
    // Sort providers
    switch (sortBy) {
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        filtered = [...filtered].sort((a, b) => 
          new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        );
        break;
      case 'transactions':
        filtered = [...filtered].sort((a, b) => 
          b.transactions.length - a.transactions.length
        );
        break;
      default:
        break;
    }
    
    setFilteredProviders(filtered);
  }, [providers, searchTerm, sortBy, minRating, specializations, showVerifiedOnly, providerType]);
  
  const handleContactClick = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      sendMessage(`Hi ${provider.name}, I'm interested in your services. Are you available to discuss?`, providerId);
      toast({
        title: 'Message sent',
        description: `Your message has been sent to ${provider.name}.`,
      });
    }
  };
  
  const handleHireClick = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      if (onHireProvider) {
        onHireProvider(providerId);
      } else {
        toast({
          title: 'Request sent',
          description: `Your request has been sent to ${provider.name}.`,
        });
      }
    }
  };
  
  // Generate specialization options based on provider type
  const specializationOptions = (): SpecializationType[] => {
    if (providerType === 'broker') {
      return ['flat', 'villa', 'commercial', 'land'];
    } else if (providerType === 'deliverer') {
      return ['food', 'groceries', 'retail', 'documents', 'other'];
    } else {
      // If no specific provider type, show all
      return ['flat', 'villa', 'commercial', 'land', 'food', 'groceries', 'retail', 'documents', 'other'];
    }
  };
  
  const toggleSpecialization = (spec: SpecializationType) => {
    setSpecializations(prev => 
      prev.includes(spec) 
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    );
  };
  
  const getSpecializationLabel = (spec: string) => {
    const labels: Record<string, string> = {
      'flat': 'Apartments',
      'villa': 'Villas',
      'commercial': 'Commercial',
      'land': 'Land',
      'food': 'Food',
      'groceries': 'Groceries',
      'retail': 'Retail',
      'documents': 'Documents',
      'other': 'Other'
    };
    
    return labels[spec] || spec;
  };
  
  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder={`Search ${providerType || 'providers'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
              <SelectItem value="transactions">Most Transactions</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Providers</SheetTitle>
                <SheetDescription>
                  Refine the list to find the perfect provider
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-4 space-y-6">
                {/* Minimum Rating Filter */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Minimum Rating
                    </label>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{minRating}</span>
                    </div>
                  </div>
                  <Slider 
                    defaultValue={[minRating]} 
                    max={5} 
                    step={0.5} 
                    onValueChange={(value) => setMinRating(value[0])}
                  />
                </div>
                
                {/* Verified Only Filter */}
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="verified" 
                    checked={showVerifiedOnly}
                    onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="verified" className="text-sm font-medium flex items-center">
                    <UserCheck className="h-4 w-4 mr-1 text-green-500" />
                    Verified Providers Only
                  </label>
                </div>
                
                {/* Specializations Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Specializations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {specializationOptions().map(spec => (
                      <Badge 
                        key={spec}
                        variant={specializations.includes(spec) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSpecialization(spec)}
                      >
                        {getSpecializationLabel(spec)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Providers List */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onContactClick={handleContactClick}
              onHireClick={handleHireClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <UserCheck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No providers found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            No {providerType === 'broker' ? 'brokers' : providerType === 'deliverer' ? 'deliverers' : 'providers'} match your current filters. 
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProvidersList;