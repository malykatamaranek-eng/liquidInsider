# Product Image Upload System - Documentation

## Overview

This system provides comprehensive image upload, management, and optimization capabilities for product listings. It supports both local storage and AWS S3, with automatic image processing and multiple size generations.

## Features

### Backend Features
- ✅ Multiple image upload support
- ✅ Automatic image resizing (thumbnail, medium, large)
- ✅ WebP format conversion for optimization
- ✅ AWS S3 integration with local fallback
- ✅ File validation (type, size, MIME)
- ✅ Metadata and EXIF stripping
- ✅ Image compression (configurable quality)
- ✅ Primary image designation
- ✅ Image reordering capability
- ✅ Secure file naming (UUID-based)
- ✅ Authentication and authorization

### Frontend Features
- ✅ Drag & drop upload interface
- ✅ Multiple file selection
- ✅ Real-time preview thumbnails
- ✅ Upload progress indicators
- ✅ Image gallery view
- ✅ Set primary image
- ✅ Delete images with confirmation
- ✅ Responsive design

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Storage Type (local or s3)
IMAGE_STORAGE_TYPE=local

# Image Settings
MAX_IMAGE_SIZE=5242880        # 5MB in bytes
IMAGE_QUALITY=90              # JPEG/WebP quality (1-100)
UPLOAD_DIR=./uploads/products

# Image Dimensions
THUMBNAIL_WIDTH=150
THUMBNAIL_HEIGHT=150
MEDIUM_WIDTH=500
MEDIUM_HEIGHT=500
LARGE_WIDTH=1000
LARGE_HEIGHT=1000

# AWS S3 (required if IMAGE_STORAGE_TYPE=s3)
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_CDN_URL=https://cdn.example.com  # Optional
```

## API Endpoints

### Upload Images
```
POST /api/products/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: FormData with 'images' field (up to 10 files)

Response:
{
  "success": true,
  "message": "2 image(s) uploaded successfully",
  "data": [
    {
      "id": "clx...",
      "productId": "prod_123",
      "originalUrl": "/uploads/products/prod_123/original/abc-123.jpg",
      "thumbnailUrl": "/uploads/products/prod_123/thumbnail/abc-123.jpg",
      "mediumUrl": "/uploads/products/prod_123/medium/abc-123.jpg",
      "largeUrl": "/uploads/products/prod_123/large/abc-123.jpg",
      "webpUrl": "/uploads/products/prod_123/webp/abc-123.webp",
      "fileName": "abc-123.jpg",
      "fileSize": 2048576,
      "mimeType": "image/jpeg",
      "width": 2000,
      "height": 1500,
      "isPrimary": true,
      "displayOrder": 0,
      "createdAt": "2026-02-01T10:30:00Z"
    }
  ]
}
```

### Get Product Images
```
GET /api/products/:id/images

Response:
{
  "success": true,
  "data": [...]
}
```

### Delete Image
```
DELETE /api/products/:id/images/:imageId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### Reorder Images
```
PUT /api/products/:id/images/reorder
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "imageOrders": [
    { "imageId": "img1", "displayOrder": 0 },
    { "imageId": "img2", "displayOrder": 1 }
  ]
}

Response:
{
  "success": true,
  "message": "Images reordered successfully",
  "data": [...]
}
```

### Set Primary Image
```
PUT /api/products/:id/images/:imageId/primary
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Primary image updated successfully"
}
```

## Frontend Usage

### Using the Components

```tsx
import ImageUploadZone from '@/components/ImageUploadZone';
import ImageGallery from '@/components/ImageGallery';
import UploadProgress from '@/components/UploadProgress';
import { imageAPI } from '@/lib/api';

function ProductImageManager({ productId }) {
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);

  const handleFilesSelected = async (files: File[]) => {
    try {
      await imageAPI.uploadImages(productId, files);
      // Refresh images
      const result = await imageAPI.getProductImages(productId);
      setImages(result.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <ImageUploadZone onFilesSelected={handleFilesSelected} maxFiles={10} />
      
      {uploadProgress.length > 0 && (
        <div>
          {uploadProgress.map((p, i) => (
            <UploadProgress key={i} {...p} />
          ))}
        </div>
      )}

      <ImageGallery
        productId={productId}
        images={images}
        onImagesChange={() => fetchImages()}
      />
    </div>
  );
}
```

## Storage Structure

### Local Storage
```
uploads/
└── products/
    └── {product-id}/
        ├── original/
        │   └── {uuid}.jpg
        ├── thumbnail/
        │   └── {uuid}.jpg
        ├── medium/
        │   └── {uuid}.jpg
        ├── large/
        │   └── {uuid}.jpg
        └── webp/
            └── {uuid}.webp
```

