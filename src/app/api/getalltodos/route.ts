import { getDataFromToken } from "@/helper/verifyJWT";
import Todo from "@/models/todoModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = await getDataFromToken(request);
  const user = await Todo.findOne({ userId });
  if (!user) {
    return NextResponse.json(
      { message: "User doesn't exist" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      message: "Successfully fetched all Todos",
      normalTodos: user.normalTodos,
      challengingTodos: user.challengingTodos,
    },
    { status: 200 }
  );
}
