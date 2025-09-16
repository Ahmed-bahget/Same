
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

const CartIcon: React.FC = () => {
  const { items, totalItems, totalPrice } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Your Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {items.length > 0 ? (
          <>
            <div className="max-h-60 overflow-y-auto">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="px-2 py-2">
              <div className="flex justify-between mb-2">
                <span>Total:</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              
              <Link to="/cart" className="w-full">
                <Button className="w-full">View Cart</Button>
              </Link>
            </div>
          </>
        ) : (
          <DropdownMenuItem disabled className="text-center py-4">
            Your cart is empty
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartIcon;
