import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, Output, streamText, smoothStream } from "ai";
import { z } from "zod";
import { retrieveSimilarProductsTool } from "~/lib/tools/retrieve-similar-products";
import { blockSchema } from "~/types";

import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("o3-mini"),
    // model: openai("gpt-4o-mini"),
    system:
      "Du er en hjelper som hjelper elektrikere med å finne produkter relevante for elektrikerne." +
      "Du har tilgang til en database med produkter og kan bruke denne til å finne produkter som passer til brukerens spørring." +
      "For hvert produkt du finner, evaluer om det faktisk er relevant for brukeren." +
      "Filtrer ut produkter som ikke er relevante for brukeren.",
    messages,
    providerOptions: {
      openai: { reasoningEffort: "low" },
    },
    tools: {
      retrieveSimilarProducts: retrieveSimilarProductsTool,
    },
    maxSteps: 10,
    // experimental_transform: [smoothStream()],
    experimental_generateMessageId: () => nanoid(),
    experimental_output: Output.object({
      schema: z.object({
        blocks: z.array(blockSchema),
      }),
    }),
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendUsage: true,
  });

  // return createDataStreamResponse({
  //   execute: (dataStream) => {
  //     const result = streamText({
  //       model: openai("o3-mini"),
  //       system:
  //         "Du er en hjelper som hjelper elektrikere med å finne produkter relevante for elektrikerne." +
  //         "Du har tilgang til en database med produkter og kan bruke denne til å finne produkter som passer til brukerens spørring." +
  //         "For hvert produkt du finner, evaluer om det faktisk er relevant for brukeren." +
  //         "Filtrer ut produkter som ikke er relevante for brukeren.",
  //       messages,
  //       providerOptions: {
  //         openai: { reasoningEffort: "low" },
  //       },
  //       tools: {
  //         retrieveSimilarProducts: retrieveSimilarProductsTool,
  //       },
  //       maxSteps: 5,
  //       experimental_output: Output.object({
  //         schema: z.object({
  //           blocks: z.array(blockSchema),
  //         }),
  //       }),
  //     });

  //     result.mergeIntoDataStream(dataStream, {
  //       sendReasoning: true,
  //     });
  //   },
  // });
}
