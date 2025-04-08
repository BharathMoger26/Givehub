"use client";
import React from "react";
import dayjs from "dayjs";
import { Table } from "antd";

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
      render: (campaign: CampaignType | null) => {
        return <span>{campaign?.name || "Deleted Campaign"}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => {
        return <span>${amount}</span>;
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) => {
        return <span>{dayjs(createdAt).format("MMMM DD, YYYY hh:mm A")}</span>;
      },
    },
  ];

  if (fromAdmin) {
    // Add user column after campaign column
    columns.splice(1, 0, {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: UserType | null) => {
        return <span>{user?.userName || "Anonymous"}</span>;
      },
    });
  }

  if (fromCampaign)
    columns = columns.filter((column) => column.key !== "campaign");

  return (
    <div>
      <Table
        dataSource={donations}
        columns={columns}
        pagination={pagination}
        rowKey={(record) => record._id} // Ensure a unique key for each row
      />
    </div>
  );
}

export default DonationsTable;
