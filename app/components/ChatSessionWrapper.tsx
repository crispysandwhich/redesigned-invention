"use client";

import { useEffect, useState } from "react";
import ChatClient from "./ChatClient";
import { UpdateChatTitle } from "../lib/BotAgent";

interface ChatSessionWrapperProps {
  userMessages: any;
  chatId?: string;
  userId?: string;
  chatTitle: string;
  currentSessionAgent: any;
}

const ChatSessionWrapper = ({
  userMessages,
  chatId,
  userId,
  chatTitle,
  currentSessionAgent
}: ChatSessionWrapperProps) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(chatTitle);

  // Show modal on first load if default title
  useEffect(() => {
    if (chatTitle === "New Chat") {
      setShowModal(true);
    }
  }, [chatTitle]);

  const handleSave = async () => {
    if (!title.trim()) return;

    await UpdateChatTitle({
      chatId,
      title,
    });

    setShowModal(false);
  };


  return (
    <>
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-slate-800 p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              Name this chat
            </h3>

            <p className="text-sm text-slate-400 mb-4">
              Give your chat a meaningful name so you can find it later.
            </p>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Marketing ideas, Bug fixing, Planning..."
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-3 text-slate-100 outline-none focus:border-purple-400"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white"
              >
                Skip
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 text-slate-900 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT CLIENT */}
      <ChatClient
        userMessages={userMessages}
        chatId={chatId}
        userId={userId}
        chatTitle={title}
        currentSessionAgent={currentSessionAgent}
      />
    </>
  );
};

export default ChatSessionWrapper;
