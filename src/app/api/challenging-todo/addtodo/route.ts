import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import z from "zod";
import Todo, { todoItem } from "@/models/todoModel";
import { getDataFromToken } from "@/helper/verifyJWT";

const validPrompt = z.object({
  userText: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = validPrompt.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.format().userText?._errors[0] },
      { status: 400 }
    );
  }

  try {
    const { userText } = result.data;
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User field: ${userText}
You are a task manager. Provide 5 task(like todo) from the related field that user entered in a sequence like first two are easy third fourth are medium and fifth one is tough Btw don't make them so hard and just questions in as short as possible try to keep under 50 words. All separated by ||.`,
    });

    const questions = response.text?.split("||");
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existingTodo = await Todo.findOne({ userId });
    const content : todoItem[] = (questions || []).map((q) => ({
      content: q,
      isCompleted: false,
    } as todoItem));

    if (!existingTodo) {
      const created = await Todo.create({
        userId,
        normalTodos: [],
        challengingTodos: content,
      });
      return NextResponse.json({ data: created }, { status: 200 });
    } else {
      existingTodo.challengingTodos.push(...content);
      await existingTodo.save();
      return NextResponse.json({ data: existingTodo }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
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
