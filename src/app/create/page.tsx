"use client";

import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";

export default function CreateCampaignPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        Create Campaign
      </h1>

      <ImageUploader onUploaded={setImageUrls} />

      {imageUrls.length > 0 && (
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Uploaded ${i}`}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs rounded-lg shadow-md object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
