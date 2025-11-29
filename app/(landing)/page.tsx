"use server"
import Link from "next/link";
import AuthForm from "../components/AuthForm";
import { getSession } from "../lib/actions";


export default async function Home() {
  const session = await getSession();

  return (
    <main className="p-10">
      <h2>create your own agent or use our bots to get any job done</h2>
      <p>from chatting to image generation get right to the point with our ai</p>
      <Link href="/defi">vist</Link>

      <div className="mt-10">
        <AuthForm session={session} />
      </div>
    </main>
  );
}
