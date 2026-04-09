import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  const updateQuantity = (productId, change) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
  const originalTotal = cart.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout/user-info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0071CE] text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-[#004F9A]"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-16 text-center">
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-[#0071CE] hover:bg-[#004F9A]"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-contain rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            ${item.discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${(item.discountedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>You Save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[#0071CE]">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold py-6 text-lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
