"use client";

import { useState } from "react";
import {
  HandleCredentialSignin,
  HandleWalletSignin,
  logout,
} from "../lib/actions";
 
export default function AuthForm({ session }: { session: any }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  // --- Email / Password login
  const submitHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");
    const username = form.get("username");
    const firstTime = form.get("firstTime");

    console.log({
      email,
      password,
      username,
    });

      

    const res = await HandleCredentialSignin({
      email,
      password,
      username,
      firstTime: firstTime === "on" ? true : false,
    });

    // console.log("Server Response:", res);
    setLoading(false);
  };

  // --- Metamask login
  const walletLoginHandler = async () => {
    if (!window.ethereum) return alert("Metamask is not installed");

    setWalletLoading(true);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      const firstTime = confirm(
        "Is this your first time logging in with this wallet?"
      );

      console.log({
        metaAddress: address,
        firstTime,
      });

      // Replace this with your server action
      const res = await HandleWalletSignin({
        metaAddress: address,
        signature: "dummy-signature-for-now",
        firstTime,
      });

      console.log("Wallet Login Response:", res);
      setWalletLoading(false);
      window.location.reload(); // Refresh session
    } catch (err) {
      console.error(err);
      setWalletLoading(false);
    }
  };

  const logoutHandler = async () => {
    await logout();
    window.location.reload();
  };

  // --- If logged in, show logout
  if (session?.isLoggedIn) {
    return (
      <div className="p-4 bg-gray-900/40 border border-gray-700 rounded-xl mt-4 text-white">
        <p className="mb-3">
          Logged in as{" "}
          <span className="font-semibold">
            {session.username || session.metaAddress}
          </span>{" "}
        </p>{" "}
        <button
          onClick={logoutHandler}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white w-full transition"
        >
          Logout{" "}
        </button>{" "}
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm p-6 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {isRegister ? "Create an Account" : "Login"}{" "}
      </h2>
      {/* Email / Password Form */}
      <form onSubmit={submitHandler} className="flex flex-col gap-3">
        {isRegister && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        />

        <label htmlFor="firstTime">

          <input name="firstTime" id="firstTime" type="checkbox" />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      {/* Metamask Login */}
      <div className="mt-4 text-center">
        <button
          onClick={walletLoginHandler}
          disabled={walletLoading}
          className="w-full mt-2 p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition"
        >
          {walletLoading ? "Connecting..." : "Login with Metamask"}
        </button>
      </div>
      {/* Toggle first-time / login */}
      <p
        className="mt-4 text-sm text-center text-blue-600 cursor-pointer"
        onClick={() => setIsRegister((p) => !p)}
      >
        {isRegister ? "Already have an account?" : "Create an account"}
      </p>
    </div>
  );
}
