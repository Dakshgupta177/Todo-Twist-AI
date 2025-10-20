import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/verifyJWT";

export async function GET(request: NextRequest) {
  try {
    const userLogedIn = await getDataFromToken(request)
    if (!userLogedIn) {
        return NextResponse.json({message:"Unauthorized"},{status:400})
    }
    return NextResponse.json({message:"Authorized"},{status:200})
  } catch (error) {
    return NextResponse.json({message:"Internal server error",error},{status:500})
  }
}
