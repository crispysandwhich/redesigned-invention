"use client";
import Link from "next/link";
import { useModal } from "../hooks/use-modal-store";
import { logout } from "../lib/actions";

interface MainHeaderProps {
  userSession: any;
}

const MainHeader = ({ userSession }: MainHeaderProps) => {
  const userData = JSON.parse(userSession);
  const isLoggedIn = userData.isLoggedIn;
  const { onOpen } = useModal();
  const handleAuthenticate = () => {
    onOpen("AuthUser");
  };

  const logoutHandler = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">
        <Link href="/">PixelMancer</Link>
      </h1>

      <nav className="flex items-center gap-4">
        <Link href="/defi">defi</Link>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logoutHandler}>Logout</button>
          </>
        ) : (
          <button onClick={handleAuthenticate}>authenticate</button>
        )}
      </nav>
    </header>
  );
};

export default MainHeader;
