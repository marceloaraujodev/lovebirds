import { NextResponse } from "next/server";
import firebaseInit from "@/app/utils/firebaseInit";
import { getStorage, ref, listAll } from "firebase/storage";

const app = await firebaseInit();
const storage = getStorage(app);

export async function GET() {
  try {
    // Reference the purchases directory
    const purchasesRef = ref(storage, 'purchases');
    
    const listResult = await listAll(purchasesRef);
    
    // Get all nested files (including subdirectories)
    const allFiles = await Promise.all(
      listResult.prefixes.map(async (folderRef) => {
        const folderContents = await listAll(folderRef);
        return folderContents.items.map(item => item.fullPath);
      })
    ).then(results => results.flat());

    return NextResponse.json({ 
      success: true, 
      files: allFiles 
    });
    
  } catch (error) {
    console.error("Storage error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /purchases/{allPaths=**} {
//       allow read, write;
//     }
//   }
// }