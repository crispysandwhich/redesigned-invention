"use client";

import Image from "next/image";
import { CreateChatMessage } from "../lib/BotAgent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

interface ChatClientProps {
  userMessages: any;
  chatId?: string;
  userId?: string;
  chatTitle: string;
  currentSessionAgent: any;
}

const ChatClient = ({
  userMessages,
  chatId,
  userId,
  chatTitle,
  currentSessionAgent
}: ChatClientProps) => {
  const [copied, setCopied] = useState(false);
  const sessionMessages = JSON.parse(userMessages);
  const currentAgent = JSON.parse(currentSessionAgent);

  console.log("session messages in chat client", sessionMessages);

  const HandleChatQuery = async (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const userChat = form.UserChat.value;
    const payload = {
      chatId: chatId,
      userChat: userChat,
      userId: userId,
    };
    try {
      const res = await CreateChatMessage(payload);
      console.log(res);
      form.reset();
    } catch (error) {
      console.error("Error handling chat query:", error);
    }
  };

  const handleCopy = async (chat: any) => {
    await navigator.clipboard.writeText(chat);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col h-[720px] max-w-3xl mx-auto bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <header className="px-6 py-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Chat with Agent</h2>
          <p className="text-gray-400 text-sm">
            Turn your queries into actionable messages.
          </p>
        </div>
        <h3 className="text-gray-400 font-bold text-md text-shadow-lg">
          {chatTitle}
        </h3>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {sessionMessages.length === 0 ? (
          <p className="text-gray-400 text-center">
            No messages yet. Start the conversation!
          </p>
        ) : (
          <ul className="space-y-4">
            {sessionMessages.map((msg:any, index:any) => (
              <li key={index} className="space-y-2">
                {/* User Message */}
                {msg.message && (
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={sessionMessages.owner?.image || "/file.svg"}
                        alt="user image"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2 max-w-xl break-words">
                      {msg.message}
                    </div>
                  </div>
                )}

                {/* Bot Message */}
                {msg.botMessage && (
                  <div className="flex flex-col items-start gap-3 justify-end bg-gray-800 p-4 text-shadow-lg rounded-lg">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={
                          currentAgent.profileImage ||
                          "/bot.svg"
                        }
                        alt="bot image"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>

                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          return inline ? (
                            <code className="bg-gray-700 px-1 py-0.5 rounded text-blue-300">
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-black/60 rounded-lg p-4 overflow-x-auto">
                              <button
                                className="bg-gray-500 p-2 float-right"
                                onClick={async () => await handleCopy(children)}
                              >
                                {copied ? "Copied!" : "Copy"}
                              </button>
                              <code className="text-sm text-gray-100">
                                {children}
                              </code>
                            </pre>
                          );
                        },
                      }}
                    >
                      {msg.botMessage}
                    </ReactMarkdown>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={HandleChatQuery}
        className="px-6 py-4 border-t border-gray-700 bg-gray-800 flex-col gap-3"
      >
        <div className="flex items-center gap-4 text-sm">
          <label htmlFor="webSearch">
            <input
              type="checkbox"
              id="webSearch"
              name="webSearch"
              className="mr-2 leading-tight"
            />
            <span className="text-gray-200">Enable Web Search</span>
          </label>
          <label htmlFor="imageInput">
            <input type="file" id="imageInput" name="imageInput" />
            <span className="text-gray-200">Attach Image</span>
          </label>
        </div>
        <div className="w-full flex">
          <textarea
            name="UserChat"
            id="UserChat"
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-lg bg-gray-700 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            rows={2}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatClient;
