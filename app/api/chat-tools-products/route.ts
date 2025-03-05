import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { Output, streamText, tool } from "ai";
import { z } from "zod";
import { retrieveSimilarProductsTool } from "~/lib/tools/retrieve-similar-products";
import { blockSchema } from "~/types";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // model: google("gemini-2.0-flash-001"),
    model: openai("o3-mini"),
    system:
      "Du er en hjelper som hjelper brukeren med å finne produkter." +
      "Du har tilgang til en database med produkter og kan bruke denne til å finne produkter som matcher brukerens spørring.",
    messages,
    providerOptions: {
      openai: { reasoningEffort: "low" },
    },
    toolCallStreaming: true,
    maxSteps: 5, // multi-steps for server-side tools
    tools: {
      retrieveSimilarProducts: retrieveSimilarProductsTool,
    },
  });

  return result.toDataStreamResponse();
}
