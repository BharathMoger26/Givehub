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

  const [category, setCategory] = React.useState<string>(
    searchParams.get("category") || ""
  );
  const [organizer, setOrganizer] = React.useState<string>(
    searchParams.get("organizer") || ""
  );

  const handleReset = () => {
    router.push(`/`);
    setCategory("");
    setOrganizer("");
  };

  const handleFilter = () => {
    router.push(`/?category=${category}&organizer=${organizer}`);
  };

  return (
    <div className="w-full my-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Category Filter */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Select Category
          </label>
          <Select
            options={options}
            value={category}
            onChange={(value) => setCategory(value)}
            className="w-full"
            size="large"
          />
        </div>

        {/* Organizer Filter */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Search by Organizer
          </label>
          <Input
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            className="w-full"
            size="large"
            placeholder="Enter organizer name"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:col-span-2 lg:col-span-2">
          <Button
            onClick={handleReset}
            className="w-full sm:w-1/2"
            size="large"
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleFilter}
            className="w-full sm:w-1/2"
            size="large"
          >
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Filters;
