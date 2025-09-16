
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/place';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center p-2">
      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No img
          </div>
        )}
      </div>
      
      <div className="ml-2 flex-1">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-gray-500">${item.price.toFixed(2)} × {item.quantity}</p>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6" 
          onClick={handleDecrement}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="text-sm mx-1">{item.quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6" 
          onClick={handleIncrement}
        >
          <Plus className="h-3 w-3" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-red-500 hover:text-red-700" 
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </DropdownMenuItem>
  );
};

export default CartItem;
