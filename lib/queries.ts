import { sql, cosineDistance, gt, desc } from "drizzle-orm";
import { db } from "~/db";
import { productEmbedding } from "~/db/schema";

export const queryProducts = async (embeddedQuery: number[]) => {
  const similarity = sql`1 - (${cosineDistance(
    productEmbedding.embedding,
    embeddedQuery
  )})`;

  return db
    .select({
      productNumber: productEmbedding.productNumber,
      similarity,
    })
    .from(productEmbedding)
    .where(gt(similarity, 0.4))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
};
