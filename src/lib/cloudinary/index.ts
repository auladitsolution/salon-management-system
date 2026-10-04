// ==============================================================================
// CLOUDINARY MEDIA ASSET MANAGEMENT
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryFolder =
  | "salon/branding"
  | "salon/services"
  | "salon/staff"
  | "salon/gallery"
  | "salon/products"
  | "salon/receipts";

export interface UploadOptions {
  folder: CloudinaryFolder;
  publicId?: string;
  tags?: string[];
}

/**
 * Uploads a base64 or remote URL string securely to Cloudinary.
 */
export async function uploadImageToCloudinary(
  fileBase64OrUrl: string,
  options: UploadOptions
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileBase64OrUrl,
      {
        folder: options.folder,
        public_id: options.publicId,
        tags: options.tags,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve(result);
      }
    );
  });
}

/**
 * Deletes an image from Cloudinary by public ID.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
    return false;
  }
}

export { cloudinary };
