"use client";

import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";

export default function CreateCampaignPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Create Campaign</h1>

      <ImageUploader onUploaded={setImageUrls} />

      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Uploaded ${i}`}
              width={200}
              className="rounded-lg shadow-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}
