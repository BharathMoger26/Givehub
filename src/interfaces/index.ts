export interface CampaignType {
  _id: string;
  name: string;
  organizer: string;
  description: string;
  images: string[];
  targetAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  showDonarsInCampaign: boolean;
  createdBy: UserType;
}

export interface UserType {
  _id: string;
  userName: string;
  email: string;
  profilePic: string;
  isActive: boolean;
  isAdmin: boolean;
  clerkUserId: string;
}

export interface DonationType {
  _id: string;
  amount: number;
  paymentId: string;
  campaign: CampaignType;
  user: UserType;
  message: string;
}
