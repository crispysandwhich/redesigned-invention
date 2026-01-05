"use client";



import { useModal } from "@/app/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { HandleCredentialSignin, HandleWalletSignin } from "@/app/lib/actions";

const AuthUserModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "AuthUser";

  const [emailSignup, setEmailSignup] = useState(false);
  const [walletSignup, setWalletSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      firstTime: emailSignup,
      email,
      password,
    };

    const res = await HandleCredentialSignin(payload);

    if(res.status === "success"){
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    router.refresh();
    onClose();
  };

  const handleMetamaskLogin = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        toast.error("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = `Authenticate with MetaMask `;
      const signature = await signer.signMessage(message);

      const payload = {
        firstTime: walletSignup ,
        address,
        signature,
      };

      const res = await HandleWalletSignin(payload);

      if(res.status === "success"){
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("MetaMask login failed");
    }
  };


  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isModalOpen ? "block" : "hidden"
      }`}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <dialog
        open={isModalOpen}
        className="
          relative text-white w-full max-w-lg p-8 rounded-2xl shadow-2xl 
          bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700
        "
      >
        <h2 className="text-3xl text-center font-semibold mb-6">
          Authentication
        </h2>

        {/* EMAIL / PASSWORD */}
        <form onSubmit={handleEmailAuth} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* EMAIL SIGNUP TOGGLE */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <input
              id="emailSignupToggle"
              type="checkbox"
              checked={emailSignup}
              onChange={() => setEmailSignup(!emailSignup)}
              className="accent-blue-500"
            />
            <label htmlFor="emailSignupToggle" className="text-sm text-gray-300">
              {emailSignup ? "Already have an account?" : "First time? Create account"}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold shadow-lg"
          >
            {emailSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* METAMASK BUTTON */}
        <div className="space-y-4">
          {/* WALLET SIGNUP TOGGLE */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <input
              id="walletSignupToggle"
              type="checkbox"
              checked={walletSignup}
              onChange={() => setWalletSignup(!walletSignup)}
              className="accent-amber-500"
            />
            <label
              htmlFor="walletSignupToggle"
              className="text-sm text-gray-300"
            >
              {walletSignup
                ? "Already registered with MetaMask?"
                : "First time using MetaMask? Create account"}
            </label>
          </div>

          <button
            onClick={handleMetamaskLogin}
            className="
              w-full flex items-center justify-center gap-3 
              bg-amber-500 hover:bg-amber-600 text-black font-semibold 
              rounded-lg p-3 transition shadow-md
            "
          >

            {walletSignup ? "Sign Up with MetaMask" : "Sign In with MetaMask"}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
      </dialog>
    </div>
  );
};

export default AuthUserModal;
