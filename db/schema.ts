import { index, integer, pgTable, text, vector } from "drizzle-orm/pg-core";

export const productEmbedding = pgTable(
  "ProductEmbedding",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    productNumber: text("product_number").notNull().unique(), // EFO product number / ID
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    productId: integer("product_id"), // Product ID from PlanetScale DB, ignore for now...
  },
  (table) => [index().using("hnsw", table.embedding.op("vector_cosine_ops"))]
);
