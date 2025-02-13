import { OpenAI } from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_PROVIDERS } from "../../../config/ai-config";

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request) {
  try {
    const { messages, model, provider } = await request.json();

    // Validate request
    if (!messages || !model || !provider) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400 }
      );
    }

    // Get the appropriate handler based on the provider
    const handlers = {
      OPENAI: handleOpenAIStream,
      ANTHROPIC: handleAnthropicStream,
      GOOGLE: handleGoogleStream,
    };

    const handler = handlers[provider];
    if (!handler) {
      return new Response(JSON.stringify({ error: "Invalid provider" }), {
        status: 400,
      });
    }

    // Create stream
    const stream = await handler(messages, model);
    return new Response(stream);
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

async function* handleOpenAIStream(messages, model) {
  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      yield chunk.choices[0].delta.content;
    }
  }
}

async function* handleAnthropicStream(messages, model) {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.content,
  }));

  const stream = await anthropic.messages.create({
    model,
    messages: formattedMessages,
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.text) {
      yield chunk.delta.text;
    }
  }
}

async function* handleGoogleStream(messages, model) {
  const genModel = genAI.getGenerativeModel({ model });

  const chat = genModel.startChat({
    history: messages.map((msg) => ({
      role: msg.role,
      parts: msg.content,
    })),
  });

  const result = await chat.sendMessageStream(
    messages[messages.length - 1].content
  );

  for await (const chunk of result.stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
