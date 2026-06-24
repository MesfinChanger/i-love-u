'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useStorage } from '../provider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import React from 'react';

/**
 * @fileOverview Hook for Google Cloud Storage operations.
 * Optimized for high-performance resumable uploads mirroring high-resilience Dart logic.
 * Includes descriptive diagnostic feedback for setup ripples.
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
      // Use uploadBytesResumable for high network resilience
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          // Precise byte-accurate progress calculation
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (err: any) => {
          setError(err);
          setIsUploading(false);
          
          // Enhanced Diagnostic Protocol
          if (err.code === 'storage/unknown' || err.message?.toLowerCase().includes('permission') || err.message?.toLowerCase().includes('cors')) {
            toast({
              variant: "destructive",
              title: "Storage Configuration Ripple",
              description: "Mission Control requires Rules & CORS setup for web uploads. See docs/FIREBASE_SETUP.md for the fix. ❤️",
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

  return { uploadFile, isUploading, progress, error };
}