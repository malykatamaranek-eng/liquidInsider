'use client';

import { X, Star } from 'lucide-react';
import { useState } from 'react';

interface ProductImage {
  id: string;
  thumbnailUrl: string;
  mediumUrl: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  isPrimary: boolean;
}

interface ImagePreviewProps {
  image: ProductImage;
  onDelete: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
  isDeleting?: boolean;
}

export default function ImagePreview({
  image,
  onDelete,
  onSetPrimary,
  isDeleting = false,
}: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square relative bg-gray-100">
        {!imageError ? (
          <img
            src={image.thumbnailUrl}
            alt={image.fileName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">Failed to load</p>
          </div>
        )}

        {/* Primary badge */}
        {image.isPrimary && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center space-x-1">
            <Star size={12} fill="currentColor" />
            <span>Primary</span>
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
          {!image.isPrimary && (
            <button
              onClick={() => onSetPrimary(image.id)}
              className="bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-1"
              title="Set as primary"
            >
              <Star size={14} />
              <span>Set Primary</span>
            </button>
          )}
          <button
            onClick={() => onDelete(image.id)}
            disabled={isDeleting}
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete image"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image info */}
      <div className="p-2 text-xs text-gray-600">
        <p className="truncate font-medium">{image.fileName}</p>
        <p className="text-gray-500">
          {image.width} × {image.height} • {(image.fileSize / 1024).toFixed(0)} KB
        </p>
      </div>
    </div>
  );
}
