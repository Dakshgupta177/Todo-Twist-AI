import { connectDb } from "@/lib/DBconnect";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { signupSchemaValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = signupSchemaValidation.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.format().email?._errors[0] || result.error.format().password?._errors[0] || result.error.format().username?._errors[0] }, { status: 400 });
  }
  try {
    await connectDb();
    const { username, email, password } = result.data;
    const userExist = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });
    if (userExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const Password = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: Password,
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "10d" }
    );
    const response = NextResponse.json({ message: "Signup successful", token });

    response.cookies.set("Token", token, {
      httpOnly: true,
      secure: true,
    });
    return response;

  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
