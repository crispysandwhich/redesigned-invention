"use client";

import { useModal } from "@/app/hooks/use-modal-store";
import { CreateAgentAction } from "@/app/lib/actions";
import { FileToBase64 } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CreateAgentModal = () => {
  const { isOpen, onClose, type, signature } = useModal();
  const isModalOpen = isOpen && type === "CreateAgent";

  const router = useRouter();

  const HandleAgentCreation = async (e: any) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    try {
      const agentName = e.target.agentName.value;
      const agentInstructions = e.target.agentInstructions.value;
      const profileImage = e.target.agentProfile.files[0];

      const baImage = await FileToBase64(profileImage);

      await CreateAgentAction({
        agentName,
        agentInstructions,
        user: signature,
        profileImage: baImage,
      });

      toast.success("Agent created successfully!");
      form.reset(); // ✅ works now
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create agent. Please try again.");
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
          Create Agent
        </h2>

        <form className="space-y-5" onSubmit={HandleAgentCreation}>
          <div>
            <label className="text-sm text-gray-300">Agent Name: </label>
            <input
              type="text"
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              placeholder="phlieop"
              id="agentName"
              name="agentName"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Agent Instructions:</label>
            <input
              type="text"
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              placeholder="Your purpose is...."
              id="agentInstructions"
              name="agentInstructions"
            />
          </div>

          <label htmlFor="agentProfile">
            <span className="text-sm text-gray-300">Agent Profile Pic:</span>
            <input
              type="file"
              id="agentProfile"
              name="agentProfile"
              className="w-full mt-1"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold shadow-lg"
          >
            enter
          </button>
        </form>

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

export default CreateAgentModal;
