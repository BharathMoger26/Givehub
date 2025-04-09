"use client";
import React, { useEffect } from "react";
import { message, Modal, Spin } from "antd";
import { getCampaignReportsById } from "@/actions/campaigns";
import DashboardCard from "@/components/dashboard-card";
import DonationsTable from "@/components/donations-table";
import { CampaignType } from "@/interfaces";

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
    if (selectedCampaign?._id) getData();
  }, [selectedCampaign]);

  return (
    <Modal
      open={showCampaignReportModal}
      onCancel={() => setShowCampaignReportModal(false)}
      title={null}
      footer={null}
      centered
      width="100%"
      style={{ top: 20 }}
      className="!max-w-[95%] sm:!max-w-[90%] lg:!max-w-[1000px]"
    >
      <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Campaign Title */}
        <div>
          <p className="text-sm text-gray-500 font-medium">Campaign</p>
          <p className="text-base text-gray-800 font-semibold mt-1">
            {selectedCampaign?.name}
          </p>
        </div>

        <hr className="border-gray-200" />

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        )}

        {/* Report Content */}
        {!loading && data && (
          <div className="flex flex-col gap-8">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                cardTitle="Total Donations"
                value={data.donationsCount.toString()}
                description="Total number of donations for this campaign"
              />
              <DashboardCard
                cardTitle="Total Amount Raised"
                value={`$${data.totalAmountRaised}`}
                description="Sum of all donations collected for this campaign"
              />
            </div>

            {/* Donations Table */}
            <div>
              <h2 className="text-base font-semibold text-primary mb-3">
                Donations
              </h2>
              <div className="overflow-auto max-w-full">
                <DonationsTable
                  fromCampaign
                  donations={data.donations}
                  fromAdmin
                  pagination
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default CampaignReportsModal;
