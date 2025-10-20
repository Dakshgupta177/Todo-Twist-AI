import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import Todo from "@/models/todoModel";
import { getDataFromToken } from "@/helper/verifyJWT";
const validId = z.object({
  todoId: z.string(),
});
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = validId.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.format().todoId?._errors[0] },
      { status: 400 }
    );
  }
  try {
    const userId = await getDataFromToken(request);
    const { todoId } = result.data;
    const User = await Todo.findOne({ userId });
    if (!User) {
      return NextResponse.json(
        { message: "User doesn't exists" },
        { status: 400 }
      );
    }
    User.challengingTodos.forEach((todo) => {
      if (todo._id == todoId) todo.isCompleted = !todo.isCompleted;
    });
    await User.save();
    return NextResponse.json(
      { message: "Successfully Deleted!!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
