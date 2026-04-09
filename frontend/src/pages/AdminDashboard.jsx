import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LogOut, Package, DollarSign, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/admin/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await axios.delete(`${API}/admin/orders/${orderId}`);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`${API}/admin/orders/${orderId}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0071CE] text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://w7.pngwing.com/pngs/45/625/png-transparent-yellow-logo-illustration-walmart-logo-grocery-store-retail-asda-stores-limited-icon-walmart-logo-miscellaneous-company-orange.png"
                alt="Walmart Logo"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-xs opacity-90">Walmart Order Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#004F9A]"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-orange-100 p-4 rounded-full">
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-mono text-xs">
                          {order._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-semibold">{order.customerName}</TableCell>
                        <TableCell className="text-sm">{order.customerEmail}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === 'completed'
                                ? 'bg-green-600'
                                : order.status === 'processing'
                                ? 'bg-blue-600'
                                : 'bg-orange-600'
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteOrder(order._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Order Details - {selectedOrder._id.slice(-8).toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                  <p className="font-semibold">
                    {selectedOrder.shippingAddress}<br />
                    {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zipCode}<br />
                    {selectedOrder.country}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Items ({selectedOrder.items.length})</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Mark as Processing
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder._id, 'completed')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Mark as Completed
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;