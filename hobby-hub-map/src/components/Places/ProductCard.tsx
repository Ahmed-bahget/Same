
import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '@/types/place';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart } = useCart();
  const isInCart = items.some(item => item.id === product.id);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-200 relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          
          <Button 
            size="sm" 
            variant={isInCart ? "secondary" : "default"}
            onClick={() => !isInCart && product.available && addToCart(product)}
            disabled={!product.available || isInCart}
          >
            {isInCart ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
