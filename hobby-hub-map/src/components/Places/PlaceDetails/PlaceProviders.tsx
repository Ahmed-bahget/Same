import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProviderCard from '@/components/Providers/ProviderCard';
import { PlaceProps } from '@/types/place';
import { ProviderProps } from '@/types/provider';
import { useToast } from '@/hooks/use-toast';

// Removed mock data imports
// import { MOCK_BROKERS } from '@/pages/Brokers';
// import { MOCK_DELIVERERS } from '@/pages/Deliverers';

interface PlaceProvidersProps {
  place: PlaceProps;
  limit?: number;
}

const PlaceProviders: React.FC<PlaceProvidersProps> = ({ place, limit = 2 }) => {
  // const { toast } = useToast();
  // const navigate = useNavigate();

  // Since there is no backend for brokers/deliverers, just show a message
  return (
    <div className="py-6 text-center text-gray-500">
      <p>No providers are available for this place at the moment.</p>
    </div>
  );
};

export default PlaceProviders;