
import React from 'react';
import { Badge } from '@/components/ui/badge';
import HobbyIcon, { HobbyType } from '../components/Events/HobbyIcon';
import HobbiesCard from '@/components/Hobbies/HobbiesCard';
import Navbar from '@/UI/Navbar';

interface Hobby {
  name: string;
  type: HobbyType;
  description?: string;
  communitySize?: number;
  upcomingEvents?: number;
  image?: string;
}

// Sample hobbies data
const allHobbies: Hobby[] = [
  {
    name: "Football",
    type: "Sports",
    description: "The world's most popular sport, played by millions across the globe.",
    communitySize: 3500000,
    upcomingEvents: 24,
  },
  {
    name: "Photography",
    type: "Arts",
    description: "Capture moments and create lasting memories through the art of photography.",
    communitySize: 1200000,
    upcomingEvents: 15,
  },
  {
    name: "Guitar",
    type: "Music",
    description: "Learn to play beautiful melodies and express yourself through music.",
    communitySize: 950000,
    upcomingEvents: 12,
  },
  {
    name: "Cooking",
    type: "Cooking",
    description: "Explore culinary arts and create delicious dishes from around the world.",
    communitySize: 1800000,
    upcomingEvents: 18,
  },
  {
    name: "Gaming",
    type: "Gaming",
    description: "Connect with fellow gamers and participate in tournaments and events.",
    communitySize: 2500000,
    upcomingEvents: 30,
  },
  {
    name: "Programming",
    type: "Tech",
    description: "Build applications and solve problems through coding and software development.",
    communitySize: 1500000,
    upcomingEvents: 22,
  },
  {
    name: "Hiking",
    type: "Outdoor",
    description: "Explore nature trails and mountain paths for adventure and relaxation.",
    communitySize: 780000,
    upcomingEvents: 14,
  },
  {
    name: "Book Club",
    type: "Social",
    description: "Discuss literature and connect with fellow book enthusiasts.",
    communitySize: 650000,
    upcomingEvents: 8,
  }
];

const HobbiesSection: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Hobbies</h1>
          <p className="text-gray-600">
            Explore popular hobbies, connect with communities, and join events related to your interests
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
          <div className="flex flex-wrap gap-2">
            {Object.values(allHobbies).map((hobby, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                <HobbyIcon hobbyType={hobby.type} className="h-4 w-4" />
                <span>{hobby.type}</span>
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allHobbies.map((hobby, index) => (
            <HobbiesCard key={index} hobby={hobby} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HobbiesSection;
