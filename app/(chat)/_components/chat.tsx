"use client";

import { UIMessage } from "@ai-sdk/ui-utils";
import { useChat } from "ai/react";
import { parseAssistantMessage } from "~/lib/tools/parser";
import type { RetrieveSimilarProductsToolResult } from "~/lib/tools/retrieve-similar-products";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages?.map((message) => {
        console.dir(message, { depth: null });
        if (message.role === "user") {
          return (
            <div key={message.id} className="whitespace-pre-wrap">
              <strong>{`${message.role}: `}</strong>
              {message.content}
            </div>
          );
        }

        const reasoningParts = message.parts.filter(
          (part) => part.type === "reasoning"
        );

        console.log("reasoningParts", reasoningParts);

        const parsedMessage = parseAssistantMessage(message);

        return (
          <div key={message.id} className="whitespace-pre-wrap">
            <strong>{`${message.role}: `}</strong>
            {reasoningParts.map((part, index) => (
              <p
                className="text-gray-500"
                key={`${message.id}-reasoning-${index}`}
              >
                {part.reasoning}
              </p>
            ))}
            {parsedMessage.blocks.map((block, index) => {
              if (block.type === "text") {
                return <div key={`${message.id}-${index}`}>{block.text}</div>;
              }
              const toolCalls = message.parts?.filter(
                (part) => part.type === "tool-invocation"
              );
              if (!toolCalls) return null;

              if (block.type === "product") {
                const productToolCall = toolCalls.find(
                  ({ toolInvocation }) =>
                    toolInvocation.toolName === "retrieveSimilarProducts"
                )?.toolInvocation;

                if (productToolCall?.state !== "result") return null;

                const products =
                  productToolCall.result as RetrieveSimilarProductsToolResult;

                const product = products.find(
                  (p) => p.objectID === block.product.productId
                );

                if (!product) return null;

                return (
                  <div key={block.product.productId}>
                    <strong>{block.product.productNumber}</strong>
                    <p className="whitespace-pre-wrap">{product.productName}</p>
                    <p className="text-gray-500 whitespace-pre-wrap">
                      {block.reason}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

function UserMessage({ content }: UIMessage) {
  return <div className="whitespace-pre-wrap">User: {content}</div>;
}

function AIMessage({ content, parts }: UIMessage) {
  console.log(content, parts);
  return <div className="whitespace-pre-wrap">AI: {content}</div>;
}
