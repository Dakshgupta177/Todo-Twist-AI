import { connectDb } from "@/lib/DBconnect";
import User from "@/models/userModel";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";
import { signinSchemaValidation } from "@/schemas/signinSchema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = signinSchemaValidation.safeParse(body);

  if (!result.success) {
      return NextResponse.json({ error: result.error.format().identifier?._errors[0] || result.error.format().password?._errors[0]}, { status: 400 });
  }
  try {
    await connectDb();
    const { identifier, password } = result.data;
    const user = await User.findOne({ $or: [{ username:identifier.toLowerCase()}, { email:identifier.toLowerCase()}] });
    if (!user) {
        return NextResponse.json({message:"User does not exists. Signup first!"},{status:401})
    }
    const isCorrect =await bcrypt.compare(password,user.password);
    if (!isCorrect) {
        return NextResponse.json({message:"Invalid credentials"},{status:401})
    }
    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET_KEY!,{expiresIn:"10d"})
    const response = NextResponse.json({ message: "Login successful", token });

    response.cookies.set("Token", token, {
      httpOnly: true,
      secure: true,
    });
    return response
  } catch (error) {
    return NextResponse.json({message:"Internal server error",error},{status:500})
  }
}
