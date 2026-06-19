'use client';

import { useState } from 'react';
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useStorage } from '../provider';

/**
 * @fileOverview Hook for Google Cloud Storage operations.
 */
export function useFirebaseStorage() {
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (path: string, file: File | string, type: 'string' | 'file' = 'file') => {
    if (!storage) {
      throw new Error("Storage not initialized. Check your Google Cloud config.");
    }

    setIsUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, path);
      
      if (type === 'string' && typeof file === 'string') {
        // Handle Base64 strings (data URLs)
        await uploadString(storageRef, file, 'data_url');
      } else if (file instanceof File) {
        await uploadBytes(storageRef, file);
      }

      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}
