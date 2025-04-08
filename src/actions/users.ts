"use server";
import { connectDB } from "@/db/config";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs/server";

connectDB();

export const handleNewUserRegistration = async () => {
  try {
    const loggedInUserData = await currentUser();
    console.log("user", loggedInUserData);

    //Check whether the user already exists or not
    const existedUser = await UserModel.findOne({
      clerkUserId: loggedInUserData?.id,
    });

    if (existedUser) return existedUser;

    //Create New USer
    let username = loggedInUserData?.username;
    if (!username) {
      username = loggedInUserData?.firstName + " " + loggedInUserData?.lastName;
      username.replace("undefined", "");
    }

    const newUser = new UserModel({
      clerkUserId: loggedInUserData?.id,
      userName: username,
      email: loggedInUserData?.emailAddresses[0].emailAddress,
      profilePic: loggedInUserData?.imageUrl,
    });
    await newUser.save();
    return newUser;
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUserFromMongoDB = async () => {
  try {
    const loggedInUserData = await currentUser();
    const mongoUser = await UserModel.findOne({
      clerkUserId: loggedInUserData?.id,
    });
    return {
      data: JSON.parse(JSON.stringify(mongoUser)),
    };
  } catch (error: any) {
    return { error: error.message };
  }
};
