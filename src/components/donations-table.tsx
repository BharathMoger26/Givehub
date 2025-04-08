"use client";
import React from "react";
import dayjs from "dayjs";
import { Table } from "antd";
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
  let columns: any[] = [
    {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (campaign: CampaignType | null) => {
        return <span>{campaign?.name || "Deleted Campaign"}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (amount: number) => {
        return <span>${amount}</span>;
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      responsive: ["sm", "md", "lg", "xl"], // Hide on extra-small screens
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (createdAt: Date) => {
        return <span>{dayjs(createdAt).format("MMMM DD, YYYY hh:mm A")}</span>;
      },
    },
  ];

  if (fromAdmin) {
    columns.splice(1, 0, {
      title: "User",
      dataIndex: "user",
      key: "user",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (user: UserType | null) => {
        return <span>{user?.userName || "Anonymous"}</span>;
      },
    });
  }

  if (fromCampaign) {
    columns = columns.filter((column) => column.key !== "campaign");
  }

  return (
    <div className="overflow-x-auto w-full">
      <Table
        dataSource={donations}
        columns={columns}
        pagination={pagination}
        scroll={{ x: "max-content" }} // Enables horizontal scroll on small devices
        rowKey={(record) => record._id}
        className="min-w-[600px] sm:min-w-full"
      />
    </div>
  );
}

export default DonationsTable;
