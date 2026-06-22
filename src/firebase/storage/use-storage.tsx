
'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useStorage } from '../provider';

/**
 * @fileOverview Hook for Google Cloud Storage operations.
 * Optimized for high-performance resumable uploads and real-time progress tracking.
 * Mirroring Universal Resumable Protocol for parity with I Love U Mobile logic.
 */
export function useFirebaseStorage() {
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Uploads a file or data URL to the specified path with real-time resumable progress.
   * @param path The destination path in the storage bucket.
   * @param file The File object or Base64/Data URL string to upload.
   */
  const uploadFile = async (path: string, file: File | string): Promise<string> => {
    if (!storage) {
      console.warn("I Love U: Storage instance ripple. Initializing...");
      throw new Error("Storage not initialized.");
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    const storageRef = ref(storage, path);
    let blob: Blob;

    try {
      if (typeof file === 'string') {
        // High-performance conversion of Data URL to Blob for resumable progress support
        const response = await fetch(file);
        blob = await response.blob();
      } else {
        blob = file;
      }
    } catch (e) {
      setIsUploading(false);
      throw new Error("Failed to process media for upload.");
    }

    return new Promise((resolve, reject) => {
      // Use uploadBytesResumable to track progress snapshots, exactly like the Dart blueprint
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Monitor the progress in real-time
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (err) => {
          setError(err);
          setIsUploading(false);
          reject(err);
        },
        async () => {
          // Retrieve the download URL upon success
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setProgress(100);
          setIsUploading(false);
          resolve(url);
        }
      );
    });
  };

  return { uploadFile, isUploading, progress, error };
}
