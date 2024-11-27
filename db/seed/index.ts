import { PromisePool } from "@supercharge/promise-pool";
import { getEfoProductData } from "~/inngest/product-embeddings-sync/get-efo-product-data";
import { PRODUCT_NUMBERS_TOP_10 } from "./data";

import fs from "fs/promises";
import path from "path";
import { createProductText } from "~/inngest/product-embeddings-sync/create-product-text";
import { generateEmbedding } from "~/inngest/product-embeddings-sync/generate-embedding";
import { upsertEmbedding } from "~/inngest/product-embeddings-sync/upsert-embedding";

const storeToJsonFile = async (data: any, filename: string) => {
  await fs
    .writeFile(filename, JSON.stringify(data, null, 2))
    .then(() => {
      console.log("stored", filename);
    })
    .catch((err) => {
      console.error("error storing", filename, err);
    });
};

const seed = async () => {
  await PromisePool.for(PRODUCT_NUMBERS_TOP_10).process(
    async (productNumber) => {
      const productData = await getEfoProductData(productNumber);
      await storeToJsonFile(
        productData,
        path.join(__dirname, `./output/${productNumber}.json`)
      );
      console.log("stored", productNumber);
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
