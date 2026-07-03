import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFileToCloudinary(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ url: string; key: string }> {
  return new Promise((resolve, reject) => {
    // Cloudinary detects resource_type automatically for 'image' and 'video'
    // 'auto' works best for multiple types
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'storm-calisthenics',
        resource_type: 'auto',
        public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            key: result.public_id,
          });
        } else {
          reject(new Error('Unknown upload error'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteFileFromCloudinary(key: string): Promise<void> {
  // Try deleting as an image first, if you know the type you should pass it
  await cloudinary.uploader.destroy(key, { resource_type: 'image' });
  await cloudinary.uploader.destroy(key, { resource_type: 'video' });
}

export function validateFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

export function validateFileSize(size: number, maxSizeMB: number): boolean {
  return size <= maxSizeMB * 1024 * 1024;
}
