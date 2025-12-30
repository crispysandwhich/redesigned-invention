"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateChatAgentSession } from "../lib/BotAgent";

interface QuickChatBitProps {
  availableAgents: any;
  recentchats: any;
  user: any;
}

const QuickChatBit = ({
  recentchats,
  availableAgents,
  user,
}: QuickChatBitProps) => {
  const router = useRouter();
  const sessionAgents = JSON.parse(availableAgents);
  const sessionHistory = JSON.parse(recentchats);
  // --- Carousel Logic ---
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState(false);

  const switchAgent = (dir: "next" | "prev") => {
    setAnim(true);
    setTimeout(() => {
      setIndex((prev) =>
        dir === "next"
          ? (prev + 1) % sessionAgents.length
          : (prev - 1 + sessionAgents.length) % sessionAgents.length
      );
      setAnim(false);
    }, 240);
  };

  const agent = sessionAgents[index] || {};

  const handleChatCreation = async () => {
    // TODO : maybe security touch
    const res = await CreateChatAgentSession({ agent: agent._id, user });
    if (res.status === "success") {
      router.push(`/chat/${res.message}`);
    }
  };

  return (
    <div
      className="max-w-4xl h-[720px] mx-auto p-8 rounded-3xl shadow-xl 
    bg-slate-800/40 border border-white/10 backdrop-blur-md
    bg-gradient-to-br from-slate-700/20 via-slate-800/30 to-slate-900/20
    hover:border-purple-200/30 transition-all duration-300"
    >
      {/* Quick Bits Header */}
      <header className="mb-8">
        <h3 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
          Quick Bits
        </h3>
        <p className="text-slate-300">
          choose where you left off or create a new chat
        </p>
      </header>

      {sessionHistory.length === 0 ? (
        <div
          className="h-[180px] flex flex-col items-center justify-center
    rounded-2xl border border-white/10 bg-slate-800/40 text-slate-300"
        >
          <p className="text-lg font-medium">No chat history yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Create an agent and start a chat to see history here
          </p>
        </div>
      ) : (
        <div className="relative">
          <div
            className="
        flex gap-6 overflow-x-auto pb-4
        snap-x snap-mandatory
        scrollbar-hide
      "
          >
            {sessionHistory.map((chat: any) => (
              <div
                key={chat._id}
                className="
            snap-start shrink-0
            w-[80%] sm:w-[45%] lg:w-[30%]  /* max 3 per row */
            bg-slate-700/50 p-4 rounded-xl
            border border-white/10
          "
              >
                <div className="w-6 h-6 mb-4 relative">
                  <Image src="/file.svg" alt="chat bit" fill />
                </div>

                <h3 className="font-semibold text-slate-100 truncate">
                  {chat.title}
                </h3>

                <p className="text-slate-300 text-sm mt-1">
                  {chat.messages?.length > 0
                    ? chat.messages.at(-1)?.message?.slice(0, 32)
                    : "No messages yet..."}
                </p>

                <Link
                  href={`/chat/${chat._id}`}
                  className="inline-block mt-3 text-sm text-purple-300 hover:underline"
                >
                  View More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agents Section */}
      <div className="flex items-center justify-center gap-12 mt-16 ">
        {/* Left Heading */}
        <div className="w-1/3">
          <h3 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
            Available Agents
          </h3>
          <p className="text-slate-300 mt-1">
            choose an AI agent to start a new chat
          </p>
        </div>

        {/* Animated Agent Card */}
        {/* Animated Agent Card */}
        {sessionAgents.length === 0 ? (
          <div
            className="w-[360px] h-[240px] flex items-center justify-center
    rounded-2xl border border-white/10 bg-slate-800/40 text-slate-300"
          >
            There are no agents available
          </div>
        ) : (
          <div
            className={`relative w-[360px] h-[240px] p-6 rounded-2xl shadow-xl 
    bg-gradient-to-br from-slate-700/40 via-slate-800/40 to-slate-900/40
    border border-white/10 backdrop-blur-xl transition-all duration-300
    ${
      anim
        ? "opacity-0 -translate-x-3 blur-sm"
        : "opacity-100 translate-x-0 blur-0"
    }`}
          >
            {/* LEFT ARROW */}
            {sessionAgents.length > 1 && (
              <button
                onClick={() => switchAgent("prev")}
                className="absolute left-2 top-1/2 -translate-y-1/2
        w-9 h-9 rounded-full
        bg-slate-700/70 border border-white/10
        text-slate-200 hover:text-white
        hover:bg-slate-600/70 transition"
                aria-label="Previous agent"
              >
                ←
              </button>
            )}

            {/* RIGHT ARROW */}
            {sessionAgents.length > 1 && (
              <button
                onClick={() => switchAgent("next")}
                className="absolute right-2 top-1/2 -translate-y-1/2
        w-9 h-9 rounded-full
        bg-slate-700/70 border border-white/10
        text-slate-200 hover:text-white
        hover:bg-slate-600/70 transition"
                aria-label="Next agent"
              >
                →
              </button>
            )}

            {/* AGENT CONTENT */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image src={agent.profileImage || "/file.svg"} alt="agent" fill />
            </div>

            <h2 className="text-xl font-semibold text-purple-200 text-center drop-shadow">
              {agent.Agentname}
            </h2>

            <p className="text-slate-300 mt-1 mb-4 text-center text-sm line-clamp-3">
              {agent.instructions}
            </p>

            <button
              onClick={handleChatCreation}
              className="w-full mt-2 px-5 py-2 rounded-xl
      bg-gradient-to-r from-purple-400/70 to-blue-400/70
      text-slate-900 font-medium shadow-lg
      hover:from-purple-300 hover:to-blue-300 transition-all"
            >
              Create Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickChatBit;
