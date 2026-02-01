'use client';

import { useState } from 'react';
import ImagePreview from './ImagePreview';
import { imageAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface ProductImage {
  id: string;
  thumbnailUrl: string;
  mediumUrl: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  isPrimary: boolean;
  displayOrder: number;
}

interface ImageGalleryProps {
  productId: string;
  images: ProductImage[];
  onImagesChange: () => void;
}

export default function ImageGallery({
  productId,
  images,
  onImagesChange,
}: ImageGalleryProps) {
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeletingImageId(imageId);
    try {
      await imageAPI.deleteImage(productId, imageId);
      toast.success('Image deleted successfully');
      onImagesChange();
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await imageAPI.setPrimaryImage(productId, imageId);
      toast.success('Primary image updated');
      onImagesChange();
    } catch (error) {
      console.error('Failed to set primary image:', error);
      toast.error('Failed to set primary image');
    }
  };

  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <p className="text-gray-500">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImagePreview
          key={image.id}
          image={image}
          onDelete={handleDelete}
          onSetPrimary={handleSetPrimary}
          isDeleting={deletingImageId === image.id}
        />
      ))}
    </div>
  );
}
