import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: value.replaceAll("\n", " "),
  });
  return embedding;
};

export const generateEmbeddings = async (value: string): Promise<number[]> => {
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: [value],
  });
  return embeddings[0];
};
