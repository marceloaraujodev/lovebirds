import admin from 'firebase-admin';
import serviceAccount from './serviceAccount.json'
import path from 'path';
import fs from 'fs';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(process.env.SERVICE_ACCOUNT),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,  // Your Firebase Storage bucket URL
  });
}

// Now Firebase is initialized, and you can use the services.
const bucket = admin.storage().bucket();


export const uploadPhotosToFirebase = async (photosArray, hash) => {
  const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp', 'uploads');
  const uploadedPhotoURLs = [];

  // Create folder path based on hash
  const folderPath = `purchases/${hash}`;  // Each purchase will have its own folder

  for (const fileName of photosArray) {
    const filePath = path.join(TEMP_UPLOAD_DIR, fileName);

    try {
      // Upload file to Firebase
      const file = bucket.file(`${folderPath}/${fileName}`);
      await file.save(fs.readFileSync(filePath));

      // Make the file public
      await file.makePublic();

      // Construct file URL in Firebase
      const fileURL = file.publicUrl(); // Automatically gets the public URL
      uploadedPhotoURLs.push(fileURL);

      // Optionally delete the file locally after uploading
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error uploading photo to Firebase:', error);
    }
  }


  return uploadedPhotoURLs;  // Return the URLs of uploaded photos
};
