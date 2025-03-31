import { NextResponse } from "next/server";
import User from "@/app/model/user";
import { mongooseConnect } from "@/app/lib/mongooseConnect";

// Checks if its users first access so it can run gtag or not.
export async function PATCH(req) {
  await mongooseConnect();

  // const body = await req.json();

  // console.log("this is the body", body);

  // return NextResponse.json({message: 'success'})

  try {
    const { firstAccess, hash } = await req.json();

    console.log(firstAccess, hash);

    const user = await User.findOneAndUpdate({ hash: hash }, { firstAccess: firstAccess }, { new: true });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    console.log("Updated user:", user);

    return NextResponse.json({ message: "First access updated", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error }, { status: 500 });
  }
}
