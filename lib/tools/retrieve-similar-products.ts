import { tool } from "ai";
import { z } from "zod";
import { generateEmbedding } from "~/inngest/product-embeddings-sync/generate-embedding";
import { getAlgoliaProducts } from "../algolia";
import { queryProducts } from "../queries";

export const retrieveSimilarProductsTool = tool({
  description: "Hent produkter som matcher hva brukeren spør om.",
  parameters: z.object({
    query: z.string().describe("Søk på produkter"),
  }),
  execute: async ({ query }) => {
    console.log("query", query);
    const beforeEmbedding = performance.now();
    const embeddedQuery = await generateEmbedding(query);
    console.log(`time embedding: ${performance.now() - beforeEmbedding} ms`);

    const beforeQuery = performance.now();
    const similarProducts = await queryProducts(embeddedQuery);
    console.log(`time query: ${performance.now() - beforeQuery} ms`);

    const beforeAlgolia = performance.now();
    const algoliaProducts = await getAlgoliaProducts(
      similarProducts.map((p) => p.productId.toString())
    );
    console.log(`time algolia: ${performance.now() - beforeAlgolia} ms`);

    console.log(
      "total product retrieval tool time",
      performance.now() - beforeEmbedding
    );
    const productResults = algoliaProducts.results
      .filter(Boolean)
      .map((algoliaProduct) => ({
        ...algoliaProduct,
        content: similarProducts.find(
          (x) => x.productId === algoliaProduct.productId
        )!.content,
      }));

    console.log(
      `Found ${productResults.length} matching products for query '${query}'`
    );

    return productResults;
  },
});

export type RetrieveSimilarProductsToolResult = Awaited<
  ReturnType<typeof retrieveSimilarProductsTool.execute>
>;
