import mongoose  from "mongoose";

export interface IAgentOffical {
  Agentname: string;
  instructions: string;
  profileImage: any;
  profileImageUrl: string;
  owner: mongoose.Schema.Types.ObjectId
}

// TODO: Make it better......

const AgentOfficalSchema = new mongoose.Schema<IAgentOffical>(
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

let AgentOfficalModel: mongoose.Model<IAgentOffical>;

try {
  // Try to retrieve an existing model
  AgentOfficalModel = mongoose.model<IAgentOffical>("AgentOffical");
} catch (e) {
  // If the model doesn't exist, define it
  AgentOfficalModel = mongoose.model<IAgentOffical>("AgentOffical", AgentOfficalSchema);
}

export const AgentOffical = AgentOfficalModel;