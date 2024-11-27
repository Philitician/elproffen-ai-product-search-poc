import { Inngest, EventSchemas } from "inngest";
import { z } from "zod";

export const syncProductEmbeddingsMultipleSchema = z.object({
  productNumbers: z.array(z.string()),
});

export const syncProductEmbeddingsSchema = z.object({
  productNumber: z.string(),
});

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "embeddings-sync-app",

  schemas: new EventSchemas().fromZod({
    "product/embeddings.sync.multiple": {
      data: syncProductEmbeddingsMultipleSchema,
    },
    "product/embeddings.sync": { data: syncProductEmbeddingsSchema },
  }),
});
