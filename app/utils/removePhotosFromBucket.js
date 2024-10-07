import firebaseInit from "./firebaseInit";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';


// Initialize Firebase
firebaseInit();

export async function removePhotosFromBucket(hash){
  const storage = getStorage();
  const folderRef = ref(storage, `purchase/${hash}`);

  try {
    // list all items in the hash folder
    const result = await listAll(folderRef);

    //delete each file in the hash folder
    const deletePromises = result.items.map((itemRef) => {
      return deleteObject(itemRef)
    })

    await Promise.all(deletePromises);
    console.log('All files from hash folder deleted successfully');
  } catch (error) {
    console.error('Error deleting folder contents:', error);
  }
}