/**
 * @fileOverview High-performance client-side image processing.
 * Optimized for HD distribution with 1080px ceiling and 0.65 quality.
 */

/**
 * Compresses and resizes an image file using the Canvas API.
 * @param file The original File from an input or camera.
 * @param quality A value between 0 and 1 (0.65 matches the mobile team's target for 80% compression).
 * @param maxWidth The maximum width of the image (default 1080).
 * @param maxHeight The maximum height of the image (default 1080).
 */
export async function compressImage(
  file: File, 
  quality: number = 0.65, 
  maxWidth: number = 1080, 
  maxHeight: number = 1080
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;

        // Optimized HD Scaling Protocol (1080px Ceiling)
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
    };
    reader.onerror = (e) => reject(e);
  });
}

/**
 * Utility to convert a File to a Data URI for AI moderation.
 */
export const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
