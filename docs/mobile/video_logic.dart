/**
 * @fileOverview High-speed video compression logic for the I Love U Mobile Branch.
 * This file serves as the gold standard for the Flutter development team.
 * Reaching every heart requires lightweight, mission-aligned media.
 */

import 'package:video_compress/video_compress.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';

/**
 * Compresses and uploads a video to Firebase Storage.
 * drasticaly reduces upload time for rural and mobile users.
 */
Future<void> compressAndUploadVideo(String sourcePath, String storagePath) async {
  // 1. Perform on-device compression to lower bitrate and optimized resolution
  MediaInfo? mediaInfo = await VideoCompress.compressVideo(
    sourcePath,
    quality: VideoQuality.DefaultQuality, // Optimized for mobile viewing
    deleteOrigin: false, 
    includeAudio: true,
  );

  if (mediaInfo != null && mediaInfo.file != null) {
    File compressedFile = mediaInfo.file!;
    
    // 2. Initialize Firebase Storage reference
    final storageRef = FirebaseStorage.instance.ref().child(storagePath);
    
    // 3. Start high-performance upload task
    final uploadTask = storageRef.putFile(compressedFile);
    
    // 4. Track progress (Mirroring the Universal Progress Protocol)
    uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
      final double progress = 100.0 * (snapshot.bytesTransferred / snapshot.totalBytes);
      print("I Love U: Video upload is ${progress.toStringAsFixed(2)}% secured.");
    });

    await uploadTask;
    print("I Love U: Respectful video moment secured successfully!");
  }
}
