"use client";

import React from "react";
import { Button, message, Table } from "antd";
import { useRouter } from "next/navigation";
import { deleteCampaign } from "@/actions/campaigns";
import CampaignReportsModal from "./campaign-report-modal";
import { CampaignType } from "@/interfaces";
import type { ColumnsType } from "antd/es/table";

// ✅ Declare Breakpoint type locally instead of importing internal AntD module
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

interface Props {
  campaigns: CampaignType[];
  pagination?: any;
}

function CampaignsTable({ campaigns, pagination = true }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] =
    React.useState<CampaignType | null>(null);
  const [showReportModal, setShowReportModal] = React.useState<boolean>(false);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const result = await deleteCampaign(id);
      if (result.error) throw new Error(result.error);
      message.success("Campaign deleted successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<CampaignType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["md", "lg"] as Breakpoint[],
      render: (category: string) => <span>{category.toUpperCase()}</span>,
    },
    {
      title: "Target Amount",
      dataIndex: "targetAmount",
      key: "targetAmount",
      responsive: ["md", "lg"] as Breakpoint[],
      render: (targetAmount: number) => `$${targetAmount}`,
    },
    {
      title: "Collected Amount",
      dataIndex: "collectedAmount",
      key: "collectedAmount",
      responsive: ["md", "lg"] as Breakpoint[],
      render: (collectedAmount: number) => `$${collectedAmount}`,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      responsive: ["lg"] as Breakpoint[],
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      responsive: ["lg"] as Breakpoint[],
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_: any, record: CampaignType) => (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setSelectedCampaign(record);
              setShowReportModal(true);
            }}
            size="small"
          >
            Report
          </Button>
          <Button
            onClick={() =>
              router.push(`/admin/campaigns/edit-campaign/${record._id}`)
            }
            size="small"
            icon={<i className="ri-pencil-line"></i>}
          />
          <Button
            size="small"
            onClick={() => onDelete(record._id)}
            icon={<i className="ri-delete-bin-line"></i>}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={campaigns}
        loading={loading}
        rowKey="_id"
        pagination={pagination}
        scroll={{ x: 1000 }}
        className="min-w-[700px] w-full sm:min-w-[900px] lg:min-w-[1000px]"
      />
      {showReportModal && (
        <CampaignReportsModal
          showCampaignReportModal={showReportModal}
          setShowCampaignReportModal={setShowReportModal}
          selectedCampaign={selectedCampaign}
        />
      )}
    </div>
  );
}

export default CampaignsTable;
