import { db } from "~/db";
import { productEmbedding } from "~/db/schema";
import { ProductEmbeddingInsert } from "~/db/types";

type UpsertEmbeddingParams = {
  productNumber: string;
  productText: string;
  embedding: number[];
};

export const upsertEmbedding = async ({
  productNumber,
  productText,
  embedding,
}: UpsertEmbeddingParams) => {
  const newProductEmbedding = {
    productNumber,
    content: productText,
    embedding,
  } satisfies ProductEmbeddingInsert;

  console.log("newProductEmbedding", newProductEmbedding);

  await db
    .insert(productEmbedding)
    .values(newProductEmbedding)
    .onConflictDoUpdate({
      target: [productEmbedding.productNumber],
      set: newProductEmbedding,
    });
};
