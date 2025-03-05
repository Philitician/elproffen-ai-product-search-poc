import { openai } from "@ai-sdk/openai";
import { generateText, Output, tool } from "ai";

import { streamText } from "ai";

import { z } from "zod";

const randomPersons = [
  {
    name: "John Doe",
    age: 30,
    contact: {
      type: "email",
      value: "john.doe@example.com",
    },
    occupation: {
      type: "employed",
      company: "Example Inc.",
      position: "Software Engineer",
    },
  },
  {
    name: "Jane Doe",
    age: 25,
    contact: {
      type: "email",
      value: "jane.doe@example.com",
    },
    occupation: {
      type: "employed",
      company: "Example Inc.",
      position: "Software Engineer",
    },
  },
];

const personSchema = z.object({
  name: z.string(),
  age: z.number().nullable().describe("Age of the person."),
  contact: z.object({
    type: z.literal("email"),
    value: z.string(),
  }),
  occupation: z.object({
    type: z.literal("employed"),
    company: z.string(),
    position: z.string(),
  }),
});

const retrieveRelevantPersons = tool({
  description: "Retrieve persons relevant to the theme",
  parameters: z.object({
    theme: z.string().describe("The theme for the person"),
  }),
  execute: async (args) => randomPersons,
});

const textBlockSchema = z.object({
  type: z.literal("text").describe("The type of block"),
  text: z.string().describe("The text of the block"),
});

const personBlockSchema = z.object({
  type: z.literal("person").describe("The type of block"),
  person: personSchema.describe("The person"),
  reason: z
    .string()
    .describe("The reason for why this person is relevant to the theme"),
});

const blocks = z.discriminatedUnion("type", [
  textBlockSchema,
  personBlockSchema,
]);

const main = async () => {
  const { experimental_output, text, steps } = await generateText({
    model: openai("o3-mini"),
    system:
      "Find persons relevant to the theme, but evaluate each person as to whether they are actually relevant, and provide a reason for why this person is relevant to the theme.",
    prompt: "I need some artists for a new project.",
    tools: {
      generatePerson: retrieveRelevantPersons,
    },
    providerOptions: {
      openai: { reasoningEffort: "low" },
    },
    maxSteps: 10,
    experimental_output: Output.object({
      schema: z.object({
        blocks: z.array(blocks),
      }),
    }),
  });

  // console.log(text);
  // console.dir(experimental_output, { depth: null });
  // console.dir(steps, { depth: null });
};

main().catch(console.error);
