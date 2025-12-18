"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface QuickChatBitProps {
  RecentImageEdits: any;
  RecentImageGen: any;
}

const QuickImageBit = ({
  RecentImageEdits,
  RecentImageGen,
}: QuickChatBitProps) => {
  const [editIndex, setEditIndex] = useState(0);

  const EDITS_VISIBLE = 2; // better for side-by-side images
  const maxEditIndex = Math.max(0, RecentImageEdits.length - EDITS_VISIBLE);

  const nextEdit = () => {
    setEditIndex((prev) => Math.min(prev + 1, maxEditIndex));
  };

  const prevEdit = () => {
    setEditIndex((prev) => Math.max(prev - 1, 0));
  };

  const [imgIndex, setImgIndex] = useState(0);

  const ITEMS_VISIBLE = 3;
  const maxIndex = Math.max(0, RecentImageGen.length - ITEMS_VISIBLE);

  const nextImages = () => {
    setImgIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevImages = () => {
    setImgIndex((prev) => Math.max(prev - 1, 0));
  };
  return (
    <div
      className="max-w-4xl mx-auto p-8 rounded-3xl shadow-xl 
    bg-slate-800/40 border border-white/10 backdrop-blur-md
    bg-gradient-to-br from-slate-700/20 via-slate-800/30 to-slate-900/20
    hover:border-purple-200/30 transition-all duration-300"
    >
      <header>
        <h3 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent mt-12">
          Quick Gen
        </h3>
        <p className="text-slate-300">generate images</p>
      </header>

      <form>
        <select name="filtered-posts" id="filtered-posts">
          <option value="recent">Recent</option>
          <option value="mostViewed">Most Viewed</option>
          <option value="lastHour">Finaly Hour</option>
        </select>
      </form>

      <div className="relative mt-8">
        {/* Arrows */}
        <button
          onClick={prevImages}
          disabled={imgIndex === 0}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10
  px-3 py-2 rounded-full bg-slate-700/60 border border-white/10
  hover:border-purple-300/40 disabled:opacity-30 transition"
        >
          ←
        </button>

        <button
          onClick={nextImages}
          disabled={imgIndex === maxIndex}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10
  px-3 py-2 rounded-full bg-slate-700/60 border border-white/10
  hover:border-purple-300/40 disabled:opacity-30 transition"
        >
          →
        </button>

        {/* Viewport */}
        <div className="overflow-hidden">
          {/* Track */}
          <div
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${imgIndex * (100 / ITEMS_VISIBLE)}%)`,
            }}
          >
            {RecentImageGen.map((image:any) => (
              <div
                key={image.id}
                className="min-w-[33.333%] bg-slate-700/50 p-4 rounded-xl 
                 border border-white/10 backdrop-blur-md"
              >
                <div className="w-full h-40 relative mb-4">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>

                <h3 className="font-semibold text-slate-100">{image.title}</h3>

                <p className="text-slate-300 text-sm mt-1">
                  {new Date(image.timestamp).toLocaleString()}
                </p>

                <Link
                  href={`/imageGen/${image.id}`}
                  className="inline-block mt-2 text-sm text-purple-300 hover:text-purple-200"
                >
                  View More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Edits */}
      <div className="mt-16">
        <header className="mb-4">
          <h3 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
            Recent Edits
          </h3>
          <p className="text-slate-300 text-sm">
            before & after image enhancements
          </p>
        </header>

        <div className="relative mt-6">
          {/* Arrows */}
          <button
            onClick={prevEdit}
            disabled={editIndex === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10
  px-3 py-2 rounded-full bg-slate-700/60 border border-white/10
  hover:border-purple-300/40 disabled:opacity-30 transition"
          >
            ←
          </button>

          <button
            onClick={nextEdit}
            disabled={editIndex === maxEditIndex}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
  px-3 py-2 rounded-full bg-slate-700/60 border border-white/10
  hover:border-purple-300/40 disabled:opacity-30 transition"
          >
            →
          </button>

          {/* Viewport */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${editIndex * (100 / EDITS_VISIBLE)}%)`,
              }}
            >
              {RecentImageEdits.map((edit:any) => (
                <div
                  key={edit.id}
                  className="min-w-[50%] bg-slate-700/50 p-5 rounded-2xl
        border border-white/10 backdrop-blur-md"
                >
                  {/* Images */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden">
                      <Image
                        src={edit.imageUrl}
                        alt="before edit"
                        fill
                        className="object-cover"
                      />
                      <span
                        className="absolute bottom-1 left-1 text-[10px] px-2 py-[2px]
              rounded bg-black/50 text-white"
                      >
                        Before
                      </span>
                    </div>

                    <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden">
                      <Image
                        src={edit.imageUpdate}
                        alt="after edit"
                        fill
                        className="object-cover"
                      />
                      <span
                        className="absolute bottom-1 left-1 text-[10px] px-2 py-[2px]
              rounded bg-black/50 text-white"
                      >
                        After
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <h4 className="font-semibold text-slate-100 truncate">
                    {edit.title}
                  </h4>

                  <p className="text-slate-400 text-xs mt-1">
                    {new Date(edit.timestamp).toLocaleString()}
                  </p>

                  <Link
                    href={`/imageEdit/${edit.id}`}
                    className="inline-block mt-2 text-sm text-purple-300 hover:text-purple-200"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickImageBit;
