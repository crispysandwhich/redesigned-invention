"use server"

import { GetSingleAgentHistory } from "@/app/lib/BotAgent";

type PageProps = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: PageProps) => {

  const { id } = await params;

  const agentHistory = (await GetSingleAgentHistory(id)) as any;

  return (
    <section>
      <div className="w-[300px] h-[300px] relative">
      <img
          src={agentHistory.message.messages[0].images[0]}
          alt={agentHistory.message.messages[0].message}
          className="w-[300px] h-[300px] object-contain rounded-xl"
        />
      </div>
    </section>
  )
}

export default page