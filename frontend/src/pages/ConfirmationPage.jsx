import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
  }, []);

  const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-[#0071CE] text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Order Confirmation</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-white">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-4">
              <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Order Placed Successfully!
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Thank you for shopping with us.
            </p>
            <p className="text-md text-gray-600">
              Your order will be delivered soon. Please wait.
            </p>
          </CardContent>
        </Card>

        {/* Order Summary */}
        {lastOrder && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">
                  {new Date(lastOrder.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-semibold">
                  {lastOrder.cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Order Total:</span>
                <span className="text-[#0071CE]">
                  ${lastOrder.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivery Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Delivery Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order Confirmed</h4>
                  <p className="text-sm text-gray-600">
                    Your order has been received and is being processed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Processing</h4>
                  <p className="text-sm text-gray-600">
                    We're preparing your items for shipment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Shipped</h4>
                  <p className="text-sm text-gray-600">
                    Your order will be on its way soon
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Home className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Delivered</h4>
                  <p className="text-sm text-gray-600">
                    Estimated delivery: 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Confirmation Email Notice */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6 pb-6">
            <p className="text-center text-sm text-blue-900">
              📧 A confirmation email has been sent to your email address with
              order details.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              localStorage.removeItem('lastOrder');
              navigate('/');
            }}
            className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold py-6 text-lg"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Thank you for choosing Walmart!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Have questions? Contact our customer support 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
