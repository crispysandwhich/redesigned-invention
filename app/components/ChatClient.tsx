"use client";

import Image from "next/image";
import { CreateChatMessage } from "../lib/actions";

interface ChatClientProps {
  userMessages: any;
  chatId?: string;
  userId?: string;
}

const ChatClient = ({ userMessages, chatId, userId }: ChatClientProps) => {
  const sessionMessages = JSON.parse(userMessages);

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

  return (
    <div className="flex flex-col h-[720px] max-w-3xl mx-auto bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <header className="px-6 py-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-xl font-semibold">Chat with Agent</h2>
        <p className="text-gray-400 text-sm">
          Turn your queries into actionable messages.
        </p>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {sessionMessages.messages.length === 0 ? (
          <p className="text-gray-400 text-center">
            No messages yet. Start the conversation!
          </p>
        ) : (
          <ul className="space-y-4">
            {sessionMessages.messages.map((msg, index) => (
              <li key={index} className="space-y-2">
                {/* User Message */}
                {msg.message && (
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={sessionMessages.owner.image || "/file.svg"}
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
                  <div className="flex items-start gap-3 justify-end ml-12">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={sessionMessages.ParentAgent.profileImage || "/bot.svg"}
                        alt="bot image"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="bg-blue-600 text-gray-100 rounded-lg px-4 py-2 max-w-xl break-words">
                      {msg.botMessage}
                    </div>
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
        className="px-6 py-4 border-t border-gray-700 bg-gray-800 flex gap-3"
      >
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
      </form>
    </div>
  );
};

export default ChatClient;
