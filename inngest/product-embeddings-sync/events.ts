import {
  inngest,
  syncProductEmbeddingsMultipleSchema,
  syncProductEmbeddingsSchema,
} from "../client";
import { createProductText } from "./create-product-text";
import { generateEmbedding } from "./generate-embedding";
import { getEfoProductData } from "./get-efo-product-data";
import { upsertEmbedding } from "./upsert-embedding";

export const syncProductEmbeddingsMultiple = inngest.createFunction(
  { id: "sync-product-embeddings-multiple" },
  { event: "product/embeddings.sync.multiple" },
  async ({ event, step }) => {
    const { products } = syncProductEmbeddingsMultipleSchema.parse(event.data);

    await step.sendEvent(
      "sync-product-embeddings",
      products.map((data) => ({
        name: "product/embeddings.sync",
        data,
      }))
    );
  }
);

export const syncProductEmbeddings = inngest.createFunction(
  { id: "sync-product-embeddings" },
  { event: "product/embeddings.sync" },
  async ({ event, step }) => {
    const { productId, productNumber } = syncProductEmbeddingsSchema.parse(
      event.data
    );

    // 1. retrieve up to date product data and create a comprehensive product text
    const productText = await step.run("Get product text", async () => {
      // TODO: a. retrieve product data from EFO
      const productData = await getEfoProductData(productNumber);
      // TODO: b. create a comprehensive product text from EFO data
      return createProductText(productData);
    });

    // 2. use the product text to generate and upsert embeddings
    await step.run("Upsert embeddings", async () => {
      // TODO: a. generate embeddings
      const embedding = await generateEmbedding(productText);
      // TODO: b. upsert embeddings to Neon with pgvector
      await upsertEmbedding({
        productId,
        productNumber,
        productText,
        embedding,
      });
    });
  }
);
