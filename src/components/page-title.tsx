import React from "react";

interface PageTitleProps {
  title: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  align = "left",
  className = "",
}) => {
  return (
    <h1
      className={`
        text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        font-bold text-primary leading-tight
        text-${align}
        break-words tracking-tight
        ${className}
      `}
    >
      {title}
    </h1>
  );
};

export default PageTitle;
