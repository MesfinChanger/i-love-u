'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useStorage } from '../provider';

/**
 * @fileOverview Hook for Google Cloud Storage operations.
 * Optimized for high-performance resumable uploads mirroring Dart logic.
 */
export function useFirebaseStorage() {
  const storage = useStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (path: string, file: File | string): Promise<string> => {
    if (!storage) throw new Error("Storage not initialized.");
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const storageRef = ref(storage, path);
    let blob: Blob;

    if (typeof file === 'string') {
      const response = await fetch(file);
      blob = await response.blob();
    } else {
      blob = file;
    }

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);
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
          setProgress(100);
          setIsUploading(false);
          resolve(url);
        }
      );
    });
  };

  return { uploadFile, isUploading, progress, error };
}
