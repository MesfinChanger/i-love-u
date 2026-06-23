'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Video, 
  StopCircle, 
  RefreshCw, 
  Check, 
  X, 
  Loader2, 
  PlayCircle,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Accessible Live Media Capture Component.
 * Optimized for screen readers and high-fidelity feedback.
 */
interface LiveCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (data: { url: string; file: File; type: 'image' | 'video' }) => void;
}

export function LiveCamera({ isOpen, onClose, onCapture }: LiveCameraProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedMedia, setCapturedMedia] = useState<{ url: string; file: File; type: 'image' | 'video' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startStream = useCallback(async () => {
    stopStream();
    setIsLoading(true);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions to capture live moments. ❤️"
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stopStream, toast, onClose]);

  useEffect(() => {
    if (isOpen && !capturedMedia) {
      startStream();
    }
    return () => stopStream();
  }, [isOpen, startStream, stopStream, capturedMedia]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'image/jpeg' });
      const file = new File([blob], `live-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      setCapturedMedia({ url: dataUrl, file, type: 'image' });
      stopStream();
      toast({ title: "Photo Captured", description: "Review your moment before sharing. ✨" });
    }
  };

  const startRecording = () => {
    if (!stream) return;
    
    setRecordedChunks([]);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
      const url = URL.createObjectURL(blob);
      const extension = mediaRecorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
      const file = new File([blob], `live-video-${Date.now()}.${extension}`, { type: mediaRecorder.mimeType });
      
      setCapturedMedia({ url, file, type: 'video' });
      toast({ title: "Video Captured", description: "Review your video before sharing. ✨" });
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopStream();
    }
  };

  const handleSend = () => {
    if (capturedMedia) {
      onCapture(capturedMedia);
      resetCamera();
      onClose();
    }
  };

  const resetCamera = () => {
    setCapturedMedia(null);
    setRecordedChunks([]);
    setIsRecording(false);
    startStream();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-black">
        <DialogHeader className="absolute top-0 left-0 right-0 z-30 p-6 bg-gradient-to-b from-black/60 to-transparent flex flex-row items-center justify-between text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
             </div>
             <div>
                <DialogTitle className="text-white text-lg font-black tracking-tighter uppercase leading-none">
                  {capturedMedia ? 'Review Moment' : 'Live Camera'}
                </DialogTitle>
                <p className="text-[9px] text-white/60 font-black uppercase tracking-[0.2em] mt-1">High-Impact Protocol</p>
             </div>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={onClose} aria-label="Close Camera">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="relative aspect-[3/4] bg-slate-900 flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-white/40" role="status" aria-label="Opening camera bridge">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest">Opening Bridge...</p>
            </div>
          )}

          {!capturedMedia ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={cn("w-full h-full object-cover", facingMode === 'user' && "scale-x-[-1]")}
              aria-label="Live camera preview"
            />
          ) : (
            <div className="w-full h-full" role="region" aria-label="Media preview">
              {capturedMedia.type === 'image' ? (
                <img src={capturedMedia.url} className="w-full h-full object-cover" alt="Captured moment" />
              ) : (
                <video src={capturedMedia.url} controls className="w-full h-full object-cover" autoPlay loop aria-label="Captured video" />
              )}
            </div>
          )}

          {isRecording && (
            <div className="absolute top-24 left-6 flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full animate-pulse z-20" role="status" aria-label="Recording in progress">
               <div className="w-2 h-2 bg-white rounded-full" />
               <span className="text-[10px] text-white font-black uppercase tracking-widest">Recording</span>
            </div>
          )}
        </div>

        <div className="p-8 bg-black/90 backdrop-blur-xl border-t border-white/5 flex flex-col gap-6">
          {!capturedMedia ? (
            <div className="flex items-center justify-around w-full">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleCamera} 
                className="w-14 h-14 rounded-full bg-white/5 text-white hover:bg-white/10"
                aria-label="Switch Camera"
              >
                <RefreshCw className="w-6 h-6" />
              </Button>

              <div className="flex items-center gap-6">
                 <Button 
                  onClick={takePhoto} 
                  disabled={isLoading || isRecording}
                  className="w-20 h-20 rounded-full bg-white border-[6px] border-white/30 p-0 active:scale-90 transition-transform group"
                  aria-label="Take Photo"
                 >
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-slate-900 group-hover:scale-95 transition-transform">
                       <Camera className="w-8 h-8" />
                    </div>
                 </Button>

                 <Button 
                  onClick={isRecording ? stopRecording : startRecording} 
                  disabled={isLoading}
                  className={cn(
                    "w-20 h-20 rounded-full p-0 active:scale-90 transition-all border-[6px]",
                    isRecording ? "bg-red-500 border-red-500/30" : "bg-primary border-primary/30"
                  )}
                  aria-label={isRecording ? "Stop Recording" : "Start Video Recording"}
                 >
                    <div className={cn(
                      "w-full h-full rounded-full flex items-center justify-center text-white",
                      isRecording ? "bg-red-500" : "bg-primary"
                    )}>
                       {isRecording ? <StopCircle className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                    </div>
                 </Button>
              </div>

              <div className="w-14 h-14" />
            </div>
          ) : (
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={resetCamera} 
                className="flex-1 h-16 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10"
                aria-label="Retake moment"
              >
                <X className="w-4 h-4 mr-2" /> Retake
              </Button>
              <Button 
                onClick={handleSend} 
                className="flex-1 h-16 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20"
                aria-label="Share this moment"
              >
                <Check className="w-4 h-4 mr-2" /> Share Moment
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 opacity-20">
             <ShieldCheck className="w-3.5 h-3.5 text-white" />
             <p className="text-[8px] text-white font-black uppercase tracking-[0.3em]">Secured Live Protocol • Respect is Mandatory</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
