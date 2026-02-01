'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/lib/context/CartContext';
import type { Product } from '@/lib/types';
import { Minus, Plus, ShoppingCart, Package, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Get product by slug - we'll need to fetch all and filter
      const products = await productsAPI.getAll({ search: params.slug as string });
      const foundProduct = products.find(p => p.slug === params.slug);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Fetch related products from same category
        const related = await productsAPI.getAll({ 
          category: foundProduct.category.id 
        });
        setRelatedProducts(related.filter(p => p.id !== foundProduct.id).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      // Error handled in context
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/products" className="text-blue-600 hover:text-blue-700">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category.id}`} className="hover:text-blue-600">
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Product Images */}
              <div>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-24 h-24" />
                    </div>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                {/* Category Badge */}
                <Link
                  href={`/products?category=${product.category.id}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                  <Tag className="w-4 h-4" />
                  {product.category.name}
                </Link>

                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="prose prose-sm mb-6">
                  <p className="text-gray-700">{product.description}</p>
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="px-6 py-2 font-semibold">{quantity}</span>
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= product.stock}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.stock} available
                      </span>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || cartLoading}
                  className="w-full mb-4"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                {/* Product Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold mb-4">Product Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="font-medium">PROD-{product.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="font-medium">{product.category.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Availability:</dt>
                      <dd className="font-medium">
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
