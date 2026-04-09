import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import UserInfoPage from './pages/UserInfoPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/user-info" element={<UserInfoPage />} />
          <Route path="/checkout/payment" element={<PaymentPage />} />
          <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
