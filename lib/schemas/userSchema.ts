import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "technician"],
      default: "technician",
    },
    createdBy: { type: String, default: "Admin" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

export const User = mongoose.models.user || mongoose.model("user", UserSchema);
