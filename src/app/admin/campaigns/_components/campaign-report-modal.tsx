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
    getData();
  }, []);

  return (
    <Modal
      open={showCampaignReportModal}
      onCancel={() => setShowCampaignReportModal(false)}
      title=""
      footer={null}
      width="100%"
      style={{ top: 20 }}
      className="!max-w-[95%] md:!max-w-[90%] lg:!max-w-[1000px]"
    >
      <div className="flex flex-col gap-2 px-2 sm:px-4">
        <div>
          <span className="font-semibold text-gray-500 block">Campaign</span>
          <span className="text-sm font-semibold text-gray-700 block">
            {selectedCampaign?.name}
          </span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-center">{loading && <Spin />}</div>

        {data && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <div className="mt-6">
              <h1 className="text-sm font-semibold text-primary mb-2">
                Donations
              </h1>
              <div className="overflow-x-auto">
                <DonationsTable
                  fromCampaign={true}
                  donations={data.donations}
                  fromAdmin={true}
                  pagination={true}
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
