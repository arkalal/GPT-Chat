import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    // Get the appropriate handler based on the provider
    const handlers = {
      OPENAI: handleOpenAIStream,
      ANTHROPIC: handleAnthropicStream,
      GOOGLE: handleGoogleStream,
    };

    const handler = handlers[provider];
    if (!handler) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Create a TransformStream to handle the streaming response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream
    (async () => {
      try {
        const streamGenerator = handler(messages, model);

        for await (const chunk of streamGenerator) {
          const payload = {
            id: Date.now().toString(),
            choices: [
              {
                delta: { content: chunk },
                index: 0,
              },
            ],
          };

          // Write the chunk to the stream
          await writer.write(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        }
      } catch (error) {
        console.error("Streaming error:", error);
        const errorPayload = {
          error: "Streaming error occurred",
        };
        await writer.write(
          encoder.encode(`data: ${JSON.stringify(errorPayload)}\n\n`)
        );
      } finally {
        await writer.write(encoder.encode("data: [DONE]\n\n"));
        await writer.close();
      }
    })();

    return new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
