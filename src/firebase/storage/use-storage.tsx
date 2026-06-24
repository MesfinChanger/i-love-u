'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useStorage } from '../provider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import React from 'react';

/**
 * @fileOverview Hook for Google Cloud Storage operations.
 * Optimized for high-performance resumable uploads and secure deletions.
 */
export function useFirebaseStorage() {
  const storage = useStorage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (path: string, file: File | Blob | string): Promise<string> => {
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
        (err: any) => {
          setError(err);
          setIsUploading(false);
          
          if (err.code === 'storage/unknown' || err.message?.toLowerCase().includes('permission') || err.message?.toLowerCase().includes('cors')) {
            toast({
              variant: "destructive",
              title: "Storage Configuration Ripple",
              description: "Mission Control requires Rules & CORS setup for web uploads. ❤️",
              action: (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px] font-black uppercase" 
                  onClick={() => window.open('https://console.firebase.google.com/')}
                >
                  Setup Now
                </Button>
              )
            });
          }
          
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

  /**
   * Securely deletes a file from the cloud bridge.
   * Handles both storage paths and full download URLs.
   */
  const deleteFile = async (pathOrUrl: string): Promise<void> => {
    if (!storage || !pathOrUrl) return;
    try {
      // ref() intelligently handles full URLs
      const storageRef = ref(storage, pathOrUrl);
      await deleteObject(storageRef);
    } catch (err: any) {
      if (err.code !== 'storage/object-not-found') {
        console.warn("I Love U: Storage deletion ripple:", err);
      }
    }
  };

  return { uploadFile, deleteFile, isUploading, progress, error };
}
