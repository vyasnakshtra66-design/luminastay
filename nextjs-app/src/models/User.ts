import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  country?: string;
  preferredCurrency?: string;
  travelPreferences?: string[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, default: "", index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, trim: true },
    country: { type: String, default: "" },
    preferredCurrency: { type: String, default: "USD" },
    travelPreferences: [{ type: String }],
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
