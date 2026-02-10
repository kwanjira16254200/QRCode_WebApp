import { supabase } from '../config/supabase';
import { nanoid } from 'nanoid';

/**
 * Upload multiple images to Supabase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<string[]>} Array of public URLs
 */
export const uploadMultipleImages = async (files, userId) => {
  try {
    const uploadPromises = files.map(async (file) => {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${nanoid()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('qr-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('qr-images')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} url - Public URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (url) => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/qr-images/');
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL');
    }
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from('qr-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Supabase Storage
 * @param {string[]} urls - Array of public URLs to delete
 * @returns {Promise<void>}
 */
export const deleteMultipleImages = async (urls) => {
  try {
    const deletePromises = urls.map(url => deleteImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw error;
  }
};
