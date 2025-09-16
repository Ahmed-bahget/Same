
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/UI/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, MessageSquare, Video, Trophy, ArrowRight, Star } from 'lucide-react';
import HobbyIcon, { HobbyType } from '@/components/Events/HobbyIcon';
import { Progress } from '@/components/ui/progress';

// Sample data for the hobby detail page
const hobbyData = {
  "football": {
    name: "Football",
    type: "Sports" as HobbyType,
    description: "Football is the world's most popular sport, played by millions of people across every continent. From professional leagues to casual kickabouts in the park, football brings people together through a shared passion for the beautiful game.",
    communitySize: 3500000,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    events: [
      { id: "1", title: "Local 5-a-side Tournament", date: "2025-05-10", location: "City Stadium", attendees: 50 },
      { id: "2", title: "Football Viewing Party", date: "2025-05-15", location: "Sports Bar", attendees: 120 },
      { id: "3", title: "Charity Football Match", date: "2025-05-22", location: "Community Ground", attendees: 200 },
    ],
    discussions: [
      { 
        id: "1", 
        author: "SoccerFan22", 
        title: "Best training drills for improving ball control?", 
        content: "I've been playing for years but still struggle with tight ball control. Any recommendations for solo drills?",
        likes: 24,
        replies: 15,
        time: "2 hours ago"
      },
      { 
        id: "2", 
        author: "CoachMike", 
        title: "Tactical analysis of last night's match", 
        content: "The way they set up their defensive line was fascinating. Let's discuss the key tactical decisions that influenced the outcome.",
        likes: 56,
        replies: 32,
        time: "1 day ago"
      },
    ],
    videos: [
      { id: "1", title: "Top 10 Goals This Season", thumbnail: "https://images.unsplash.com/photo-1540379708242-14a809bef941?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", views: 15400 },
      { id: "2", title: "Basic Skills Tutorial", thumbnail: "https://images.unsplash.com/photo-1531819177115-428566ccfb50?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", views: 8900 },
    ],
    rankings: [
      { rank: 1, player: "Alex Johnson", points: 1250, country: "England", change: "up" },
      { rank: 2, player: "Maria Garcia", points: 1180, country: "Spain", change: "same" },
      { rank: 3, player: "Jamal Williams", points: 1120, country: "USA", change: "up" },
      { rank: 4, player: "Liu Wei", points: 1050, country: "China", change: "down" },
      { rank: 5, player: "Sophie Martin", points: 980, country: "France", change: "up" },
    ],
    stats: {
      globalParticipation: 78,
      professionalPlayers: 130000,
      averageMatches: 2.5,
      annualEvents: 850000
    }
  },
  "photography": {
    name: "Photography",
    type: "Arts" as HobbyType,
    description: "Photography is the art of capturing moments and creating lasting memories through images. From landscapes to portraits, photography offers endless creative possibilities.",
    communitySize: 1200000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    events: [
      { id: "1", title: "Urban Photography Workshop", date: "2025-05-12", location: "Downtown Gallery", attendees: 30 },
      { id: "2", title: "Nature Photography Exhibition", date: "2025-05-18", location: "City Museum", attendees: 150 },
    ],
    discussions: [
      { 
        id: "1", 
        author: "PhotoEnthusiast", 
        title: "Best entry-level DSLR cameras in 2025?", 
        content: "Looking to upgrade from smartphone photography to a proper camera. Any recommendations for beginners?",
        likes: 18,
        replies: 22,
        time: "5 hours ago"
      },
    ],
    videos: [
      { id: "1", title: "Mastering Portrait Photography", thumbnail: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", views: 7800 },
    ],
    rankings: [
      { rank: 1, player: "Emma Roberts", points: 980, country: "Canada", change: "up" },
      { rank: 2, player: "David Chen", points: 945, country: "Singapore", change: "same" },
      { rank: 3, player: "Ana Silva", points: 920, country: "Brazil", change: "up" },
    ],
    stats: {
      globalParticipation: 45,
      professionalPlayers: 250000,
      averageMatches: 0,
      annualEvents: 120000
    }
  },
};

type HobbyDetailParams = {
  hobbyName: string;
}

const HobbyDetail: React.FC = () => {
  const { hobbyName } = useParams<HobbyDetailParams>();
  const hobby = hobbyData[hobbyName as keyof typeof hobbyData];
  
  if (!hobby) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Hobby not found</h1>
          <p className="text-gray-600 mb-8">The hobby you're looking for doesn't exist in our database.</p>
          <Button asChild>
            <a href="/hobbies">Return to Hobbies</a>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div 
          className="relative rounded-xl overflow-hidden mb-8 bg-cover bg-center h-64 md:h-80"
          style={{ backgroundImage: `url(${hobby.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <Badge className="mb-2 w-fit bg-primary-600">{hobby.type}</Badge>
            <h1 className="text-4xl font-bold text-white mb-2">{hobby.name}</h1>
            <div className="flex items-center text-white/80">
              <Users className="h-4 w-4 mr-1" />
              <span>{hobby.communitySize.toLocaleString()} community members</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About {hobby.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{hobby.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Global Participation</p>
                    <p className="text-2xl font-bold text-primary-700">{hobby.stats.globalParticipation}%</p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Professional Players</p>
                    <p className="text-2xl font-bold text-primary-700">{hobby.stats.professionalPlayers.toLocaleString()}</p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Avg. Weekly Sessions</p>
                    <p className="text-2xl font-bold text-primary-700">{hobby.stats.averageMatches}</p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Annual Events</p>
                    <p className="text-2xl font-bold text-primary-700">{hobby.stats.annualEvents.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Top Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hobby.rankings.map((rank) => (
                    <div key={rank.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full 
                          ${rank.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                            rank.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                            rank.rank === 3 ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'
                          } font-semibold text-sm`}
                        >
                          {rank.rank}
                        </span>
                        <div>
                          <p className="font-medium">{rank.player}</p>
                          <p className="text-xs text-gray-500">{rank.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{rank.points}</p>
                        <span className={`text-xs 
                          ${rank.change === 'up' ? 'text-green-600' : 
                            rank.change === 'down' ? 'text-red-600' : 'text-gray-500'}`}
                        >
                          {rank.change === 'up' ? '↑' : rank.change === 'down' ? '↓' : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4">
                  View Full Rankings <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="discussions">Community</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="places">Places</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hobby.events.map(event => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <CardHeader className="bg-primary-50 border-b">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Events</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Community Discussions</h2>
              <Button>Start Discussion</Button>
            </div>
            
            <div className="space-y-4">
              {hobby.discussions.map(discussion => (
                <Card key={discussion.id} className="overflow-hidden hover:shadow-sm transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{discussion.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{discussion.title}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>by {discussion.author}</span>
                            <span className="mx-2">•</span>
                            <span>{discussion.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{discussion.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        <span>{discussion.likes} likes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Discussions</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Featured Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hobby.videos.map(video => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center">
                        <Video className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-medium mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-600">{video.views.toLocaleString()} views</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Videos</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="places" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Related Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                    alt="Stadium"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-500">For Rent</Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-1">Sports Stadium Complex</h3>
                  <p className="text-sm text-gray-600 mb-3">Professional facilities available for tournaments and events</p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Downtown, City Center</span>
                  </div>
                  <Button size="sm" className="w-full">Check Availability</Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                    alt="Training Center"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500">For Sale</Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-1">Football Training Center</h3>
                  <p className="text-sm text-gray-600 mb-3">Complete facility with multiple pitches and training equipment</p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>North District, Sportsville</span>
                  </div>
                  <Button size="sm" className="w-full">Contact Seller</Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                    alt="Sports Bar"
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">Restaurant</Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-1">The Goal Post Sports Bar</h3>
                  <p className="text-sm text-gray-600 mb-3">Premier sports bar showing all major football matches</p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>West End, Entertainment District</span>
                  </div>
                  <Button size="sm" className="w-full">Make Reservation</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Places</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default HobbyDetail;
