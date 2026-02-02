'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import type { Product } from '@/lib/types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const imageUrl = product.image || '/placeholder-product.png';
  const inStock = product.stock > 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Category */}
        <Link
          href={`/categories/${product.category.id}`}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium uppercase tracking-wide"
        >
          {product.category.name}
        </Link>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
            {inStock && (
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Package size={14} className="mr-1" />
                <span>{product.stock} in stock</span>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={!inStock || loading}
            className="flex items-center space-x-2"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
