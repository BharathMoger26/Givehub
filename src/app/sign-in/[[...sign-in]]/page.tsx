"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-8">
      <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <SignIn path="/sign-in" routing="path" />
      </div>
    </div>
  );
}
