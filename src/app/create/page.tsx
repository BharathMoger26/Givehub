"use client";

import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";

export default function CreateCampaignPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 max-w-screen-2xl mx-auto w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center md:text-left text-gray-800">
        Create Campaign
      </h1>

      {/* Image Upload Section */}
      <div className="mb-10">
        <ImageUploader onUploaded={setImageUrls} />
      </div>

      {/* Preview Section */}
      {imageUrls.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center md:text-left">
            Uploaded Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {imageUrls.map((url, i) => (
              <div
                key={i}
                className="w-full aspect-video overflow-hidden rounded-xl shadow-lg border border-gray-200"
              >
                <img
                  src={url}
                  alt={`Uploaded ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
