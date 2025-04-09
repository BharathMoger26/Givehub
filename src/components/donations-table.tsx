"use client";
import React from "react";
import dayjs from "dayjs";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CampaignType, DonationType, UserType } from "@/interfaces";

interface DonationsTableProps {
  donations: DonationType[];
  pagination?: any;
  fromAdmin: boolean;
  fromCampaign?: boolean;
}

function DonationsTable({
  donations,
  pagination,
  fromAdmin = false,
  fromCampaign = false,
}: DonationsTableProps) {
  const columns: ColumnsType<DonationType> = [
    !fromCampaign && {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (campaign: CampaignType | null) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {campaign?.name || "Deleted Campaign"}
        </span>
      ),
    },
    fromAdmin && {
      title: "User",
      dataIndex: "user",
      key: "user",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (user: UserType | null) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {user?.userName || "Anonymous"}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (amount: number) => (
        <span className="whitespace-nowrap text-sm text-green-600">
          ${amount}
        </span>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      responsive: ["md", "lg", "xl"], // Hidden on small devices
      render: (message: string) => (
        <span className="text-sm text-gray-600 break-words">{message}</span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (createdAt: Date) => (
        <span className="text-sm text-gray-700 whitespace-nowrap">
          {dayjs(createdAt).format("MMM DD, YYYY hh:mm A")}
        </span>
      ),
    },
  ].filter(Boolean) as ColumnsType<DonationType>; // Filter out falsy columns

  return (
    <div className="w-full overflow-x-auto">
      <Table
        dataSource={donations}
        columns={columns}
        pagination={pagination}
        scroll={{ x: 800 }} // Enables horizontal scroll on small devices
        rowKey={(record) => record._id}
        className="w-full min-w-[700px]"
      />
    </div>
  );
}

export default DonationsTable;
