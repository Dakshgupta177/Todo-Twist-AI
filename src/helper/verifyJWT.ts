import { connectDb } from "@/lib/DBconnect";
import { NextRequest} from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = async(request: NextRequest):Promise<string> => {
  await connectDb();
  try {
    const token: string = request.cookies.get("Token")?.value || "";
    if (!token) {
      return "";
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    return decodedToken.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return "";
  }
}
