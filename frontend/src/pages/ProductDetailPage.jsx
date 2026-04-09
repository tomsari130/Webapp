import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ShoppingCart, Package, Truck, Shield, Star } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-16 text-center">
            <p className="text-gray-500 text-lg mb-4">Product not found</p>
            <Button onClick={() => navigate('/')} className="bg-[#0071CE] hover:bg-[#004F9A]">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate 90% discount
  const discountedPrice = product.originalPrice * 0.1;
  const savings = product.originalPrice - discountedPrice;
  const totalPrice = discountedPrice * quantity;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity, discountedPrice }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity, discountedPrice }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const buyNow = () => {
    addToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0071CE] text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-white hover:bg-[#004F9A]"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <img 
                  src="https://w7.pngwing.com/pngs/45/625/png-transparent-yellow-logo-illustration-walmart-logo-grocery-store-retail-asda-stores-limited-icon-walmart-logo-miscellaneous-company-orange.png"
                  alt="Walmart Logo"
                  className="h-6 w-6 object-contain"
                />
                <h1 className="text-xl font-bold">Walmart</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#004F9A]"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-8 bg-white">
                <div className="relative">
                  {product.badge && (
                    <Badge className="absolute top-0 left-0 z-10 bg-red-600 text-white">
                      {product.badge}
                    </Badge>
                  )}
                  <Badge className="absolute top-0 right-0 z-10 bg-[#FFC220] text-gray-900 font-bold">
                    90% OFF
                  </Badge>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="text-center p-4">
                <Truck className="h-8 w-8 text-[#0071CE] mx-auto mb-2" />
                <p className="text-xs font-semibold">Free Shipping</p>
              </Card>
              <Card className="text-center p-4">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">Money Back</p>
              </Card>
              <Card className="text-center p-4">
                <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">Fast Delivery</p>
              </Card>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Card>
              <CardContent className="p-6">
                {/* Product ID */}
                <div className="mb-4">
                  <Badge variant="outline" className="text-xs">
                    Product ID: {product.id.toUpperCase()}
                  </Badge>
                </div>

                {/* Product Name */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(2,547 reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-[#0071CE]">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white">
                      90% OFF - WAREHOUSE CLEARANCE
                    </Badge>
                  </div>
                  <p className="text-lg text-green-600 font-semibold mt-2">
                    You save ${savings.toFixed(2)}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock === 'Low stock' || product.stock === 'Limited stock' ? (
                    <p className="text-orange-600 font-medium flex items-center gap-2">
                      <span className="h-2 w-2 bg-orange-600 rounded-full animate-pulse"></span>
                      {product.stock}
                    </p>
                  ) : product.stock.includes('Only') ? (
                    <p className="text-red-600 font-medium flex items-center gap-2">
                      <span className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></span>
                      {product.stock}
                    </p>
                  ) : (
                    <p className="text-green-600 font-medium flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                      In stock - Ships within 24 hours
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded">
                      <Button
                        variant="ghost"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4"
                      >
                        -
                      </Button>
                      <span className="px-6 font-semibold text-lg">{quantity}</span>
                      <Button
                        variant="ghost"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Total: <span className="font-bold text-[#0071CE]">${totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={buyNow}
                    className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold py-6 text-lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                  <Button
                    onClick={addToCart}
                    variant="outline"
                    className="w-full border-[#0071CE] text-[#0071CE] hover:bg-[#0071CE] hover:text-white font-semibold py-6 text-lg"
                  >
                    Add to Cart
                  </Button>
                </div>

                {/* Category */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Category:</span>{' '}
                    <span className="capitalize">{product.category.replace('-', ' ')}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Product Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-semibold">{product.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold capitalize">
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-semibold text-green-600">In Stock</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold">Free Shipping</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Return Policy:</span>
                    <span className="font-semibold">30-Day Returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.name} is now available at an incredible 90% discount during our 
                Warehouse Clearance Sale! This is a limited-time offer you don't want to miss.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                This high-quality product comes with free shipping and our 30-day money-back 
                guarantee. Whether you're looking for yourself or as a gift, this amazing deal 
                won't last long!
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Premium quality at unbeatable prices</li>
                <li>Fast and free shipping</li>
                <li>30-day hassle-free returns</li>
                <li>Secure checkout process</li>
                <li>Excellent customer support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
