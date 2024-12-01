import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { ConversationMessage } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get messages
    const { messages } = await request.json();

    // Map messages to OpenAI's expected format
    const formattedMessages = messages.map((msg: ConversationMessage) => ({
      role: msg.is_user ? "user" : "assistant",
      content: msg.content,
    }));

    // Add a system message to define the assistant's role and behavior
    formattedMessages.unshift({
      role: "system",
      content:
        "You're an assistant who specializes in helping users search for products online. Respond in JSON format with the following structure: " +
        `{
          "user_answer": "string - The response to the user.",
          "send_request": "boolean - Whether it's time to search online.",
          "query": "string - The search keywords, if available."
        }` +
        "Only engage with product-related queries and avoid responding to unrelated topics.",
    });

    // Send a request to the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for advanced capabilities
      messages: formattedMessages,
      max_tokens: 300,
      temperature: 0.7,
    });

    // Parse and validate the model's response
    let structuredResponse;
    try {
      const content = response.choices[0].message.content;
      if (content === null) {
        throw new Error("Message content is null");
      }
      structuredResponse = JSON.parse(content);
    } catch (parsingError) {
      console.log(parsingError);
      throw new Error("The AI response could not be parsed into JSON.");
    }

    // Return the structured response as JSON
    return NextResponse.json({
      message: structuredResponse,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
