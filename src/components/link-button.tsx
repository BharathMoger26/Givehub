"use client";
import { Button } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

interface LinkButtonProps {
  title: string;
  path: string;
  type?: "primary" | "default";
  fullWidth?: boolean; // Optional: make button full width on smaller screens
}

function LinkButton({
  title,
  path,
  type = "default",
  fullWidth = false,
}: LinkButtonProps) {
  const router = useRouter();

  return (
    <Button
      type={type}
      onClick={() => router.push(path)}
      className={`${
        fullWidth ? "w-full" : "w-max"
      } px-4 py-2 text-sm sm:text-base`}
    >
      {title}
    </Button>
  );
}

export default LinkButton;
