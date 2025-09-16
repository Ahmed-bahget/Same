
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin } from 'lucide-react';
import { PlaceProps, PlaceCategoryType, PlaceTypeFilter } from '@/types/place';
import HobbyIcon from '@/components/Events/HobbyIcon';
import { HobbyType } from '@/components/Events/HobbyIcon';

interface AddPlaceDialogProps {
  open: boolean;
  onClose: () => void;
  onAddPlace: (place: PlaceProps) => void;
  userLocation: { lat: number; lng: number } | null;
}

const AddPlaceDialog: React.FC<AddPlaceDialogProps> = ({ 
  open, 
  onClose, 
  onAddPlace,
  userLocation
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: PlaceTypeFilter;
    category: PlaceCategoryType;
    address: string;
    price?: string;
    hobbyType?: HobbyType;
    imageUrl: string;
  }>({
    name: '',
    description: '',
    type: 'regular',
    category: 'flat',
    address: '',
    price: '',
    hobbyType: undefined,
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we'd validate and maybe geocode the address
    const location = {
      lat: userLocation?.lat || 51.505,
      lng: userLocation?.lng || -0.09,
      address: formData.address
    };

    // Create the new place object
    const newPlace: PlaceProps = {
      id: 'temp-id', // Will be replaced by backend in real app
      name: formData.name,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      location,
      createdBy: {
        id: 'user-1', // In real app, this would be current user id
        username: 'Current User', // In real app, this would be current username
        profileImage: 'https://i.pravatar.cc/150?img=1' // In real app, this would be current user's profile pic
      },
      images: formData.imageUrl ? [formData.imageUrl] : undefined,
      price: formData.price && (formData.type === 'rent' || formData.type === 'sell') ? formData.price : undefined,
      hobbyType: formData.hobbyType
    };
    
    onAddPlace(newPlace);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'regular',
      category: 'flat',
      address: '',
      price: '',
      hobbyType: undefined,
      imageUrl: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add a New Place</DialogTitle>
          <DialogDescription>
            Fill out the form below to add your place to the map.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Place name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your place"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              defaultValue={formData.type}
              onValueChange={(value: PlaceTypeFilter) => setFormData(prev => ({ ...prev, type: value }))}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="r1" />
                <Label htmlFor="r1">Regular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="r2" />
                <Label htmlFor="r2">Event Venue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rent" id="r3" />
                <Label htmlFor="r3">For Rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sell" id="r4" />
                <Label htmlFor="r4">For Sale</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              defaultValue={formData.category}
              onValueChange={(value: PlaceCategoryType) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="flat">Flat/Apartment</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {(formData.type === 'rent' || formData.type === 'sell') && (
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                placeholder={formData.type === 'rent' ? "£ per month" : "£ total price"}
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          )}

          {(formData.type === 'event' || formData.type === 'regular') && (
            <div className="space-y-2">
              <Label htmlFor="hobbyType">Related Hobby (optional)</Label>
              <Select 
                value={formData.hobbyType}
                onValueChange={(value: HobbyType) => setFormData(prev => ({ ...prev, hobbyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hobby" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Hobbies</SelectLabel>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Cooking">Cooking</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="address"
                name="address"
                className="pl-8"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Place</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlaceDialog;
