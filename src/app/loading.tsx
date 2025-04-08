import React from "react";

function Loading() {
  return (
    <div
      className="flex justify-center items-center h-screen w-screen fixed inset-0 bg-white/60 z-50"
      role="status"
      aria-label="Loading"
    >
      <div
        className="h-8 w-8 sm:h-10 sm:w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      ></div>
    </div>
  );
}

export default Loading;
