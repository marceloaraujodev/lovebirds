import firebaseInit from "./firebaseInit";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, listAll } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

// Initialize Firebase
firebaseInit();

export async function addPhotoToBucket(files, folderPath, name) {
  try {
    if (!files || files.length === 0) {
      throw new Error("No file provided for upload.");
    }
    console.log(folderPath)
    const validPhotos = [];
    const maxSize = 900 * 1024;
  
    // checks size of files if biggern than 1.5mb alerts and clears previews else add to preview
    for (let file of files) {
      if (file.size > maxSize) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Set the max size limit in MB
          maxWidthOrHeight: 1920, // Optionally resize image
          useWebWorker: true, // Enable multi-threading for faster compression
        });

  
        // const objectUrl = URL.createObjectURL(compressedFile);
        validPhotos.push(compressedFile);
        // previews.push(objectUrl);
      } else {
        // const objecUrl = URL.createObjectURL(file);
        validPhotos.push(file);
        // previews.push(objecUrl);
      }
    }
  
    const storage = getStorage(); // Initialize storage
  
    
    
    // console.log('bucket before files upload:', listFilesInBucket(folderPath));
    // Upload all valid photos and get their URLs
    const uploadPromises = validPhotos.map((file) => {
      // const storageRef = ref(storage, 'purchases/Fernanda Patricia da Silva-04d946a5-df1c-47cb-8505-5804f231670d')
      const uniqueFileName = `2-${Date.now()}-Fernanda Patricia da Silva`;
      const fileRef = ref(storage, `${folderPath}/${uniqueFileName}`);
      console.log('this is storage: ', storage);

  
      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(fileRef, file);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log(`Upload is ${progress}% done for file: ${file.name}`);
          },
          (error) => {
            console.error("Error uploading file:", error);
            reject(error);
          },
          () => {
            // Get the download URL once the upload is complete
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log(`File uploaded successfully: ${downloadURL}`);
                resolve(downloadURL); // Resolve the URL
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
                reject(error);
              });
          }
        );
      });
    });
  
  
    // console.log('bucket after files upload: ', listFilesInBucket(folderPath));
    // Wait for all uploads to complete and return an array of URLs
    
    return Promise.all(uploadPromises);
    
  } catch (error) {
    console.log(error.message)
  }
}



// Function to list files in the folder
export async function listFilesInBucket(folderPath) {
  try {
    const storage = getStorage();
    const folderRef = ref(storage, folderPath);

    // List all items (files and directories) in the folder
    const res = await listAll(folderRef);

    // Get the download URLs for each file
    const fileUrls = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return url; // Return URL of the image
      })
    );

    console.log('Files in bucket:', fileUrls);
    return fileUrls;
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
}