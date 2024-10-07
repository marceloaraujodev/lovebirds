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

    // Check if there are items to delete
    if (result.items.length === 0) {
      console.log(`No files found in the folder: ${folderRef}`);
      return; // Exit early if no files to delete
    }

    //delete each file in the hash folder
    const deletePromises = result.items.map(async (itemRef) => {
      try {
        await deleteObject(itemRef);
        console.log(`Deleted file: ${itemRef.name}`);
      } catch (error) {
        console.error(`Error deleting file ${itemRef.name}:`, error);
      }
    });

    await Promise.all(deletePromises);
    console.log('All files from hash folder deleted successfully');
  } catch (error) {
    console.error('Error deleting folder contents:', error);
  }
}