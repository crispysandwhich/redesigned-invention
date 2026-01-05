import mongoose from "mongoose";

export interface IAgentMessage {
  message: string;
  botMessage?: string;
  owner: mongoose.Schema.Types.ObjectId;
  images?: string[];
  responseId?: string;
}

// TODO: Make it better......

const AgentMessageSchema = new mongoose.Schema<IAgentMessage>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    botMessage: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    responseId: {
      type: String,
    },
  },
  { timestamps: true }
);

let AgentMessageModel: mongoose.Model<IAgentMessage>;

try {
  // Try to retrieve an existing model
  AgentMessageModel = mongoose.model<IAgentMessage>("AgentMessage");
} catch (e) {
  // If the model doesn't exist, define it
  AgentMessageModel = mongoose.model<IAgentMessage>(
    "AgentMessage",
    AgentMessageSchema
  );
}

export const AgentMessage = AgentMessageModel;
