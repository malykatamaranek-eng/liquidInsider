'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-4">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your cart
            </p>
            <Link href="/account/login">
              <Button>Log In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const isEmpty = !cart || cart.items.length === 0;
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {isEmpty ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Add some products to get started!
              </p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link 
                        href={`/products/${item.product.slug}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.product.slug}`}
                          className="font-semibold text-lg hover:text-blue-600 block mb-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product.category.name}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          disabled={loading}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading || item.quantity >= item.product.stock}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-sm font-semibold">
                          Subtotal: ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600 font-semibold">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>

                  {shipping > 0 && subtotal < 50 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                      <p className="text-blue-800">
                        Add <span className="font-semibold">${(50 - subtotal).toFixed(2)}</span> more for free shipping!
                      </p>
                    </div>
                  )}

                  <Link href="/checkout">
                    <Button className="w-full mb-3" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/products">
                    <button className="w-full py-3 text-blue-600 hover:text-blue-700 font-semibold">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
