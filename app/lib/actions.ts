"use server";

import { cookies } from "next/headers";
import { User } from "../modals/User";
import OpenAI from "openai";

import { AgentHistory } from "../modals/AgentHistory";
import { AgentMessage } from "../modals/AgentMessage";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { createToken } from "./jwt";
import dbConnect from "./db";
import fs from "fs/promises";
import path from "path";
import { AgentOffical } from "../modals/AgentOffical";
import { ResponseOutputItem } from "openai/resources/responses/responses.js";


const openai = new OpenAI();

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
    const filePath = path.join(process.cwd(), "public/agents", filename);

    await fs.writeFile(filePath, buffer);

    const newAgent = new AgentOffical({
      Agentname: agentName,
      instructions: agentInstructions,
      owner: user,
      profileImage,
      profileImageUrl: `/agents/${filename}`,
    });

    await newAgent.save();
    revalidatePath(`/dashboard`);
    return { status: "success", message: "Agent created successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create agent" };
  }
};

export const CreateImageAction = async (payload: any) => {
  const { context, baseImage, userId } = payload;

  try {
    await dbConnect();

    const agentsPath = new AgentHistory({
      owner: userId,
      imageHistory: true,
    });

    await agentsPath.save();

    let response;
    if (baseImage !== null) {
      response = await openai.responses.create({
        model: "gpt-5-nano",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: context,
              },
              {
                type: "input_image",
                image_url: baseImage,
                detail: "auto",
              },
            ],
          },
        ],
        tools: [
          {
            type: "image_generation",
            background: "transparent",
            quality: "high",
          },
        ],
      });
    } else {
      response = await openai.responses.create({
        model: "gpt-5-nano",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: context,
              },
            ],
          },
        ],
        tools: [
          {
            type: "image_generation",
            background: "transparent",
            quality: "high",
          },
        ],
      });
    }

    // 🔍 Extract image safely
    const imageOutput = response.output.find(
      (o: ResponseOutputItem) =>
        o.type === "image_generation_call" && o.status === "completed"
    );

    const imageBase64 =
      imageOutput && "result" in imageOutput ? imageOutput.result : null;

    const assistantMessages = response.output
      .filter((o: ResponseOutputItem) => o.type === "message")
      .map((msg: any) => {
        if ("result" in msg) {
          return msg.result;
        }
        return null;
      })
      .filter((msg: string | null): msg is string => msg !== null);

    const agentMessage = new AgentMessage({
      owner: userId,
      message: context,
      botMessage: assistantMessages.join("\n"),
      images: imageBase64 ? [`data:image/png;base64,${imageBase64}`] : [],
      responseId: response.id,
    });

    await agentMessage.save();

    await AgentHistory.findByIdAndUpdate(agentsPath._id, {
      $push: { messages: agentMessage._id },
    });

    return {
      status: "success",
      message: {
        urlID: agentsPath._id.toString(),
        image: imageBase64 ? `data:image/png;base64,${imageBase64}` : null,
        metadata: {
          responseId: response.id,
          model: response.model,
          usage: response.usage,
          outputs: response.output.map((o: any) => ({
            type: o.type,
            status: o.status,
          })),
          assistantMessages,
        },
      },
    };
  } catch (error) {
    console.error("CreateImageAction error:", error);
    return {
      status: "error",
      message: "Failed to create image",
    };
  }
};
