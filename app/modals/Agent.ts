import mongoose  from "mongoose";

export interface IAgent {
  Agentname: string;
  instructions: string;
  profileImage: any;
  profileImageUrl: string;
  owner: mongoose.Schema.Types.ObjectId
}

// TODO: Make it better......

const AgentSchema = new mongoose.Schema<IAgent>(
  {
    Agentname: {
      type: String,
      min: 4,
      max: 24,
    },
    instructions: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profileImage: {
      type: String
    },
    profileImageUrl: {
      type: String
    }
  },
  { timestamps: true }
);

let AgentModel: mongoose.Model<IAgent>;

try {
  // Try to retrieve an existing model
  AgentModel = mongoose.model<IAgent>("Agent");
} catch (e) {
  // If the model doesn't exist, define it
  AgentModel = mongoose.model<IAgent>("Agent", AgentSchema);
}

export const Agent = AgentModel;