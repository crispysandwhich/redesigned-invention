"use server";
import { cookies } from "next/headers";
import { User } from "../modals/User";
import dbConnect from "./db";
import { createToken } from "./jwt";

export const CreateUsername = async (payload: any) => {
  const { username, userId } = payload;
  try {
    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return { status: "error", message: "User not found" };
    }

    // 🔑 REISSUE TOKEN
    const token = createToken({
      userId: updatedUser._id.toString(),
      role: updatedUser.role,
      metaAddress: updatedUser.metaAddress || null,
      username: updatedUser.username,
    });

    // 🔑 OVERWRITE COOKIE
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return { status: "success", message: "Username updated" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create username" };
  }
};
