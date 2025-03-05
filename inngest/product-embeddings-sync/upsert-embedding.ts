import { db } from "~/db";
import { productEmbedding } from "~/db/schema";
import { ProductEmbeddingInsert } from "~/db/types";

type UpsertEmbeddingParams = {
  productId: number;
  productNumber: string;
  productText: string;
  embedding: number[];
};

export const upsertEmbedding = async ({
  productId,
  productNumber,
  productText,
  embedding,
}: UpsertEmbeddingParams) => {
  const newProductEmbedding = {
    productId,
    productNumber,
    content: productText,
    embedding,
  } satisfies ProductEmbeddingInsert;

  console.log("newProductEmbedding", newProductEmbedding);

  await db
    .insert(productEmbedding)
    .values(newProductEmbedding)
    .onConflictDoUpdate({
      target: [productEmbedding.productId],
      set: newProductEmbedding,
    })
    .catch((err) => {
      console.error("error upserting embedding", err);
    });
};
