'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { ordersAPI } from '@/lib/api';
import type { Order } from '@/lib/types';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const orderData = await ordersAPI.getById(Number(orderId));
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loading />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. We've received your order and will process it shortly.
            </p>

            {/* Order Details */}
            {order && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-semibold">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-blue-600">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded overflow-hidden">
                            {item.product.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold">${Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {order.shipping_address}
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation Message */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                📧 A confirmation email has been sent to your email address with order details and tracking information.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/account/orders">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Package className="w-5 h-5 mr-2" />
                  View My Orders
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Track Your Order</h3>
              <p className="text-sm text-gray-600">
                You'll receive tracking information once your order ships
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Order Updates</h3>
              <p className="text-sm text-gray-600">
                We'll keep you updated via email about your order status
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                Contact our support team if you have any questions
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
