import { handleNewUserRegistration } from "@/actions/users";
import CampaignCard from "@/components/campaign-card";
import Filters from "@/components/filters";
import { connectDB } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import { CampaignType } from "@/interfaces";

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

  const result = await CampaignModel.find(filters)
    .sort({ createdAt: -1 })
    .lean();

  const campaigns = JSON.parse(JSON.stringify(result)) as CampaignType[];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8">
      {/* Filters Section */}
      <Filters />

      {/* Campaign Grid Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </section>
    </main>
  );
}
