"use server";

// Mongoose SideEffect Imports
import "../modals/AgentMessage";

import { AgentHistory, IAgentHistory } from "../modals/AgentHistory";
import dbConnect from "./db";
import { Agent, run } from "@openai/agents";
import { AgentMessage, IAgentMessage } from "../modals/AgentMessage";
import { revalidatePath } from "next/cache";
import { AgentOffical } from "../modals/AgentOffical";
import { Types } from "mongoose";

// TYPES
export type AgentHistoryPopulated = Omit<IAgentHistory, "messages"> & {
  _id: Types.ObjectId;
  messages: Types.ObjectId[] | IAgentMessage[];
  ParentAgent: any; //TODO FIX this
};

type GetAgentHistoryResult =
  | { status: "success"; message: AgentHistoryPopulated }
  | { status: "error"; message: string };

// Funnctions
export const GetSingleAgentHistory = async (
  id: string
): Promise<GetAgentHistoryResult> => {
  try {
    await dbConnect();

    const agentHistory = await AgentHistory.findById(id)
      .populate({
        path: "owner",
        select: "username image",
      })
      .populate({
        path: "ParentAgent",
      })
      .populate({
        path: "messages",
      })
      .lean<AgentHistoryPopulated>();

    if (!agentHistory) {
      return { status: "error", message: "Agent history not found" };
    }

    return { status: "success", message: agentHistory };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch agent history" };
  }
};

export const GetAllAgents = async () => {
  try {
    await dbConnect();

    const agents = await AgentOffical.find().lean();

    return { status: "success", message: agents };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch agents" };
  }
};

export const GetAllUserAgents = async (userId: string) => {
  try {
    await dbConnect();

    const agents = await AgentOffical.find({ owner: userId as any }).lean();

    return { status: "success", message: agents };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch user agents" };
  }
};

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

    const agentHistories = await AgentHistory.find({
      owner: userId as any,
    }).populate("messages");

    return { status: "success", message: agentHistories };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to fetch user agent histories" };
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

export const UpdateChatTitle = async (payload: any) => {
  const { chatId, title } = payload;
  try {
    await dbConnect();

    const updated = await AgentHistory.findByIdAndUpdate(
      chatId,
      { title },
      { new: true }
    );

    revalidatePath(`/chat/${chatId}`);

    return { status: "success", message: updated };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to change chat title" };
  }
};

export const CreateChatMessage = async (payload: any) => {
  const { chatId, userChat, userId } = payload;
  try {
    await dbConnect();

    const currentAgent = await AgentHistory.findById(chatId).populate(
      "ParentAgent"
    ).lean<AgentHistoryPopulated>();

    const agent = new Agent({
      name: currentAgent?.ParentAgent?.Agentname,
      instructions: currentAgent?.ParentAgent?.instructions,
      model: "gpt-5-nano",
    });

    const result = await run(agent as any, userChat);
    console.log(result.finalOutput);
    console.log(result);

    const newMessage = new AgentMessage({
      owner: userId,
      message: userChat,
      botMessage: result.finalOutput,
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
