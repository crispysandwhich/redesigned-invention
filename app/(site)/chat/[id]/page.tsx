"use server";

import ChatSessionWrapper from "@/app/components/ChatSessionWrapper";
import { getSession } from "@/app/lib/actions";
import {
  AgentHistoryPopulated,
  GetSingleAgentHistory,
} from "@/app/lib/BotAgent";
import { verifyToken } from "@/app/lib/jwt";
import Image from "next/image";

type PageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: PageProps) => {
  const session = await getSession();
  const verifyedUser = verifyToken(session?.token || "");
  const { id } = await params;

  const CurrentChatSession = await GetSingleAgentHistory(id);
  if (CurrentChatSession.status !== "success") {
    return <div>Hell</div>;
  }
  const messages = CurrentChatSession.message?.messages || [];

  const sessionAgent = CurrentChatSession.message?.ParentAgent as any;

  console.log("CurrentChatSession:", CurrentChatSession.message);

  return (
    <section>
      <header className="mb-4 flex items-center justify-center">
        <div className="relative w-100 h-100">
          <Image
            alt={CurrentChatSession.message.ParentAgent.Agentname}
            src={`${CurrentChatSession.message.ParentAgent.profileImage}`}
            fill
          />
        </div>

        <div className="w-[50%] ">
          <h2 className="text-4xl font-bold">
            {CurrentChatSession.message.ParentAgent.Agentname}
          </h2>
          <p className="text-md overflow-auto text-gray-500 h-[180px]">
            {CurrentChatSession.message.ParentAgent.instructions}
          </p>
        </div>
      </header>

      <ChatSessionWrapper
        userMessages={JSON.stringify(messages)}
        chatId={id}
        userId={verifyedUser?.userId.toString()}
        chatTitle={CurrentChatSession.message.title}
        currentSessionAgent={JSON.stringify(sessionAgent)}
      />
    </section>
  );
};

export default page;
