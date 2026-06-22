
import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';

/**
 * @fileOverview Universal Resumable Upload Logic for Flutter.
 * This handles network drops gracefully and provides real-time progress.
 */
Future<void> uploadFileWithResumableTask(File compressedFile) async {
  final storageRef = FirebaseStorage.instance
      .ref()
      .child('uploads/${DateTime.now().millisecondsSinceEpoch}.mp4');

  // putFile handles network drops much better than putData or putString
  UploadTask uploadTask = storageRef.putFile(compressedFile);

  uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
    double progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    print("Upload is ${progress.toStringAsFixed(1)}% done");
  }, onError: (e) {
    print("Resumable Upload Ripple: $e");
  });

  await uploadTask;
  print("Media secured to mission cloud. ❤️");
}
