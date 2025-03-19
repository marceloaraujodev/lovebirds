import firebaseInit from "./firebaseInit";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

// Initialize Firebase
firebaseInit();

export default async function uploadImages(filesArray, hash, name) {
  // console.log('files in the uploadImages function-------', filesArray)

  const storage = getStorage(); // Initialize storage
  // works with a file image object
  const uploadPromises = filesArray.map((file, index) => {
    // For each file, create a storage reference

    const uniqueFileName = `${Date.now()}`;

    // removed the encodding uri since the hash is unique
    const encodedFolderPath = `purchases/${hash}/${uniqueFileName}`;
    
    const storageRef = ref(storage, encodedFolderPath);
    // const storageRef = ref(storage, `purchases/${name}-${hash}/${uniqueFileName}`);
    
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log(`Upload is ${progress}% done for file: ${file.name}`);
        }, 
        reject, 
        () => {
          // Get the download URL once the upload is complete
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              // console.log(`File uploaded successfully: ${downloadURL}`);
              resolve(downloadURL);
            })
            .catch(reject);
        });
    });
  });

  // Wait for all uploads to complete and return the array of URLs
  return Promise.all(uploadPromises);
}