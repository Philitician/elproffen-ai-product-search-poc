CREATE TABLE IF NOT EXISTS "ProductEmbedding" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "ProductEmbedding_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_number" text NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"product_id" integer,
	CONSTRAINT "ProductEmbedding_product_number_unique" UNIQUE("product_number")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ProductEmbedding_embedding_index" ON "ProductEmbedding" USING hnsw ("embedding" vector_cosine_ops);