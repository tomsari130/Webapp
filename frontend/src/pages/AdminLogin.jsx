import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'suppmike12@zohomail.com';
    const ADMIN_PASSWORD = 'Mike@&$321';

    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      // Set admin session
      localStorage.setItem('adminToken', 'admin-authenticated-' + Date.now());
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } else {
      toast.error('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0071CE] to-[#004F9A] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="https://w7.pngwing.com/pngs/45/625/png-transparent-yellow-logo-illustration-walmart-logo-grocery-store-retail-asda-stores-limited-icon-walmart-logo-miscellaneous-company-orange.png"
              alt="Walmart Logo"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">Walmart</h1>
          </div>
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Access the admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  placeholder="admin@walmart.com"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0071CE] hover:bg-[#004F9A] text-white font-semibold py-6"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Store
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;