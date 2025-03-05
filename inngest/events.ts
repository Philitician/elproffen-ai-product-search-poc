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

export const tempTableUpdated = inngest.createFunction(
  { id: "temp-table-updated" },
  { event: "db/temp_table.updated" },
  async ({ event, step }) => {
    const { data } = event;

    console.log("data", data);

    return {
      message: "Temp table updated",
      data,
    };
  }
);

export const tempTableDeleted = inngest.createFunction(
  { id: "temp-table-deleted" },
  { event: "db/temp_table.deleted" },
  async ({ event, step }) => {
    const { data } = event;

    console.log("data", data);

    return {
      message: "Temp table deleted",
      data,
    };
  }
);

export const usersInserted = inngest.createFunction(
  { id: "users-inserted" },
  { event: "db/users.inserted" },
  async ({ event, step }) => {
    const { data } = event;

    console.log("data", data);

    return {
      message: "Users inserted",
      data,
    };
  }
);

export const usersUpdated = inngest.createFunction(
  { id: "users-updated" },
  { event: "db/users.updated" },
  async ({ event, step }) => {
    const { data } = event;

    console.log("data", data);

    return {
      message: "Users updated",
      data,
    };
  }
);

export const usersDeleted = inngest.createFunction(
  { id: "users-deleted" },
  { event: "db/users.deleted" },
  async ({ event, step }) => {
    const { data } = event;

    console.log("data", data);

    return {
      message: "Users deleted",
      data,
    };
  }
);
