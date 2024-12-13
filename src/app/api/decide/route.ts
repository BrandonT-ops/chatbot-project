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
        "You're an assistant that determines whether a user query is a direct product search or if the user needs assistance to find a product. " +
        "Respond in JSON format with the following structure: " +
        `{
          "needs_assistance": "boolean - true if the user query requires AI assistance to find a product, false if the user is directly searching for a product.",
          "reason": "string - A brief explanation of why assistance is or is not needed."
        }`+  "Only engage with product-related queries and avoid responding to unrelated topics.",
    });

    // Send a request to the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for advanced capabilities
      messages: formattedMessages,
      max_tokens: 200,
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
      console.error(parsingError);
      throw new Error("The AI response could not be parsed into JSON.");
    }

    // Validate the structured response
    if (
      typeof structuredResponse.needs_assistance !== "boolean" ||
      typeof structuredResponse.reason !== "string"
    ) {
      throw new Error("The AI response is not in the expected format.");
    }

    // Return the structured response as JSON
    return NextResponse.json({
      needs_assistance: structuredResponse.needs_assistance,
      reason: structuredResponse.reason,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
