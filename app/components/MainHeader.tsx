"use client";
import Link from "next/link";
import { useModal } from "../hooks/use-modal-store";
import { logout } from "../lib/actions";
import { useEffect } from "react";

interface MainHeaderProps {
  userSession: any;
  sessionData: any;
}

const MainHeader = ({ userSession, sessionData }: MainHeaderProps) => {
  const userData = JSON.parse(userSession);
  const userInfo = JSON.parse(sessionData);
  const isLoggedIn = userData.isLoggedIn;
  const { onOpen } = useModal();

  const handleAuthenticate = () => {
    onOpen("AuthUser");
  };

  const logoutHandler = async () => {
    await logout();
    window.location.reload();
  };

  useEffect(() => {
    if (userInfo?.username === undefined && isLoggedIn) {
      console.log("there is no username");
      onOpen("CreateUsername", userInfo?.userId);
    }
  }, [userInfo]);


  // console.log(userInfo)
  // console.log(isLoggedIn)

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
