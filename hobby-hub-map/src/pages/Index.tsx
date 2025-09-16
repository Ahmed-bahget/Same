
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/UI/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Users, Calendar, Compass } from 'lucide-react';

const Index: React.FC = () => {
  const featuresData = [
    {
      icon: <MapPin className="h-10 w-10 text-primary-500" />,
      title: "Discover Local Spots",
      description: "Find hidden gems and popular locations for your favorite hobbies nearby."
    },
    {
      icon: <Users className="h-10 w-10 text-primary-500" />,
      title: "Connect with Hobbyists",
      description: "Meet people who share your passions and interests in your area."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary-500" />,
      title: "Join & Create Events",
      description: "Participate in local events or start your own to bring enthusiasts together."
    },
    {
      icon: <Compass className="h-10 w-10 text-primary-500" />,
      title: "Explore New Hobbies",
      description: "Discover new activities and interests through local communities."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen max-h-[650px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')]">
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Friends Near You With Your Hobbies
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
              Discover local events, connect with people who share your interests, and explore new hobbies in your area.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="font-medium">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="font-medium bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Log In
                </Button>
              </Link>
              <Link to="/test">
                <Button size="lg" variant="secondary" className="font-medium">
                  Test Connection
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#F9FAFB" fillOpacity="1" d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How SameHobbies Works</h2>
            <p className="text-xl text-gray-600">
              Our platform connects you with people who share your interests in your area, making it easy to discover events and make new friends.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Hobby Community?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of hobbyists already connecting and sharing experiences near you.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="font-medium">
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="font-medium border-white/30 hover:bg-white/10">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-500 p-1.5 mr-2">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SameHobbies</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Connecting people through shared hobbies and interests in local communities.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Explore</h3>
                <ul className="space-y-2">
                  <li><Link to="/login" className="hover:text-primary-400 transition-colors">Hobbies</Link></li>
                  <li><Link to="/login" className="hover:text-primary-400 transition-colors">Events</Link></li>
                  <li><Link to="/login" className="hover:text-primary-400 transition-colors">Map</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
                  <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="/help" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
                  <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQs</Link></li>
                  <li><Link to="/login" className="hover:text-primary-400 transition-colors">Community Guidelines</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} SameHobbies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
