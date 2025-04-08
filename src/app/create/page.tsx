"use client";

import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";

export default function CreateCampaignPage() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div>
      <h1>Create Campaign</h1>
      <ImageUploader onUploaded={(url) => setImageUrl(url)} />
      {imageUrl && <img src={imageUrl} alt="Uploaded Image" width={300} />}
    </div>
  );
}
