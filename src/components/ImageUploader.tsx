// components/ImageUploader.tsx
"use client";

import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import React from "react";

interface Props {
  onUploaded: (urls: string[]) => void;
}

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "givehub";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dew4bmwif";

const ImageUploader: React.FC<Props> = ({ onUploaded }) => {
  const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]);

  const handleUpload = async (file: RcFile) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Cloudinary response:", data); // Debug log

      if (data.secure_url) {
        const updatedUrls = [...uploadedUrls, data.secure_url];
        setUploadedUrls(updatedUrls);
        onUploaded(updatedUrls);
        message.success(`${file.name} uploaded successfully.`);
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error.message);
      message.error("Upload failed.");
    }

    return false; // Prevent default upload behavior
  };

  return (
    <Upload
      customRequest={({ file }) => handleUpload(file as RcFile)}
      showUploadList={false}
      multiple
    >
      <Button icon={<UploadOutlined />}>Upload Images</Button>
    </Upload>
  );
};

export default ImageUploader;
