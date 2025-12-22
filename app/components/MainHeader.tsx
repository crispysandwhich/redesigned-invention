"use client";
import Link from "next/link";
import { useModal } from "../hooks/use-modal-store";
import { logout } from "../lib/actions";
import { useEffect, useState } from "react";

interface MainHeaderProps {
  userSession: any;
  sessionData: any;
}

const MainHeader = ({ userSession, sessionData }: MainHeaderProps) => {
  const [toggler, setToggler] = useState(false);
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
      onOpen("CreateUsername", userInfo?.userId);
    }
  }, [userInfo]);


  // console.log(userInfo.username)
  // console.log(isLoggedIn)

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">
        <Link href="/">PixelMancer</Link>
      </h1>

      <nav className="flex items-center gap-4 relative">
        <Link href="/defi">defi</Link>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={() => setToggler((prev)=> !prev)}>{userInfo.username || "Ano"} ⬇️</button>
            {toggler && (
              <div className="absolute top-10 right-0 bg-[#111] border p-4 flex flex-col gap-2 z-100">
                <Link href={`/profile`}>Profile</Link>
                <button onClick={logoutHandler}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <button onClick={handleAuthenticate}>authenticate</button>
        )}
      </nav>
    </header>
  );
};

export default MainHeader;
