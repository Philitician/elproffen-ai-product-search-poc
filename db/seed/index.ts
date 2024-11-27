import { createProductText } from "~/inngest/product-embeddings-sync/create-product-text";
import { getEfoProductData } from "~/inngest/product-embeddings-sync/get-efo-product-data";
import { PromisePool } from "@supercharge/promise-pool";
import { PRODUCT_NUMBERS_TOP_10 } from "./data";

import { upsertEmbedding } from "~/inngest/product-embeddings-sync/upsert-embedding";
import { generateEmbedding } from "~/inngest/product-embeddings-sync/generate-embedding";

const seed = async () => {
  await PromisePool.for(PRODUCT_NUMBERS_TOP_10).process(
    async (productNumber) => {
      const productData = await getEfoProductData(productNumber);
      const productText = await createProductText(productData);
      console.log("produced text", productNumber);
      const embedding = await generateEmbedding(productText);
      console.log("produced embedding", productNumber);
      await upsertEmbedding({ productNumber, productText, embedding });
      console.log("upserted embedding", productNumber);
    }
  );
};

seed().catch(console.error);
