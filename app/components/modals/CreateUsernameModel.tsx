"use client";

import { useModal } from "@/app/hooks/use-modal-store";
import { CreateUsername } from "@/app/lib/UserActions";
import { useRouter } from "next/navigation";
 
const CreateUsernameModel = () => {
  const { isOpen, onClose, type, signature } = useModal();
  const isModalOpen = isOpen && type === "CreateUsername";

  const router = useRouter();
  
  const HandleCreateUsername = async (e:any) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const username = form.username.value;
    const payload = {
      username: username,
      userId: signature,
    }
    await CreateUsername(payload)
    router.refresh();
    onClose();
  }

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
          Create Username
        </h2>

        <form className="space-y-5" onSubmit={HandleCreateUsername}>
          <div>
            <label className="text-sm text-gray-300">username: </label>
            <input
              type="text"
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              placeholder="phlieop"
              id="username"
              name="username"
            />
          </div>

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

export default CreateUsernameModel;
