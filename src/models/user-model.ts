import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//Check if the user model already exists, if its exists delete it
if (mongoose.models && mongoose.models["users"])
  delete mongoose.models["users"];

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
