import mongoose, { Schema, type Model } from "mongoose";

export interface IResume {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fileName: string;
  skills: string[];
  experience: string[];
  projects: string[];
  rawText: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    skills: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    rawText: { type: String, required: true },
  },
  { timestamps: true }
);

export const Resume: Model<IResume> =
  mongoose.models.Resume ?? mongoose.model<IResume>("Resume", ResumeSchema);
