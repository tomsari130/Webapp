import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) *
      100
  );

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-gray-200">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative bg-white aspect-square overflow-hidden">
          {product.badge && (
            <Badge
              className="absolute top-2 left-2 z-10 bg-red-600 hover:bg-red-700 text-white"
            >
              {product.badge}
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge
              className="absolute top-2 right-2 z-10 bg-[#FFC220] hover:bg-[#FFB800] text-gray-900 font-bold"
            >
              {discountPercentage}% OFF
            </Badge>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              You save ${(product.originalPrice - product.discountedPrice).toFixed(2)}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {product.stock === 'Low stock' || product.stock === 'Limited stock' ? (
              <p className="text-xs text-orange-600 font-medium">
                ⚠️ {product.stock}
              </p>
            ) : product.stock.includes('Only') ? (
              <p className="text-xs text-red-600 font-medium">🔥 {product.stock}</p>
            ) : (
              <p className="text-xs text-green-600 font-medium">✓ In stock</p>
            )}
          </div>

          {/* Buy Now Button */}
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold transition-colors"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Now
          </Button>

          {/* Limited Time Offer Badge */}
          <div className="mt-2 text-center">
            <Badge
              variant="outline"
              className="text-xs border-red-600 text-red-600"
            >
              Limited Time Offer
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
