"use server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="px-6 sm:px-10 py-16 flex flex-col items-center gap-20">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-8 sm:p-14 shadow-xl flex flex-col gap-6">
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl pointer-events-none" />

          {/* Text */}
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Build your own AI agent to get anything done
            </h2>

            <p className="mt-3 text-lg sm:text-xl text-purple-100/90 leading-relaxed">
              Chat, generate images, automate tasks — your AI works exactly how
              you want.
            </p>

            <Link
              href="/defi"
              className="mt-6 inline-block rounded-xl bg-white/20 backdrop-blur-lg hover:bg-white/30 px-6 py-3 text-white font-semibold shadow-lg transition-all"
            >
              Get started today
            </Link>
          </div>

          {/* Robot image */}
          <div className="absolute right-4 sm:right-10 bottom-0 sm:bottom-6 opacity-90">
            <Image
              src="/ai-robot.webp"
              alt="AI Robot"
              width={260}
              height={260}
              className="w-32 sm:w-48 md:w-60 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="w-full max-w-6xl">
        <h3 className="text-3xl sm:text-4xl font-bold text-center text-purple-900 mb-10">
          Everything you need to build with AI
        </h3>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="relative backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col gap-4 transition hover:scale-[1.02] hover:shadow-2xl border border-white/30">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-purple-600/80 shadow-md text-white text-2xl">
              💬
            </div>
            <h4 className="text-xl font-semibold text-purple-900">
              AI Chat Sessions
            </h4>
            <p className="">
              Create and manage conversations with intelligent agents. Switch
              between sessions, save messages, and build your own workflow with
              AI in minutes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="relative backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col gap-4 transition hover:scale-[1.02] hover:shadow-2xl border border-white/30">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-600/80 shadow-md text-white text-2xl">
              🎨
            </div>
            <h4 className="text-xl font-semibold text-purple-900">
              Image Generation & Editing
            </h4>
            <p className="">
              Generate stunning AI images or upload your own for powerful
              editing. Enhance, restyle, remove objects, and save or share your
              creations instantly.
            </p>
          </div>

          {/* Feature 3 (Custom Idea) */}
          <div className="relative backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col gap-4 transition hover:scale-[1.02] hover:shadow-2xl border border-white/30">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-pink-600/80 shadow-md text-white text-2xl">
              ⚙️
            </div>
            <h4 className="text-xl font-semibold text-purple-900">
              Build Custom AI Agents
            </h4>
            <p className="">
              Create your own specialized AI agent that performs tasks, analyzes
              data, responds with custom rules, and adapts to how *you* work.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
