"use server";
import QuickImageBit from "../components/QuickImageBit";
import QuickChatBit from "../components/QuickChatBit";
import DashboardToolbar from "../components/DashboardToolbar";
import { GetAllAgentHistories, GetAllAgents, getSession } from "../lib/actions";
import { verifyToken } from "../lib/jwt";

const Page = async () => {
  const currentSession = await getSession();
  const userCurrent = verifyToken(currentSession.token || "");

  const agents = await GetAllAgents()
  const agentHistory = await GetAllAgentHistories()

  const RecentImageGen = [
    {
      id: 1,
      title: "Sunset Over Mountains",
      imageUrl: "/ai-image-1.png",
      timestamp: "2024-06-15T18:45:00Z",
    },
    {
      id: 2,
      title: "Futuristic Cityscape",
      imageUrl: "/ai-image-2.png",
      timestamp: "2024-06-14T12:20:00Z",
    },
    {
      id: 3,
      title: "Abstract Art Piece",
      imageUrl: "/ai-image-3.png",
      timestamp: "2024-06-13T16:10:00Z",
    },
    {
      id: 4,
      title: "Abstract Art Piece",
      imageUrl: "/ai-image-4.png",
      timestamp: "2024-06-13T16:10:00Z",
    },
  ];

  const RecentImageEdits = [
    {
      id: 1,
      title: "Portrait Enhancement",
      imageUrl: "/ai-image-1.png",
      imageUpdate: "/ai-image-1v2.png",
      timestamp: "2024-06-15T11:30:00Z",
    },
    {
      id: 2,
      title: "Landscape Color Correction",
      imageUrl: "/ai-image-2.png",
      imageUpdate: "/ai-image-2v2.png",
      timestamp: "2024-06-14T15:45:00Z",
    },
    {
      id: 3,
      title: "Product Photo Retouching",
      imageUrl: "/ai-image-3.png",
      imageUpdate: "/ai-image-3v2.png",
      timestamp: "2024-06-13T10:05:00Z",
    },
    {
      id: 4,
      title: "Product Photo Retouching",
      imageUrl: "/ai-image-4.png",
      imageUpdate: "/ai-image-4v2.png",
      timestamp: "2024-06-13T10:05:00Z",
    },
  ];

  const recentchats = [
    {
      id: 1,
      title: "Project Brainstorm",
      lastMessage: "Let's finalize the project scope by Friday.",
      timestamp: "2024-06-15T10:30:00Z",
    },
    {
      id: 2,
      title: "Weekly Sync",
      lastMessage: "Don't forget to send your updates before the meeting.",
      timestamp: "2024-06-14T14:00:00Z",
    },
    {
      id: 3,
      title: "Client Feedback",
      lastMessage: "The client loved the new design mockups!",
      timestamp: "2024-06-13T09:15:00Z",
    },
  ];
  
  // console.log(currentSession)
  // console.log(userCurrent)
  // console.log(agents.message)
  console.log(agentHistory.message)

  return (
    <section className="min-h-screen px-6 py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 relative">
      {/* toolbar */}
      <DashboardToolbar user={userCurrent?.userId} />

      {/* Dashboard Header */}
      <header className="mb-12 text-center">
        <h2 className="text-5xl font-semibold tracking-wide bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
          Dashboard
        </h2>
        <p className="text-slate-400 mt-2 text-lg">
          Welcome to your dashboard!
        </p>
      </header>

      {/* Quick Bits + Agents */}
      <QuickChatBit
        recentchats={JSON.stringify(agentHistory.message)}
        availableAgents={JSON.stringify(agents.message)}
        user={userCurrent?.userId}
      />

      {/* Quick Gen */}
      <QuickImageBit
        RecentImageEdits={RecentImageEdits}
        RecentImageGen={RecentImageGen}
      />
    </section>
  );
};

export default Page;
