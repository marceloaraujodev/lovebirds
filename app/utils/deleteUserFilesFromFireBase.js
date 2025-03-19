import firebaseInit from "./firebaseInit";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";

// Initialize Firebase
firebaseInit();

const storage = getStorage();

export async function deleteFileByUrl(fileUrl) {
  try {
    if (!fileUrl) {
      console.log("Invalid input: missing file URL.");
      return { message: "Invalid input" };
    }

    // Extract the file path from the Firebase URL
    const decodedUrl = decodeURIComponent(fileUrl);
    const match = decodedUrl.match(/o\/(.*?)\?alt=media/);

    if (!match || !match[1]) {
      console.error("Invalid Firebase Storage URL format.");
      return { message: "Invalid Firebase URL format" };
    }

    const filePath = match[1]; // Extracted file path
    console.log(`Extracted file path: ${filePath}`);

    // Delete the file from Firebase Storage
    await deleteObject(ref(storage, filePath));

    console.log(`File deleted: ${filePath}`);
    return { message: "File deleted successfully", filePath };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { error: error.message };
  }
}
