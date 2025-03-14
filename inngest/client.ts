import { Inngest, EventSchemas } from "inngest";
import { unknown, z } from "zod";

export const syncProductEmbeddingsSchema = z.object({
  productId: z.number(),
  productNumber: z.string(),
});

export const syncProductEmbeddingsMultipleSchema = z.object({
  products: z.array(syncProductEmbeddingsSchema),
});

// export const tempTableInsertedSchema = z.object({
//   data: z.unknown(),
// });
export const tempTableInsertedSchema = z.object({});

export const tempTableUpdatedSchema = z.object({});

export const tempTableDeletedSchema = z.object({});

export const usersInsertedSchema = z.object({});

export const usersUpdatedSchema = z.object({});

export const usersDeletedSchema = z.object({});

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "embeddings-sync-app",

  schemas: new EventSchemas().fromZod({
    "product/embeddings.sync.multiple": {
      data: syncProductEmbeddingsMultipleSchema,
    },
    "product/embeddings.sync": { data: syncProductEmbeddingsSchema },
    "db/temp_table.inserted": { data: tempTableInsertedSchema },
    "db/temp_table.updated": { data: tempTableUpdatedSchema },
    "db/temp_table.deleted": { data: tempTableDeletedSchema },
    "db/users.inserted": { data: usersInsertedSchema },
    "db/users.updated": { data: usersUpdatedSchema },
    "db/users.deleted": { data: usersDeletedSchema },
  }),
});
