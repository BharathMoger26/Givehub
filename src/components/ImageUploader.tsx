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
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (file: RcFile) => {
    setUploading(true);

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

    setUploading(false);
    return false;
  };

  return (
    <div className="flex justify-center w-full px-4">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <Upload
          customRequest={({ file }) => handleUpload(file as RcFile)}
          showUploadList={false}
          multiple
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={uploading}
            type="primary"
            className="w-full text-base py-2"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
        </Upload>
        {/* Optional: Preview uploaded image URLs */}
        {uploadedUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {uploadedUrls.map((url, index) => (
              <div
                key={index}
                className="w-full h-32 overflow-hidden rounded shadow"
              >
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
