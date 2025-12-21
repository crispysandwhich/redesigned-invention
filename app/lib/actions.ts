"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createToken } from "./jwt";
import dbConnect from "./db";
import { User } from "../modals/User";
import { Agent } from "../modals/Agent";
import { AgentHistory } from "../modals/AgentHistory";
import { AgentMessage } from "../modals/AgentMessage";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return { isLoggedIn: false };

  return {
    isLoggedIn: true,
    token,
  };
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", "", { expires: new Date(0), path: "/" });
  return { status: "success" };
};

export const HandleCredentialSignin = async (payload: any) => {
  const { email, password, firstTime } = payload;
  const cookieStore = await cookies();
  try {
    await dbConnect();

    let currentUser = await User.findOne({ email }).lean();

    // Register
    if (!currentUser && firstTime) {
      const hash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hash,
      });

      const token = createToken({
        userId: newUser._id.toString(),
        role: newUser.role,
        metaAddress: newUser.metaAddress || null,
        username: newUser.username,
      });

      cookieStore.set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      return { status: "success", message: "User created successfully" };
    }

    // Login
    if (!currentUser) return { status: "error", message: "User not found" };

    const match = await bcrypt.compare(password, currentUser.password);
    if (!match) return { status: "error", message: "Invalid credentials" };

    const token = createToken({
      userId: currentUser._id.toString(),
      role: currentUser.role,
      metaAddress: currentUser.metaAddress || null,
      username: currentUser.username,
    });

    cookieStore.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return { status: "success", message: "Logged in successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Internal server error" };
  }
};

export const HandleWalletSignin = async (payload: any) => {
  const { metaAddress, signature, firstTime } = payload;
  const cookieStore = await cookies();

  try {
    await dbConnect();

    let currentUser = await User.findOne({ sig: signature }).lean();

    if (!currentUser && firstTime) {
      const newUser = await User.create({ metaAddress, sig: signature });
      const token = createToken({
        userId: newUser._id.toString(),
        role: newUser.role,
        metaAddress,
      });

      cookieStore.set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      return { status: "success", message: "User created successfully" };
    }

    if (!currentUser || currentUser.sig !== signature)
      return { status: "error", message: "Invalid wallet" };

    const token = createToken({
      userId: currentUser._id.toString(),
      role: currentUser.role,
      metaAddress,
    });

    cookieStore.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return { status: "success", message: "Logged in successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Internal server error" };
  }
};

export const CreateAgentAction = async (payload: any) => {
  const { agentName, agentInstructions, user, profileImage } = payload;
  try {
    await dbConnect();

    const [meta, base64Data] = profileImage.split(",");
    const extension = meta.match(/image\/(.*?);/)?.[1] || "png";
    const buffer = Buffer.from(base64Data, "base64");
    const filename = `${Date.now()}-${user}.${extension}`;
    const filePath = path.join(
      process.cwd(),
      "public/agents",
      filename
    );

    await fs.writeFile(filePath, buffer);

    const newAgent = new Agent({
      Agentname: agentName,
      instructions: agentInstructions,
      owner: user,
      profileImage,
      profileImageUrl: `/agents/${filename}`
    });

    await newAgent.save();

    return { status: "success", message: "Agent created successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create agent" };
  }
};

export const GetAllAgents = async () => {
  try {
    await dbConnect();

    const agents = await Agent.find().lean();

    return { status: "success", message: agents };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch agents" };
  }
};

export const GetAllUserAgents = async (userId: string) => { 
  try {
    await dbConnect();

    const agents = await Agent.find({ owner: userId as any }).lean();

    return { status: "success", message: agents };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch user agents" };
  }
}

export const GetAllAgentHistories = async () => {
  try {
    await dbConnect();

    const agentHistories = await AgentHistory.find().lean();

    return { status: "success", message: agentHistories };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch agent histories" };
  }
};

export const GetAllUserAgentHistories = async (userId: string) => { 
  try {
    await dbConnect();

    const agentHistories = await AgentHistory.find({ owner: userId as any }).populate("messages");

    return { status: "success", message: agentHistories };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch user agent histories" };
  }
}

export const GetSingleAgentHistory = async (id: string) => {
  try {
    await dbConnect();

    const agentHistory = await AgentHistory.findById(id)
      .populate({
        path: "messages",
        populate: {
          path: "owner",
          model: "User",
          select: "username metaAddress image email", // optional
        },
      })
      .lean();

    return { status: "success", message: agentHistory };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch agent history" };
  }
};

export const CreateChatAgentSession = async (payload: any) => {
  const { agent, user } = payload;
  try {
    await dbConnect();

    const chatSession = new AgentHistory({
      owner: user,
      ParentAgent: agent,
    });

    await chatSession.save();

    return { status: "success", message: chatSession._id.toString() };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create chat session" };
  }
};

export const CreateChatMessage = async (payload: any) => {
  const { chatId, userChat, userId } = payload;
  try {
    await dbConnect();

    const newMessage = new AgentMessage({
      owner: userId,
      message: userChat,
      botMessage: "Hi am pratyush! Functionality coming soon...",
    });

    await newMessage.save();

    const updatedAgentHistory = await AgentHistory.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
      },
      { new: true }
    );

    await updatedAgentHistory?.save();

    revalidatePath(`/chat/${chatId}`);
    return {
      status: "success",
      message: `Functionality coming soon! ${chatId} and ${userChat} by ${userId}`,
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create chat message" };
  }
};
