"use client";

const ChatBit = () => {
  const conversation = [
    {
      id: "block_1",
      user: {
        id: "user_msg_001",
        content: "Hey, can you tell me a bedtime story?",
      },
      bot: {
        id: "bot_msg_001",
        content:
          "Under the soft glow of the moon, Luna the unicorn danced through fields of stardust...",
      },
    },
    {
      id: "block_2",
      user: {
        id: "user_msg_002",
        content: "Can you make it even more magical?",
      },
      bot: {
        id: "bot_msg_002",
        content:
          "With every step, the stars shimmered brighter, as if whispering secrets only she could hear...",
      },
    },
  ];

  const handleChat = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const userInput = form.userchatbit.value;

    console.log("User input:", userInput);
    form.userchatbit.value = "";
  };

  return (
    <div className=" px-6 py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-semibold tracking-wide bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
          ChatBit
        </h2>
        <p className="text-slate-300">Chat with the bot about any topic</p>
      </header>

      {/* Chat Blocks */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {conversation.map((block) => (
          <div
            key={crypto.randomUUID()}
            className="p-6 rounded-2xl shadow-lg bg-slate-800/40 border border-white/10
                       backdrop-blur-md 
                       bg-gradient-to-br from-slate-700/30 via-slate-800/40 to-slate-900/30
                       hover:border-purple-200/40 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.25)]
                       transition-all duration-300"
          >
            <div className="mb-4">
              <p className="text-sm font-semibold text-pink-200 tracking-wide">User</p>
              <p className="text-slate-200 mt-1">{block.user.content}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-200 tracking-wide">Bot</p>
              <p className="text-slate-300 mt-1">{block.bot.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleChat}
        className="mt-10 max-w-3xl mx-auto flex flex-col items-end"
      >
        <textarea
          name="userchatbit"
          id="userchatbit"
          placeholder="Type your message..."
          className="w-full p-4 rounded-xl text-slate-200 bg-slate-800/40 
                     border border-white/10 backdrop-blur-md
                     focus:outline-none focus:ring-2 focus:ring-purple-300/40
                     placeholder:text-slate-500
                     bg-gradient-to-br from-slate-700/20 to-slate-900/30
                     shadow-md"
          rows={4}
        ></textarea>

        <button
          type="submit"
          className="mt-4 px-6 py-2 rounded-xl font-medium
                     bg-gradient-to-r from-purple-300 via-pink-200 to-blue-200
                     text-slate-900 shadow-md
                     hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]
                     active:scale-95
                     transition-all duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBit;
