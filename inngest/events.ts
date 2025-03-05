import { inngest, tempTableInsertedSchema } from "./client";

export const tempTableInserted = inngest.createFunction(
  { id: "temp-table-inserted" },
  { event: "db/temp_table.inserted" },
  async ({ event, step }) => {
    const { data } = event;

    console.log("data", data);

    return {
      message: "Temp table inserted",
      data,
    };
  }
);
