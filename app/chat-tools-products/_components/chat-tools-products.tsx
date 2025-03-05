"use client";

import { useChat } from "ai/react";

export function ChatTools() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat-tools-products",
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages?.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return <div key={index}>{part.text}</div>;
            }
            if (part.type === "reasoning") {
              return (
                <pre
                  key={index}
                  className="italic text-gray-500 whitespace-pre-wrap"
                >
                  {part.reasoning}
                </pre>
              );
            }

            const callId = part.toolInvocation.toolCallId;

            switch (part.toolInvocation.toolName) {
              case "retrieveSimilarProducts": {
                switch (part.toolInvocation.state) {
                  case "partial-call":
                    return (
                      <div key={callId}>
                        <pre>
                          {JSON.stringify(part.toolInvocation, null, 2)}
                        </pre>
                      </div>
                    );
                  case "call":
                    return (
                      <div key={callId} className="text-gray-500">
                        Henter produkter...
                      </div>
                    );
                  case "result":
                    return (
                      <div key={callId} className="text-gray-500">
                        Produkter:
                        <pre>
                          {JSON.stringify(part.toolInvocation.result, null, 2)}
                        </pre>
                      </div>
                    );
                }
              }
            }
          })}
          <br />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
