import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const UserInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    localStorage.setItem('userInfo', JSON.stringify(formData));
    toast.success('Information saved');
    navigate('/checkout/payment');
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
              onClick={() => navigate('/cart')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Shipping Information</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, Apt 4B"
                  required
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    required
                  />
                </div>
              </div>

              {/* ZIP and Country */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold py-6 text-lg"
              >
                Continue to Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInfoPage;
