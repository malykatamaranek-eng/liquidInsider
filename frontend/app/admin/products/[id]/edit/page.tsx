'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminAPI, productsAPI, categoriesAPI, imageAPI } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ImageUploadZone from '@/components/ImageUploadZone';
import ImageGallery from '@/components/ImageGallery';
import UploadProgress from '@/components/UploadProgress';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ fileName: string; progress: number }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [product, categoriesData, imagesData] = await Promise.all([
        productsAPI.getById(parseInt(productId)),
        categoriesAPI.getAll(),
        imageAPI.getProductImages(productId),
      ]);
      
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category_id: product.category.id.toString(),
        is_active: product.is_active,
      });
      setCategories(categoriesData);
      setImages(imagesData.data || []);
    } catch (error) {
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await adminAPI.updateProduct(parseInt(productId), {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category_id: parseInt(formData.category_id),
      });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.deleteProduct(parseInt(productId));
      toast.success('Product deleted successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    setUploadProgress(files.map((f) => ({ fileName: f.name, progress: 0 })));

    try {
      // TODO: Implement real progress tracking using XMLHttpRequest or fetch with progress events
      // Currently simulating progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) =>
          prev.map((p) => ({
            ...p,
            progress: Math.min(p.progress + 10, 90),
          }))
        );
      }, 200);

      await imageAPI.uploadImages(productId, files);

      clearInterval(progressInterval);
      setUploadProgress(files.map((f) => ({ fileName: f.name, progress: 100 })));

      toast.success('Images uploaded successfully');
      setTimeout(() => {
        setUploadProgress([]);
        fetchData(); // Refresh images
      }, 1000);
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Failed to upload images');
      setUploadProgress([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <Link
          href="/admin/products"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inventory
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Product
          </button>
          <div className="flex space-x-4">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>

      {/* Image Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Product Images</h2>

        {/* Upload Zone */}
        <div>
          <ImageUploadZone onFilesSelected={handleFilesSelected} maxFiles={10} />
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Uploading...</h3>
            {uploadProgress.map((progress, index) => (
              <UploadProgress key={index} {...progress} />
            ))}
          </div>
        )}

        {/* Image Gallery */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Uploaded Images ({images.length})
          </h3>
          <ImageGallery
            productId={productId}
            images={images}
            onImagesChange={fetchData}
          />
        </div>
      </div>
    </div>
  );
}
