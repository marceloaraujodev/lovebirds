import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Ensure Firebase is initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(process.env.SERVICEACCOUNT), // Replace with your service account
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
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