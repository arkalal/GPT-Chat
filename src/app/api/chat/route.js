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

    if (!messages || !model || !provider) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Function to write a chunk to the stream
    const writeChunk = async (content) => {
      const chunk = {
        id: `chunk-${Date.now()}`,
        choices: [
          {
            delta: { content },
            index: 0,
          },
        ],
      };
      await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
    };

    // Function to handle errors
    const writeError = async (error) => {
      const errorChunk = {
        error: error.message || "An error occurred",
      };
      await writer.write(
        encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
      );
    };

    (async () => {
      try {
        switch (provider) {
          case "OPENAI": {
            const response = await openai.chat.completions.create({
              model,
              messages,
              stream: true,
            });

            for await (const chunk of response) {
              if (chunk.choices[0]?.delta?.content) {
                await writeChunk(chunk.choices[0].delta.content);
              }
            }
            break;
          }

          case "ANTHROPIC": {
            const response = await anthropic.messages.create({
              model,
              messages: messages.map((msg) => ({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.content,
              })),
              stream: true,
            });

            for await (const chunk of response) {
              if (chunk.type === "content_block_delta" && chunk.delta.text) {
                await writeChunk(chunk.delta.text);
              }
            }
            break;
          }

          case "GOOGLE": {
            const genModel = genAI.getGenerativeModel({ model });
            const chat = genModel.startChat({
              history: messages.map((msg) => ({
                role: msg.role,
                parts: msg.content,
              })),
            });

            const response = await chat.sendMessageStream(
              messages[messages.length - 1].content
            );
            for await (const chunk of response.stream) {
              if (chunk.text) {
                await writeChunk(chunk.text);
              }
            }
            break;
          }

          default:
            throw new Error("Unsupported provider");
        }
      } catch (error) {
        await writeError(error);
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
