import { getDataFromToken } from "@/helper/verifyJWT";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getDataFromToken(request);
    if (!user) {
        return NextResponse.json({message:"Unauthorized"},{status:400})
    }
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    response.cookies.set("Token", "", {
      httpOnly: true,
      secure: true,
    });
    return response;
  } catch (error) {
    return NextResponse.json({message:"Internal server error",error},{status:500})
  }
}

