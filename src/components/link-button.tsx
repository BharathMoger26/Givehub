"use client";

import { Button } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

interface LinkButtonProps {
  title: string;
  path: string;
  type?: "primary" | "default" | "link" | "text" | "dashed";
  fullWidth?: boolean;
  size?: "small" | "middle" | "large";
  className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  title,
  path,
  type = "default",
  fullWidth = false,
  size = "middle",
  className = "",
}) => {
  const router = useRouter();

  return (
    <Button
      type={type}
      size={size}
      onClick={() => router.push(path)}
      className={`
        transition-all duration-300 ease-in-out
        ${fullWidth ? "w-full" : "w-auto"}
        px-4 py-2 rounded-md font-medium
        text-sm sm:text-base
        ${className}
      `}
    >
      {title}
    </Button>
  );
};

export default LinkButton;
