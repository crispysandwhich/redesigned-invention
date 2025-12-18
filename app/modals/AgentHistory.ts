import mongoose from "mongoose";

export interface IAgentHistory {
  AgentHistoryname: string;
  title: string;
  owner: mongoose.Schema.Types.ObjectId;
  ParentAgent: mongoose.Schema.Types.ObjectId;
  messages?: mongoose.Schema.Types.ObjectId[];
}

// TODO: Make it better......

const AgentHistorySchema = new mongoose.Schema<IAgentHistory>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ParentAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AgentMessage",
      },
    ],
    title: {
      type: String,
      default: "New Chat",
    },
  },
  { timestamps: true }
);

let AgentHistoryModel: mongoose.Model<IAgentHistory>;

try {
  // Try to retrieve an existing model
  AgentHistoryModel = mongoose.model<IAgentHistory>("AgentHistory");
} catch (e) {
  // If the model doesn't exist, define it
  AgentHistoryModel = mongoose.model<IAgentHistory>(
    "AgentHistory",
    AgentHistorySchema
  );
}

export const AgentHistory = AgentHistoryModel;
