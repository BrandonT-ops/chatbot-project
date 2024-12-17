import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { ConversationMessage } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get messages
    const { messages, images, files } = await request.json();

    // Map messages to OpenAI's expected format
    const formattedMessages = messages.map((msg: ConversationMessage) => ({
      role: msg.is_user ? "user" : "assistant",
      content:
        `${msg.content}\n` +
        (msg.images && msg.images.length > 0
          ? `Images: ${msg.images.join(", ")}\n`
          : "") +
        (msg.files && msg.files.length > 0
          ? `Files: ${msg.files
              .map((file) => `${file.name}: ${file.url}`)
              .join(", ")}\n`
          : ""),
    }));

    // Add a system message to define the assistant's role and behavior
    formattedMessages.unshift({
      role: "system",
      content:
        "You are an assistant specialised in finding e-commerce products online. your role is to find the perfect product to match a user's request. to do this you must first understand the user's request and ask them more questions about the product if you see that it is necessary. then you will decide if it is time to do the search or not. Even if you're not up to date, if you think a product doesn't exist, just do the search. You may come across messages containing links to images or files. Reply in JSON format with the following structure:" +
        `{
          "user_answer": "string - The response to the user.",
          "send_request": "boolean - Whether it's time to search online.",
          "query": "string - The search keywords, if available."
        }`
         +  "For images or files, include their descriptions in your response if relevant."+
        "be friendly, use simple language, be your users' online search partner."+
        "Only engage with product-related queries and avoid responding to unrelated topics." ,
    });

    // Send a request to the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20", // Use GPT-4 for advanced capabilities
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
      message: {
        ...structuredResponse,
        included_images: images || [],
        included_files: files || [],
      },
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
