
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MapPin, User, LogOut, Settings } from 'lucide-react';
import CartIcon from '@/components/Cart/CartIcon';
import ChatIcon from '@/components/Chat/ChatIcon';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const getInitials = () => {
    if (!user || !user.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-primary-500 p-1.5">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary-600">SameHobbies</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Explore Map
          </Link>
          <Link to="/events" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Events
          </Link>
          <Link to="/hobbies" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Hobbies
          </Link>
          <Link to="/places" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Places
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <ChatIcon />
                <CartIcon />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 cursor-pointer">
                      {user?.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user.username} />
                      ) : null}
                      <AvatarFallback className="bg-primary-100 text-primary-800">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user?.id}`} className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/cart" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Cart</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
