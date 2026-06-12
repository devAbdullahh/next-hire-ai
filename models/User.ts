import mongoose, { Schema, type Model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  trainingContext: string;
  answerLength: "short" | "medium" | "long";
  answerTone: "professional" | "conversational" | "technical" | "friendly";
  defaultQuestionCount: number;
  interviewerAvatarId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    trainingContext: { type: String, default: "", maxlength: 2000 },
    answerLength: {
      type: String,
      enum: ["short", "medium", "long"],
      default: "medium",
    },
    answerTone: {
      type: String,
      enum: ["professional", "conversational", "technical", "friendly"],
      default: "professional",
    },
    defaultQuestionCount: {
      type: Number,
      default: 8,
      min: 1,
      max: 15,
    },
    interviewerAvatarId: {
      type: String,
      default: "monica",
    },
  },
  { timestamps: true }
);

// Re-register in dev so schema changes (new fields) are picked up after hot reload.
if (mongoose.models.User) {
  mongoose.deleteModel("User");
}

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
