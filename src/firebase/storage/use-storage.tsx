'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, uploadString } from 'firebase/storage';
import { useStorage } from '../provider';

/**
 * @fileOverview Hook for Google Cloud Storage operations.
 * Optimized for resilience and real-time progress tracking.
 */
export function useFirebaseStorage() {
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (path: string, file: File | string, type: 'string' | 'file' = 'file'): Promise<string> => {
    if (!storage) {
      console.error("Firebase Storage Ripple: Storage instance is null.");
      throw new Error("Storage not initialized.");
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    const storageRef = ref(storage, path);

    return new Promise((resolve, reject) => {
      if (type === 'string' && typeof file === 'string') {
        const format = file.startsWith('data:image/') ? 'data_url' : 'base64';
        uploadString(storageRef, file, format).then(async () => {
          setProgress(100);
          const url = await getDownloadURL(storageRef);
          setIsUploading(false);
          resolve(url);
        }).catch(err => {
          setError(err);
          setIsUploading(false);
          reject(err);
        });
      } else if (file instanceof File) {
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Snapshot Event Listener (Parity with Dart logic)
        uploadTask.on('state_changed',
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(p);
          },
          (err) => {
            setError(err);
            setIsUploading(false);
            reject(err);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setIsUploading(false);
            resolve(url);
          }
        );
      } else {
        setIsUploading(false);
        reject(new Error("Invalid file format for upload."));
      }
    });
  };

  return { uploadFile, isUploading, progress, error };
}
