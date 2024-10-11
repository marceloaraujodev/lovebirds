import firebaseInit from "./firebaseInit";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase
firebaseInit();

const uploadQRCodeToFireBase = async (base64QRCode, hash, name) => {
  try {
    // Remove the 'data:image/png;base64,' prefix and convert base64 to a buffer
    const base64Data = base64QRCode.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'image/png' });

    // Get a reference to the storage service
    const storage = getStorage();
    
    // Create a storage reference / folder name on firebase
    const storageRef = ref(storage, `purchases/${name}-${hash}/qrcode.png`);

    // Upload the Blob to Firebase Storage
    await uploadBytes(storageRef, blob, {
      contentType: 'image/png',
    });

    // Get the download URL after upload
    const qrCodeUrl = await getDownloadURL(storageRef);
    console.log(`File uploaded successfully: ${qrCodeUrl}`);
    
    return qrCodeUrl; // Return the public URL of the uploaded QR code

  } catch (error) {
    console.error('Error uploading QR code:', error);
    throw new Error('Failed to upload QR code'); // Handle error appropriately
  }
};

export default uploadQRCodeToFireBase;
