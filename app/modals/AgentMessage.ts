import mongoose from "mongoose";

export interface AgentMessage {
  message: string;
  botMessage?: string;
  owner: mongoose.Schema.Types.ObjectId;
  images?: string[];
  responseId?: string;
}

// TODO: Make it better......

const AgentMessageSchema = new mongoose.Schema<AgentMessage>(
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

let AgentMessageModel: mongoose.Model<AgentMessage>;

try {
  // Try to retrieve an existing model
  AgentMessageModel = mongoose.model<AgentMessage>("AgentMessage");
} catch (e) {
  // If the model doesn't exist, define it
  AgentMessageModel = mongoose.model<AgentMessage>(
    "AgentMessage",
    AgentMessageSchema
  );
}

export const AgentMessage = AgentMessageModel;
