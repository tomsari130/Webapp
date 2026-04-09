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
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
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
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold tracking-tight">Walmart</h1>
              <Button variant="ghost" className="text-white hover:bg-[#004F9A] md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
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
            Don't miss out on incredible savings!
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
      <footer className="bg-[#0071CE] text-white mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Secure Shopping</h4>
              <p className="text-sm opacity-90">
                Your payment information is encrypted and secure. We never store
                your card details.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Money-Back Guarantee</h4>
              <p className="text-sm opacity-90">
                Not satisfied? Return within 30 days for a full refund. No
                questions asked.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Fast Delivery</h4>
              <p className="text-sm opacity-90">
                Get your orders delivered quickly. Free shipping on orders over
                $35.
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75">
            <p>© 2024 Walmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
