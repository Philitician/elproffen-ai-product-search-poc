import { parsePartialJson } from "@ai-sdk/ui-utils";
import { Message } from "ai/react";
import { Block, blockSchema } from "~/types";

export const parseAssistantMessage = (
  message: Message
): { blocks: Block[] } => {
  const parsedMessage = parsePartialJson(message.content);

  // Remove or conditionally include logging in production.
  // if (process.env.NODE_ENV !== "production") {
  //   console.log("message.content", message.content);
  //   console.log("parsedMessage", parsedMessage);
  // }

  const { value, state } = parsedMessage;

  if (!value) return { blocks: [] };

  const { blocks } = value as { blocks: Block[] | null | undefined };

  // "repaired-parse" | "successful-parse" | "undefined-input" | "failed-parse"
  if (
    !blocks ||
    ["undefined-input", "failed-parse"].includes(parsedMessage.state)
  ) {
    return { blocks: [] };
  }

  if (parsedMessage.state === "successful-parse") return { blocks };

  // Instead of JSON.stringify/parse validation, use a lightweight check.
  const validBlocks: Block[] = [];
  for (const block of blocks) {
    const result = blockSchema.safeParse(block);
    if (!result.success) break;
    validBlocks.push(result.data);
  }
  return { blocks: validBlocks };
};
