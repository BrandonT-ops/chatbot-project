import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { ConversationMessage } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const formattedMessages = messages.map((msg: ConversationMessage) => ({
      role: msg.is_user ? "user" : "assistant",
      content: msg.content,
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
      max_tokens: 300,
      temperature: 0.7
    });

    return NextResponse.json({
      message: response.choices[0].message
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}
