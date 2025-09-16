
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMap } from '@/hooks/useMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { hobbyService } from '@/services/hobbyService';

// Hobby options
const HOBBY_OPTIONS = [
  'Sports',
  'Arts',
  'Music',
  'Cooking',
  'Gaming',
  'Tech',
  'Outdoor',
  'Social'
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { getUserLocation, userLocation, setManualLocation } = useMap();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [allHobbies, setAllHobbies] = useState<any[]>([]);

  // Fetch all hobbies from backend
  React.useEffect(() => {
    const fetchHobbies = async () => {
      const response = await hobbyService.getAllHobbies();
      if (response.success && response.data) {
        setAllHobbies(response.data);
      }
    };
    fetchHobbies();
  }, []);

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle hobby selection
  const toggleHobby = (hobby: string) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  // Handle location detection
  const handleLocationDetection = async () => {
    const location = await getUserLocation();
    if (location) {
      setUseCurrentLocation(true);
      toast({
        title: "Location detected!",
        description: "Your current location has been set successfully.",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedHobbies.length === 0) {
      toast({
        variant: "destructive",
        title: "Hobby selection required",
        description: "Please select at least one hobby to continue.",
      });
      return;
    }

    if (!useCurrentLocation && !customLocation) {
      toast({
        variant: "destructive",
        title: "Location required",
        description: "Please set your location to continue.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Map selected hobby names to hobbyIds
      const hobbyIds = allHobbies
        .filter(h => selectedHobbies.includes(h.name))
        .map(h => h.hobbyId);
      // Prepare location fields
      let latitude: number | undefined = undefined;
      let longitude: number | undefined = undefined;
      let locationAddress: string | undefined = undefined;
      if (useCurrentLocation && userLocation) {
        latitude = userLocation.lat;
        longitude = userLocation.lng;
        locationAddress = userLocation.address;
      } else if (customLocation) {
        locationAddress = customLocation;
      }
      // Prepare profile image URL (only if it's a real URL)
      let profileImageUrl: string | undefined = undefined;
      if (profileImage && profileImage.startsWith('http')) {
        profileImageUrl = profileImage;
      }
      await register({
        Username: username,
        Email: email,
        Password: password,
        FirstName: firstName || username,
        LastName: lastName,
        PhoneNumber: phoneNumber || undefined,
        DateOfBirth: dateOfBirth || undefined,
        HobbyIds: hobbyIds,
        Latitude: latitude,
        Longitude: longitude,
        LocationAddress: locationAddress,
        ProfileImageUrl: profileImageUrl,
      });
      
      toast({
        title: "Registration successful!",
        description: "Welcome to SameHobbies!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "There was an error during registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center items-center mb-5">
            <div className="rounded-full bg-primary-500 p-2">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Join SameHobbies to connect with people who share your interests</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative mb-2"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
                
                <input 
                  type="file" 
                  id="profile-image" 
                  accept="image/*" 
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </div>
              
              <label htmlFor="profile-image" className="cursor-pointer text-primary-600 text-sm hover:text-primary-500">
                {profileImage ? 'Change photo' : 'Upload photo'}
              </label>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>

            {/* Hobbies Section */}
            <div>
              <Label className="mb-2 block">Select your hobbies</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {allHobbies.map((hobby) => {
                  const isSelected = selectedHobbies.includes(hobby.name);
                  return (
                    <div 
                      key={hobby.hobbyId}
                      className={`${
                        isSelected 
                          ? 'bg-primary-100 border-primary-500 text-primary-800' 
                          : 'bg-white border-gray-300 hover:border-primary-400'
                      } border rounded-lg p-3 cursor-pointer transition-colors flex items-center`}
                      onClick={() => toggleHobby(hobby.name)}
                    >
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => toggleHobby(hobby.name)}
                      />
                      <label className="ml-2 cursor-pointer">{hobby.name}</label>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select all that apply
              </p>
            </div>

            {/* Location Section */}
            <div>
              <Label className="mb-2 block">Your location</Label>
              <div className="space-y-4">
                <div className="flex items-start">
                  <button
                    type="button"
                    onClick={handleLocationDetection}
                    className={`${
                      useCurrentLocation 
                        ? 'bg-primary-100 border-primary-500 text-primary-800' 
                        : 'bg-white border-gray-300 hover:border-primary-400'
                    } border rounded-lg p-3 flex items-center transition-colors w-full`}
                  >
                    <Checkbox 
                      checked={useCurrentLocation}
                      onCheckedChange={(checked) => setUseCurrentLocation(checked as boolean)}
                    />
                    <div className="ml-2">
                      <div className="font-medium">Use my current location</div>
                      <div className="text-xs text-gray-500">We'll use your device's location</div>
                    </div>
                  </button>
                </div>
                
                <div className={`flex items-start ${useCurrentLocation ? 'opacity-50' : ''}`}>
                  <div className="w-full">
                    <div className="flex items-center mb-2">
                      <Checkbox 
                        checked={!useCurrentLocation}
                        onCheckedChange={(checked) => setUseCurrentLocation(!checked as boolean)}
                        disabled={useCurrentLocation}
                      />
                      <label className="ml-2 font-medium">Enter location manually</label>
                    </div>
                    <Input
                      placeholder="Enter city, neighborhood, etc."
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      disabled={useCurrentLocation}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
              <div className="text-center mt-4">
                <span className="text-gray-600">Already have an account?</span>{' '}
                <Link to="/login" className="text-primary-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
