import { handleNewUserRegistration } from "@/actions/users";
import CampaignCard from "@/components/campaign-card";
import Filters from "@/components/filters";
import { connectDB } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import { CampaignType } from "@/interfaces"; // ✅ Correct path to your types

connectDB();

export default async function Home({ searchParams }: { searchParams: any }) {
  await handleNewUserRegistration();

  const filters: any = {
    isActive: true,
  };

  if (searchParams.category) {
    filters.category = searchParams.category;
  }

  if (searchParams.organizer) {
    filters.organizer = {
      $regex: searchParams.organizer,
      $options: "i",
    };
  }

  // ✅ Use lean + JSON trick to make it compatible with your CampaignType
  const result = await CampaignModel.find(filters)
    .sort({ createdAt: -1 })
    .lean();

  const campaigns = JSON.parse(JSON.stringify(result)) as CampaignType[];

  return (
    <div>
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
