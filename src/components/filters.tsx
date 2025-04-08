"use client";
import { Button, Input, Select } from "antd";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "", label: "All" },
  { value: "medical", label: "Medical" },
  { value: "education", label: "Education" },
  { value: "emergency", label: "Emergency" },
  { value: "environment", label: "Environment" },
  { value: "others", label: "Others" },
];

function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category = "", setCategory] = React.useState<string>(
    searchParams.get("category") || ""
  );
  const [organizer = "", setOrganizer] = React.useState<string>(
    searchParams.get("organizer") || ""
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5 items-end w-full">
      {/* Category Filter */}
      <div className="flex flex-col w-full">
        <span className="text-sm font-semibold text-gray-500 mb-1">
          Select Category
        </span>
        <Select
          options={options}
          value={category}
          onChange={(value) => setCategory(value)}
          className="w-full"
        />
      </div>

      {/* Organizer Filter */}
      <div className="flex flex-col w-full">
        <span className="text-sm font-semibold text-gray-500 mb-1">
          Search by Organizer
        </span>
        <Input
          value={organizer}
          onChange={(e: any) => setOrganizer(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 w-full sm:col-span-2 lg:col-span-1">
        <Button
          onClick={() => {
            router.push(`/`);
            setCategory("");
            setOrganizer("");
          }}
          className="w-full sm:w-auto"
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            router.push(`/?category=${category}&organizer=${organizer}`);
          }}
          type="primary"
          className="w-full sm:w-auto"
        >
          Filter
        </Button>
      </div>
    </div>
  );
}

export default Filters;
