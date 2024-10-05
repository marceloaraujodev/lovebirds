import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Ensure Firebase is initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Replace escaped newlines
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,  // Your Firebase Storage bucket URL
    databaseURL: "https://your-project-id.firebaseio.com",  // Replace with your actual database URL
  });
}

const bucket = admin.storage().bucket();

// Function to upload QR code in webhook
const uploadQRCodeToFireBase = async (base64QRCode, hash) => {
  try {
    // const folderPath = `purchases/${hash}`;
    // const file = bucket.file(`${folderPath}/qrcode.png`);

    // Remove the 'data:image/png;base64,' prefix and convert base64 to a buffer
    const base64Data = base64QRCode.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Define file path within Firebase Storage (you can organize it by folder/hash)
    // const file = bucket.file(`qrcodes/${qrCodeFileName}`);
    const folderPath = `purchases/${hash}`;
    const file = bucket.file(`${folderPath}/qrcode.png`);

    // Upload the buffer to Firebase
    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
      },
    });

    // Make the QR code file public and get the public URL
    await file.makePublic();
    const qrCodeUrl = file.publicUrl();
    
    return qrCodeUrl; // Return the public URL of the uploaded QR code

  } catch (error) {
    console.error('Error uploading QR code:', error);
    throw new Error('Failed to upload QR code'); // Handle error appropriately
  }
};

export default uploadQRCodeToFireBase;