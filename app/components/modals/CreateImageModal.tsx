"use client";

import { useModal } from "@/app/hooks/use-modal-store";
import { CreateImageAction } from "@/app/lib/actions";
import { FileToBase64 } from "@/app/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const CreateImageModal = () => {
  const { isOpen, onClose, type, signature } = useModal();
  const isModalOpen = isOpen && type === "CreateImage";
  const router = useRouter()

  const [preview, setPreview] = useState<string | null>(null);

  const HandleAgentCreation = async (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    try {
      const agentContext = form.context.value;
      const baseImage = form.baseImage.files[0];

      const base64Image = baseImage ? await FileToBase64(baseImage) : null;

      const res = (await CreateImageAction({
        context: agentContext,
        baseImage: base64Image,
        userId: signature
      })) as any;

      if(res.status === "success") {
        router.push(`/imageGen/${res.message?.urlID}`);
      }

      toast.success("image created");
      form.reset();
      setPreview(null);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create agent");
    }
  };

  const handleImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isModalOpen ? "flex" : "hidden"
      } items-center justify-center`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative w-full max-w-md rounded-xl
          bg-zinc-900 border border-zinc-800
          shadow-xl p-6 text-zinc-100
        "
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Create Image</h2>
          <p className="text-sm text-zinc-400 mt-1">Create an image</p>
        </div>

        <form onSubmit={HandleAgentCreation} className="space-y-4">
          {/* Image Preview */}
          <div className="flex items-center gap-4">
            <div
              className="
                w-16 h-16 rounded-full
                bg-zinc-800 border border-zinc-700
                flex items-center justify-center
                overflow-hidden
                relative
              "
            >
              {preview ? (
                <Image src={preview} alt="Preview" fill />
              ) : (
                <span className="text-xs text-zinc-500">No Image</span>
              )}
            </div>

            <label
              className="
                text-sm text-zinc-400 cursor-pointer
                hover:text-zinc-200 transition
              "
            >
              Upload base image
              <input
                type="file"
                name="baseImage"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImagePreview(e.target.files[0])
                }
              />
            </label>
          </div>

          {/* context */}
          <div>
            <label className="text-sm text-zinc-400">context</label>
            <textarea
              name="context"
              rows={3}
              placeholder="Describe the what..."
              className="
                w-full h-[300px] mt-1 px-3 py-2 rounded-md resize-none
                bg-zinc-800 border border-zinc-700
                focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500
                outline-none transition
              "
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-md
                bg-zinc-800 hover:bg-zinc-700
                text-zinc-300 text-sm transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-4 py-2 rounded-md
                bg-zinc-200 text-zinc-900
                hover:bg-white transition
                text-sm font-medium
              "
            >
              Create
            </button>
          </div>
        </form>

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CreateImageModal;