### S3 Storage
```
s3://bucket-name/
└── products/
    └── {product-id}/
        ├── original/{uuid}.jpg
        ├── thumbnail/{uuid}.jpg
        ├── medium/{uuid}.jpg
        ├── large/{uuid}.jpg
        └── webp/{uuid}.webp
```

## Database Schema

```prisma
model ProductImage {
  id           String   @id @default(uuid())
  productId    String
  product      Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  originalUrl  String
  thumbnailUrl String
  mediumUrl    String
  largeUrl     String
  webpUrl      String
  
  fileName     String
  fileSize     Int
  mimeType     String
  
  width        Int
  height       Int
  
  s3Key        String?
  storageType  String   @default("local")
  
  displayOrder Int      @default(0)
  isPrimary    Boolean  @default(false)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([productId])
  @@index([isPrimary])
  @@map("product_images")
}
```

## Security Features

1. **File Type Validation**: Only JPEG, PNG, WebP, and GIF files are accepted
2. **File Size Limits**: Configurable maximum file size (default 5MB)
3. **MIME Type Verification**: Server-side validation of file types
4. **Authentication Required**: All upload/delete operations require authentication
5. **Admin-Only Access**: Only admin users can manage product images
6. **Secure File Naming**: UUID-based filenames prevent directory traversal
7. **Metadata Stripping**: EXIF data and metadata removed for privacy
8. **CORS Configuration**: Proper CORS setup for image serving

## Image Processing

### Automatic Optimizations
- **Resizing**: Images resized to multiple predefined dimensions
- **Format Conversion**: WebP versions created for better compression
- **Quality Compression**: JPEG/WebP quality set to 90% (configurable)
- **Metadata Removal**: EXIF and other metadata stripped
- **Aspect Ratio Preservation**: Images resized without distortion

### Size Variants
- **Thumbnail**: 150x150px - for gallery thumbnails
- **Medium**: 500x500px - for product cards
- **Large**: 1000x1000px - for product detail pages
- **WebP**: 1000x1000px - optimized format for modern browsers
- **Original**: Full-size JPEG preserved

## Performance Considerations

1. **Memory Storage**: Multer uses memory storage for processing before saving
2. **Stream Processing**: Sharp processes images efficiently
3. **Parallel Processing**: Multiple images processed concurrently
4. **CDN Ready**: S3 URLs can be easily swapped with CloudFront
5. **Lazy Loading**: Frontend should implement lazy loading for images
6. **Caching Headers**: Static files served with appropriate cache headers

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| "File too large" | File exceeds MAX_IMAGE_SIZE | Reduce image size before upload |
| "Invalid file type" | Non-image file uploaded | Only upload JPEG, PNG, WebP, GIF |
| "Product not found" | Invalid product ID | Verify product exists |
| "S3 client not initialized" | S3 config missing | Set AWS environment variables |
| "Failed to delete file" | File system permissions | Check directory permissions |

## Troubleshooting

### Images Not Uploading
1. Check file size is under limit
2. Verify file format is supported
3. Check authentication token is valid
4. Verify admin role permissions

### Images Not Displaying
1. Check IMAGE_STORAGE_TYPE matches actual storage
2. Verify uploads directory has proper permissions
3. Check Express static file serving is configured
4. Verify CORS settings for images

### S3 Upload Failures
1. Verify AWS credentials are correct
2. Check bucket permissions
3. Verify S3 bucket region matches AWS_S3_REGION
4. Check network connectivity to AWS

## Migration from Local to S3

To migrate existing local images to S3:

1. Set up S3 bucket and credentials
2. Update IMAGE_STORAGE_TYPE to "s3"
3. Run a migration script to:
   - Upload existing local files to S3
   - Update database records with S3 URLs
   - Update storageType field

## Future Enhancements

- [ ] Real-time upload progress tracking (currently simulated)
- [ ] Image cropping tool before upload
- [ ] Bulk image operations
- [ ] Image dimension validation
- [ ] ClamAV virus scanning integration
- [ ] Background job queue for processing
- [ ] Image CDN integration (CloudFront)
- [ ] Automatic image optimization suggestions
- [ ] Support for additional formats (AVIF)
- [ ] Image versioning and rollback

## Support

For issues or questions:
1. Check this documentation
2. Review environment variables
3. Check logs for specific errors
4. Verify file permissions
5. Test with minimal example

## License

MIT License - See LICENSE file for details
