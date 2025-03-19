import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";
import { deleteFolderContents } from "@/app/utils/deleteUserFilesFromFireBase";

export async function DELETE(req) {
  await mongooseConnect();
  try {
    // const unpaid = await User.find({ paid: false });
   const images = deleteFolderContents('Marcelo e Dayse', '900e1c14-88d9-46a6-afbd-7152b3b64006')

    return NextResponse.json({
      message: "Success",
      // unpaid,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}
