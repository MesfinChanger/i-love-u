import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';

/**
 * @fileOverview Mission Protocol: Storage Logic for I Love U Mobile (Flutter).
 * This logic provides real-time feedback to members during media sharing.
 */

void uploadFileWithProgress(File file) {
  // 1. Create a reference pointing to your upload path
  final storageRef = FirebaseStorage.instance
      .ref()
      .child('uploads/${DateTime.now().millisecondsSinceEpoch}_${file.path.split('/').last}');
  
  // 2. Start the upload task (Resumable)
  final uploadTask = storageRef.putFile(file);
  
  // 3. Listen to the stream of snapshot events to monitor progress
  uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
    switch (snapshot.state) {
      case TaskState.running:
        // Calculate progress percentage for visual feedback
        final double progress = 100.0 * (snapshot.bytesTransferred / snapshot.totalBytes);
        print("I Love U: Upload is ${progress.toStringAsFixed(2)}% complete.");
        break;
      case TaskState.paused:
        print("I Love U: Upload is paused.");
        break;
      case TaskState.canceled:
        print("I Love U: Upload has been canceled.");
        break;
      case TaskState.error:
        print("I Love U: Upload encountered an error.");
        break;
      case TaskState.success:
        print("I Love U: Upload successfully completed!");
        // Retrieve the secure URL for Firestore recording
        storageRef.getDownloadURL().then((url) => print("Secured File URL: $url"));
        break;
    }
  }, onError: (Object e) {
    print("I Love U: Error during upload task: $e");
  });
}
