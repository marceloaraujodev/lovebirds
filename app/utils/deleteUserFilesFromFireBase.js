import firebaseInit from "./firebaseInit";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";

// Initialize Firebase
firebaseInit();

const storage = getStorage();

export async function deleteFolderContents(name, hash) {
  const folderPath = `purchases/${name}-${hash}/`; // Path to the pseudo-folder
  const folderRef = ref(storage, folderPath);

  try {
    const listResult = await listAll(folderRef); // Get all items inside the folder

    // // Loop through all files and delete them
    // const deletePromises = listResult.items.map((fileRef) => deleteObject(fileRef));

    // // Wait for all deletions to complete
    // await Promise.all(deletePromises);

    console.log(`All files in ${folderPath} deleted successfully.`);
    return {
      message: "Folder contents deleted successfully",
      listResult
     };
  } catch (error) {
    console.error("Error deleting folder contents:", error);
    return { error: error.message };
  }
}

