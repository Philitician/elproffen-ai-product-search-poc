import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { syncProductEmbeddings } from "~/inngest/product-embeddings-sync/events";
import { syncProductEmbeddingsMultiple } from "~/inngest/product-embeddings-sync/events";
import {
  tempTableInserted,
  tempTableUpdated,
  tempTableDeleted,
  usersDeleted,
  usersUpdated,
  usersInserted,
} from "~/inngest/events";
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncProductEmbeddingsMultiple,
    syncProductEmbeddings,
    tempTableInserted,
    tempTableUpdated,
    tempTableDeleted,
    usersInserted,
    usersUpdated,
    usersDeleted,
  ],
});
