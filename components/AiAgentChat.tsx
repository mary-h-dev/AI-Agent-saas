"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}

interface ToolPart {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
}


const formatToolInvocation = (part: ToolPart) => {
    if (!part.toolInvocation) return "Unknown Tool";
    return `🔧 Tool Used: ${part.toolInvocation.toolName}`;
  };
  


function AIAgentChat({ videoId }: { videoId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
  } = useChat({
    api: "/api/chat/openai",
    maxSteps: 5,
    body: {
      videoId,
    },
    onResponse: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    originalHandleSubmit(e);
  };

  console.log("Chat messages:", messages);

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">AI Agent</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-700">
                  Welcome to AI Agent Chat
                </h3>
                <p className="text-sm text-gray-500">
                  Ask any question about your video!
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
              max-w-[85%] 
              ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-black font-semibold"
              }
              rounded-2xl px-4 py-3
            `}
              >
                {m.parts && m.role === "assistant" ? (
                  <div className="space-y-3">
                    {m.parts.map((part, i) =>
                      part.type === "text" ? (
                        <div key={i} className="prose prose-sm max-w-none">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : part.type === "tool-invocation" ? (
                        <div
                          key={i}
                          className="bg-white/50 rounded-lg p-2 space-y-2 text-gray-800"
                        >
                          <p className="font-medium text-xs">
                            {formatToolInvocation(part as ToolPart)}
                          </p>
                          {/* {(part as ToolPart).toolInvocation.result && (
                            <pre className="text-xs bg-white/75 p-2 rounded overflow-auto max-w-[40%]">
                              {JSON.stringify(
                                (part as ToolPart).toolInvocation.result,
                                null,
                                2
                              )}
                            </pre>
                          )} */}
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold">User Message</p>
                    <div className="prose prose-sm max-w-none text-white">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="p-3 rounded-lg bg-gray-50 mr-6">
              <p className="text-sm font-semibold mb-1">AI Assistant</p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Enter a question..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AIAgentChat;
