import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { getDataFromToken } from "@/helper/verifyJWT";
import Todo, { todoItem } from "@/models/todoModel";
const validContent = z.object({
  content: z.string(),
});
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = validContent.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.format().content?._errors[0] },
      { status: 400 }
    );
  }
  try {
    const { content } = result.data;
    const userId = await getDataFromToken(request);
    console.log(userId);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const User = await Todo.findOne({ userId });

    if (!User) {
      const response = await Todo.create({
        userId,
        normalTodos: [{ content, isCompleted: false }],
        challengingTodos: [],
      });
      return NextResponse.json({ data: response }, { status: 200 });
    } else {
      const data = { content, isCompleted: false } as todoItem;
      User.normalTodos.push(data);
      User.save();
      return NextResponse.json({ data: User }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
  // try {
  //   console.log(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`);

  //   const res = await axios.post(
  //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
  //     {
  //       contents: [
  //         {
  //           parts: [
  //             {
  //               text: `User symptom: mild cold
  // You are a health assistant. Provide safe, educational guidance for mild symptoms.
  // Include possible causes, home remedies, and general OTC info without prescribing medicines.
  // Always include a disclaimer.`,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   console.log(res.data.candidates[0].content.parts[0].text);
  //   return new NextResponse(res.data.candidates[0].content.parts[0].text);
  // } catch (error) {
  //   console.log(error);
  //   return NextResponse.json({ message: "Error fetching data", error }, { status: 500 });
  // }
}
