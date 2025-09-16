
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useChat } from '@/context/ChatContext';
import Navbar from '@/UI/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/place';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { sendOrderMessage } = useChat();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Group items by place
  const itemsByPlace: Record<string, CartItem[]> = {};
  items.forEach(item => {
    if (!itemsByPlace[item.placeId]) {
      itemsByPlace[item.placeId] = [];
    }
    itemsByPlace[item.placeId].push(item);
  });

  const handleCheckout = (placeId: string, placeItems: CartItem[]) => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      try {
        // Send the order via chat
        sendOrderMessage(placeItems, placeId);
        
        // Remove these items from the cart
        placeItems.forEach(item => removeFromCart(item.id));
        
        toast({
          title: "Order Sent!",
          description: "Your order has been sent to the restaurant. Check your messages for updates.",
        });
      } catch (error) {
        toast({
          title: "Order Failed",
          description: "There was a problem sending your order. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-500 text-center mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/places">
              <Button>
                Browse Places
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/places" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 space-y-6">
            <h1 className="text-2xl font-bold flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2" />
              Your Cart
            </h1>
            
            {Object.entries(itemsByPlace).map(([placeId, placeItems]) => (
              <Card key={placeId} className="overflow-hidden">
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <h2 className="font-semibold">
                    {placeItems[0]?.name.split(' ')[0]}'s Place
                  </h2>
                  <Link to={`/place/${placeId}`} className="text-sm text-primary-600 hover:underline">
                    View Place
                  </Link>
                </div>
                
                <CardContent className="p-0">
                  {placeItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div className="p-4 flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {index < placeItems.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </CardContent>
                
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Subtotal ({placeItems.reduce((sum, item) => sum + item.quantity, 0)} items)</p>
                    <p className="font-semibold">${placeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
                  </div>
                  <Button 
                    onClick={() => handleCheckout(placeId, placeItems)}
                    disabled={isProcessing}
                  >
                    Place Order
                  </Button>
                </div>
              </Card>
            ))}
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  By placing your order, you agree to our terms and conditions. 
                  Your order will be sent directly to the restaurant or shop via our messaging system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
