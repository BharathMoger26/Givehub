"use client";

import { Button, Form, Input, Select, Switch, message } from "antd";
import React from "react";
import ImageUploader from "@/components/ImageUploader";
import { addNewCampaign, editCampaign } from "@/actions/campaigns";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

const categories = [
  { value: "medical", label: "Medical" },
  { value: "education", label: "Education" },
  { value: "emergency", label: "Emergency" },
  { value: "environment", label: "Environment" },
  { value: "others", label: "Others" },
];

interface Props {
  initialData?: any;
  isEditForm?: boolean;
}

function CampaignForm({ initialData, isEditForm = false }: Props) {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = React.useState(
    initialData?.isActive || false
  );
  const [showDonarsInCampaign, setShowDonarsInCampaign] = React.useState(
    initialData?.showDonarsInCampaign || false
  );
  const [images, setImages] = React.useState<string[]>(
    initialData?.images || []
  );
  const router = useRouter();

  const onFinish = async (values: any) => {
    if (!isEditForm && images.length === 0) {
      message.warning("Please upload at least one image.");
      return;
    }

    values.isActive = isActive;
    values.showDonarsInCampaign = showDonarsInCampaign;
    values.images = images;

    let response: any = null;

    if (isEditForm) {
      values._id = initialData._id;
      response = await editCampaign(values);
    } else {
      response = await addNewCampaign(values);
    }

    if (response.error) {
      message.error(response.error);
      return;
    }

    message.success(response.message);
    form.resetFields();
    setIsActive(false);
    setShowDonarsInCampaign(false);
    setImages([]);
    router.push("/admin/campaigns");
  };

  const handleDeleteImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={initialData}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-10"
    >
      {/* Main Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Name */}
        <Form.Item
          label="Name"
          name="name"
          className="col-span-full"
          rules={[{ required: true, message: "Please insert a name" }]}
        >
          <Input />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          className="col-span-full"
          rules={[{ required: true, message: "Please insert a description" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Organizer"
          name="organizer"
          rules={[
            { required: true, message: "Please insert the organizer name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Target Amount"
          name="targetAmount"
          rules={[{ required: true, message: "Please input target amount" }]}
        >
          <Input type="number" min={100} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select options={categories} />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please enter the Start Date" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please enter the End Date" }]}
        >
          <Input type="date" />
        </Form.Item>
      </div>

      {/* Image Upload */}
      <div className="mt-8">
        <label className="block font-semibold mb-2 text-gray-800">
          Upload Campaign Images
        </label>
        <ImageUploader onUploaded={setImages} />

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-28 object-cover rounded-lg border shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Is Active?</span>
          <Switch checked={isActive} onChange={setIsActive} />
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Show Donors?</span>
          <Switch
            checked={showDonarsInCampaign}
            onChange={setShowDonarsInCampaign}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 mt-10">
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/admin/campaigns")}
        >
          Cancel
        </Button>
        <Button className="w-full sm:w-auto" type="primary" htmlType="submit">
          {isEditForm ? "Update Campaign" : "Create Campaign"}
        </Button>
      </div>
    </Form>
  );
}

export default CampaignForm;
