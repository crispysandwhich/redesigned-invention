"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CreateChatAgentSession } from "../lib/actions";
import { useRouter } from "next/navigation";

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

  const agent = sessionAgents[index];

  const handleChatCreation = async () => {
    // TODO : maybe security touch
    const res = await CreateChatAgentSession({ agent: agent._id, user });
    if (res.status === "success") {
      router.push(`/chat/${res.message}`);
    }
  };

  // console.log("in chat bit", sessionHistory[0].messages[0].message.slice(0,20))

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

      {/* Recent Chats Grid */}
      <div className="flex items-center justify-between">
        {sessionHistory.map((chat: any) => (
          <div
            key={crypto.randomUUID()}
            className="w-[200px] bg-slate-700/50 p-4 rounded-xl border border-white/10"
          >
            <div className="w-6 h-6 mb-4 relative">
              <Image src="/file.svg" alt="chat bit" fill />
            </div>
            <h3 className="font-semibold text-slate-100">{chat.title}</h3>
            <p className="text-slate-300 text-sm mt-1">
              {chat.messages[chat.messages.length - 1].message.slice(0, 20)}
            </p>
            <Link href={`/chat/${chat._id}`}>View More</Link>
          </div>
        ))}
      </div>

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
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image src={agent.profileImage} alt="agent" fill />
          </div>

          <h2 className="text-xl font-semibold text-purple-200 text-center drop-shadow">
            {agent.Agentname}
          </h2>

          <p className="text-slate-300 mt-1 mb-4 text-center text-sm">
            {agent.instructions}
          </p>

          <button
            onClick={handleChatCreation}
            className="w-full mt-2 px-5 py-2 rounded-xl text-center
          bg-gradient-to-r from-purple-400/70 to-blue-400/70
          text-slate-900 font-medium shadow-lg
          hover:from-purple-300 hover:to-blue-300 transition-all"
          >
            Create Chat
          </button>
          <button
            onClick={() => switchAgent("prev")}
            className="px-3 absolute -top-10 left-6 py-2 rounded-full bg-slate-700/40 border border-white/10 
            hover:border-purple-300/30 text-slate-200 backdrop-blur-lg transition-all"
          >
            ←
          </button>
          <button
            onClick={() => switchAgent("next")}
            className="px-3 absolute -top-10 right-6 py-2 rounded-full bg-slate-700/40 border border-white/10 
            hover:border-purple-300/30 text-slate-200 backdrop-blur-lg transition-all"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickChatBit;
