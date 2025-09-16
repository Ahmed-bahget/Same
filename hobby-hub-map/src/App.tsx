import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/UI/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';

// Contexts
import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import EventDetails from '@/pages/EventDetails';
import Events from '@/pages/Events';
import NotFound from '@/pages/NotFound';
import HobbiesSection from './pages/HobbiesSection';
import HobbyDetail from './pages/HobbyDetail';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import Cart from './pages/Cart';
import Messages from './pages/Messages';
import TestConnection from './pages/TestConnection';

function App() {
  return (
    <Router>
      <CartProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<TestConnection />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/event/:eventId" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
            <Route path="/hobbies" element={<PrivateRoute><HobbiesSection /></PrivateRoute>} />
            <Route path="/hobbies/:hobbyName" element={<PrivateRoute><HobbyDetail /></PrivateRoute>} />
            <Route path="/places" element={<PrivateRoute><Places /></PrivateRoute>} />
            <Route path="/place/:placeId" element={<PrivateRoute><PlaceDetail /></PrivateRoute>} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/messages/:chatId" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ChatProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
