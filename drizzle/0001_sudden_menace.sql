ALTER TABLE "ProductEmbedding" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ProductEmbedding" ADD CONSTRAINT "ProductEmbedding_product_id_unique" UNIQUE("product_id");