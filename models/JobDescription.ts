import mongoose, { Schema, type Model } from "mongoose";

export interface IJobDescription {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  rawText: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobDescriptionSchema = new Schema<IJobDescription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    rawText: { type: String, required: true },
  },
  { timestamps: true }
);

export const JobDescription: Model<IJobDescription> =
  mongoose.models.JobDescription ??
  mongoose.model<IJobDescription>("JobDescription", JobDescriptionSchema);
