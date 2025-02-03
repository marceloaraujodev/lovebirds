import { NextResponse } from "next/server";
import firebaseInit from "@/app/utils/firebaseInit";
import { getStorage, ref, listAll } from "firebase/storage";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";

const app = await firebaseInit();
const storage = getStorage(app);


// this route is not being used, so far is jus for testing purposes
export async function GET() {

  await mongooseConnect();
  
  // // Gets all files from the bucket
  const allFiles = await getAllFilesFirebase()

  // unPaid user who have images in their account
  const unPaidUsers = await User.find({ 
    paid: false,
    $expr: { $gt: [{ $size: "$photos" }, 0] } // gets only users which there is photos in array.
  }, "email hash name paid");

  unPaidUsers.map((user) => {
    const hash = user.hash;
    const index = allFiles.findIndex(path => path.includes(hash));
  
    if (index !== -1) {
      console.log("Found at index:", index);
      console.log("Full path:", allFiles[index]); // Full path to delete
      console.log('would delete the allFiles[index]')
    } else {
      console.log("No matching file found.");
    }

  })



  return NextResponse.json({
    success: true, 
    files: allFiles,
    unPaidUsers
  })
}

async function getAllFilesFirebase(){
  try {
    // Reference the purchases directory
    const purchasesRef = ref(storage, 'purchases');
    
    const listResult = await listAll(purchasesRef);
    
    // Get all nested files (including subdirectories)
    const allFiles = await Promise.all(
      listResult.prefixes.map(async (folderRef) => {
        const folderContents = await listAll(folderRef);
        // can try to delete the items here from paid false
        return folderContents.items.map(item => item.fullPath);
      })
    ).then(results => results.flat());

    return allFiles
    
  } catch (error) {
    console.error("Storage error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}