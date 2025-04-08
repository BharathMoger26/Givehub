"use client";
import React, { useEffect } from "react";
import { message, Modal, Spin } from "antd";
import { getCampaignReportsById } from "@/actions/campaigns";
import DashboardCard from "@/components/dashboard-card";
import DonationsTable from "@/components/donations-table";
import { CampaignType } from "@/interfaces"; // ✅ Import added

interface Props {
  showCampaignReportModal: boolean;
  setShowCampaignReportModal: (show: boolean) => void;
  selectedCampaign: CampaignType | null;
}

function CampaignReportsModal({
  showCampaignReportModal,
  setShowCampaignReportModal,
  selectedCampaign,
}: Props) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);
      const result = await getCampaignReportsById(selectedCampaign?._id!);
      if (result.error) throw new Error(result.error);
      setData(result.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      open={showCampaignReportModal}
      onCancel={() => setShowCampaignReportModal(false)}
      title=""
      footer={null}
      width={1000}
    >
      <div className="flex flex-col">
        <span className="font-semibold text-gray-500 block">Campaign</span>
        <span className="text-sm font-semibold text-gray-700 block">
          {selectedCampaign?.name}
        </span>
      </div>
      <hr className="my-5" />
      <div className="flex justify-center">{loading && <Spin />}</div>
      {data && (
        <div>
          <div className="grid grid-cols-3 gap-5">
            <DashboardCard
              cardTitle="Total Donations"
              value={data.donationsCount.toString()}
              description="Total number of donations done by users for this campaign"
            />
            <DashboardCard
              cardTitle="Total Amount Raised"
              value={`$${data.totalAmountRaised}`}
              description="Total amount raised by this campaign through all donations till date"
            />
          </div>
          <div className="mt-5">
            <h1 className="text-sm font-semibold text-primary">Donations</h1>
            <DonationsTable
              fromCampaign={true}
              donations={data.donations}
              fromAdmin={true}
              pagination={true}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CampaignReportsModal;
