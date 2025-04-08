"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary px-4 sm:px-6 md:px-8 py-6">
      <div className="w-full max-w-md">
        <SignIn path="/sign-in" routing="path" />
      </div>
    </div>
  );
}
