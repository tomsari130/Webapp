import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, categories } from '../mockData';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  const addToCart = (product) => {
    // Apply 90% discount
    const discountedPrice = product.originalPrice * 0.1;
    const productWithDiscount = { ...product, discountedPrice };
    
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, discountedPrice }
          : item
      );
    } else {
      updatedCart = [...cart, { ...productWithDiscount, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Added to cart!');
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0071CE] text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Walmart Logo */}
              <div className="bg-[#FFC220] rounded-full p-2 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0071CE]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Walmart</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search everything at Walmart online and in store"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-6 rounded-full border-none bg-white text-gray-900"
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFC220] hover:bg-[#FFB800] text-gray-900"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              className="text-white hover:bg-[#004F9A] relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#FFC220] text-gray-900 hover:bg-[#FFC220]">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-5 rounded-full border-none bg-white text-gray-900"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFC220] hover:bg-[#FFB800] text-gray-900"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0071CE] to-[#004F9A] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse">
            Up to 90% OFF
          </h2>
          <p className="text-xl md:text-3xl font-semibold mb-2">
            Limited Time Deals
          </p>
          <p className="text-lg md:text-xl opacity-90">
            Warehouse Clearance Sale
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#0071CE] hover:bg-[#004F9A]'
                  : ''
              }`}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? 'default' : 'outline'
                }
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-[#0071CE] hover:bg-[#004F9A]'
                    : ''
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedCategory === 'all'
              ? 'All Products'
              : categories.find((c) => c.id === selectedCategory)?.name}
          </h3>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} items available
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#0071CE] text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://w7.pngwing.com/pngs/45/625/png-transparent-yellow-logo-illustration-walmart-logo-grocery-store-retail-asda-stores-limited-icon-walmart-logo-miscellaneous-company-orange.png"
                  alt="Walmart"
                  className="h-8 w-8"
                />
                <h3 className="font-bold text-xl">Walmart</h3>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Save money. Live better. Your trusted destination for quality products at unbeatable prices.
              </p>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold text-lg mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Track Your Order</a></li>
                <li><a href="#" className="hover:underline">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:underline">Shipping Info</a></li>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-bold text-lg mb-4">Shop</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:underline">Electronics</a></li>
                <li><a href="#" className="hover:underline">Groceries</a></li>
                <li><a href="#" className="hover:underline">Dry Food</a></li>
                <li><a href="#" className="hover:underline">Medicines</a></li>
                <li><a href="#" className="hover:underline">All Categories</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm opacity-75">
                © 2026 Walmart Inc. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm opacity-75">
                <span>🔒 Secure Payment</span>
                <span>✓ Money Back Guarantee</span>
                <span>🚚 Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
