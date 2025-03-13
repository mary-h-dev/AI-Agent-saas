"use client";
import { Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";
import { BotIcon, ImageIcon, LetterText, PenIcon } from "lucide-react";
import { toast } from "sonner";


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
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    append,
    status,
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

  console.log("Chat messagessssssss:", messages);




  const isScriptGenerationEnabled = useSchematicFlag(
    FeatureFlag.SCRIPT_GENERATION
  );

  const isImageGenerationEnabled = useSchematicFlag(
    FeatureFlag.IMAGE_GENERATION
  );

  const isTitleGenerationEnabled = useSchematicFlag(
    FeatureFlag.TITLE_GENERATIONS
  );

  const isVideoAnalysisEnabled = useSchematicFlag(FeatureFlag.ANALYSE_VIDEO);





  useEffect(() => {
    if (bottomRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);





  useEffect(() => {
    let toastId: string | number = "";

    switch (status) {
      case "submitted":
        toastId = toast("Agent is thinking...", {
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;

      case "streaming":
        toastId = toast("Agent is replying...", {
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;

      case "error":
        toastId = toast("Whoops! Something went wrong, please try again.", {
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;

      case "ready":
        if (toastId) {
          toast.dismiss(toastId);
        }
        break;
    }
  }, [status]);



  const generateScript = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-script-${randomId}`,
      role: "user",
      content: `
        Generate a step-by-step shooting script for this video basd on the transcript that I can use on my own channel 
        to produce a video that is similar to this one. 
        Don't do any other steps such as generating an image, just generate the script only!
      `,
    };

    append(userMessage);
  };




  const generateImage = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-image-${randomId}`,
      role: "user",
      content: `
        Generate an image related to this video.
      `,
    };

    append(userMessage);
  };




  const generateTitle = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-title-${randomId}`,
      role: "user",
      content: `
        Generate a title for this video.
      `,
    };

    append(userMessage);
  };




  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-400">AI Agent</h2>
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        ref={messagesContainerRef}
      >
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-400">
                  Welcome to AI Agent Chat
                </h3>
                <p className="text-sm text-gray-600">
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
                  ? "bg-gray-700 text-white"
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
                          {(part as ToolPart).toolInvocation.result && (
                            <pre className="text-xs bg-white/75 p-2 rounded overflow-auto max-h-[200px] ">
                              {JSON.stringify(
                                (part as ToolPart).toolInvocation.result,
                                null,
                                2
                              )}
                            </pre>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <>
                    {/* <p className="text-xs font-bold">User Message</p> */}
                    <div className="prose prose-sm max-w-none text-white">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="w-[40%] p-3 rounded-lg bg-gray-50 mr-6">
              <p className="text-sm font-semibold mb-1">AI Agent</p>
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

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-gray-300 p-4 bg-black">
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 text-white text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder={
                !isVideoAnalysisEnabled
                  ? "Upgrade to ask anything about your video"
                  : "Ask anything abut your video"
              }
              value={input}
              onChange={handleInputChange}
              disabled={
                status === "streaming" ||
                status === "submitted" ||
                !isVideoAnalysisEnabled
              }
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              {status === "streaming"
                ? "AI is replying..."
                : status === "submitted"
                ? "AI is thinking..."
                : "Send"}
            </Button>
          </form>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <button
              className="text-white text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateScript}
              type="button"
              disabled={!isScriptGenerationEnabled}
            >
              <LetterText className="w-4 h-4" />

              {isScriptGenerationEnabled ? (
                <span>Generate Script</span>
              ) : (
                <span>Upgrade to generate a script</span>
              )}
            </button>

            {/* Generate Title Button */}
            <button
              className="text-white text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateTitle}
              type="button"
              disabled={!isTitleGenerationEnabled}
            >
              <PenIcon className="w-4 h-4" />
              Generate Title
            </button>

            {/* Generate Image Button */}
            <button
              className="text-white text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateImage}
              type="button"
              disabled={!isImageGenerationEnabled}
            >
              <ImageIcon className="w-4 h-4" />
              Generate Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAgentChat;
