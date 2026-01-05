"use server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-[#0b0218] via-[#120726] to-black text-white">
      {/* ================= HERO ================= */}
      <section className="relative px-6 sm:px-10 pt-28 pb-36 flex justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(147,51,234,0.25),_transparent_60%)]" />

        <div className="relative max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Prysmor
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                An AI Creative Studio
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl">
              Design intelligent agents. Generate and edit images. Build creative
              workflows — all in one focused studio built for creators.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">
              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-7 py-4 font-semibold shadow-xl hover:scale-105 transition"
              >
                Start Creating
              </Link>

              <Link
                href="/explore"
                className="rounded-xl border border-white/20 px-7 py-4 text-white/80 hover:bg-white/10 transition"
              >
                Explore Features
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="absolute -inset-6 bg-purple-600/20 blur-3xl rounded-full" />
            <Image
              src="/ai-robot.webp"
              alt="Prysmor Studio Preview"
              width={520}
              height={520}
              className="relative rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="px-6 sm:px-10 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            "Creator-first design",
            "Private sessions",
            "Persistent agents",
            "Built for iteration",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white/5 backdrop-blur-lg py-5 text-sm sm:text-base font-semibold text-white/90 border border-white/10"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 sm:px-10 py-28 bg-gradient-to-b from-black to-[#0e061d]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            A Studio Built for Creation
          </h2>

          <p className="mt-4 text-center text-white/70 max-w-2xl mx-auto">
            Prysmor gives you the tools to explore ideas, shape intelligence, and
            turn concepts into output — without friction.
          </p>

          <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "💬",
                title: "AI Chat Agents",
                desc: "Create agents with personality, memory, and intent. Each session evolves as you work.",
              },
              {
                icon: "🎨",
                title: "Image Generation & Editing",
                desc: "Generate visuals, restyle images, or refine details — all within your creative flow.",
              },
              {
                icon: "⚙️",
                title: "Custom Creative Agents",
                desc: "Design agents specialized for writing, design, ideation, or experimentation.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="relative rounded-2xl bg-white/5 backdrop-blur-xl p-6 border border-white/10 shadow-xl hover:scale-[1.03] transition"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-white/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-6 sm:px-10 py-28">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            How Prysmor Works
          </h2>

          <div className="mt-20 grid gap-12 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create an Agent",
                desc: "Define what your agent does — chat, visuals, or both.",
              },
              {
                step: "02",
                title: "Start a Session",
                desc: "Explore ideas, generate output, and iterate in real time.",
              },
              {
                step: "03",
                title: "Build Over Time",
                desc: "Your agents and sessions persist, improving with use.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-purple-400 font-bold text-lg">
                  {s.step}
                </div>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="px-6 sm:px-10 pb-36">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-2xl border border-white/10 p-14 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Create with Intelligence
          </h2>

          <p className="mt-4 text-white/80 text-lg">
            Prysmor is your creative studio for intelligent ideas.
          </p>

          <Link
            href="/signup"
            className="mt-10 inline-block rounded-xl bg-white px-10 py-4 font-semibold text-black shadow-xl hover:scale-105 transition"
          >
            Join Prysmor
          </Link>
        </div>
      </section>
    </main>
  );
}
