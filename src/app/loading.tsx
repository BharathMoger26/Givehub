import React from "react";

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen fixed inset-0">
      <div className="h-5 w-5 border-4 border-primary border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Loading;
