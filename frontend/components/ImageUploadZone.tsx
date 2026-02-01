'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface ImageUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

export default function ImageUploadZone({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 5242880, // 5MB
}: ImageUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((file) => {
          file.errors.forEach((error: any) => {
            if (error.code === 'file-too-large') {
              toast.error(`File ${file.file.name} is too large. Max size: ${maxSize / 1024 / 1024}MB`);
            } else if (error.code === 'file-invalid-type') {
              toast.error(`File ${file.file.name} has invalid type. Only images are allowed.`);
            } else {
              toast.error(`Error with file ${file.file.name}: ${error.message}`);
            }
          });
        });
      }

      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected, maxSize]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxFiles,
    maxSize,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg
          className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isDragActive ? (
          <p className="text-lg font-medium text-blue-600">Drop the files here...</p>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700">
              Drag &amp; drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Up to {maxFiles} images, max {maxSize / 1024 / 1024}MB each
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: JPEG, PNG, WebP, GIF
            </p>
          </>
        )}
      </div>
    </div>
  );
}
