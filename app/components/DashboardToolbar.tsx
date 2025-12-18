"use client";

import Link from "next/link";
import { useModal } from "../hooks/use-modal-store";

interface DashboardToolbarProps {
    user: any;
}

const DashboardToolbar = ({user}:DashboardToolbarProps) => {
  const { onOpen } = useModal();

  return (
    <div
      className="
        fixed
        top-20
        right-6
        w-[180px]
        h-[300px]
        z-50
        rounded-2xl
        p-4
        bg-gradient-to-br from-purple-900 via-blue-900 to-black
        shadow-2xl
        border border-white/10
        "
    >
      <h2 className="text-lg font-semibold mb-4">Toolbar</h2>
      <nav className="flex flex-col gap-2 text-sm">
        <button
          onClick={() => onOpen("CreateAgent", user)}
          className="hover:text-purple-300 transition"
        >
          Create Agent
        </button>
        <Link href="/" className="hover:text-purple-300 transition">
          Create Image
        </Link>
        <Link href="/" className="hover:text-purple-300 transition">
          Edit Image
        </Link>
      </nav>
    </div>
  );
};

export default DashboardToolbar;
