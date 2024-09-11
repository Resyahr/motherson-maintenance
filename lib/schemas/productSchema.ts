import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IProducts {
  _id?: string;
  name?: string;
  description?: string;
  product_code?: string;
  manufacturer?: string | null;
  supplier?: string | null;
  category: string | null;
  location: string;
  quantity: number;
  low_stock_threshold: number;
  productImage: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
}

const ProductSchema = new Schema<IProducts>(
  {
    name: { type: String, required: true },
    description: String,
    product_code: { type: String, required: true },
    manufacturer: String,
    supplier: String,
    category: String,
    location: String,
    quantity: { type: Number, required: true },
    low_stock_threshold: Number,
    productImage: { type: String, required: false },
    createdBy: { type: String, default: "Admin" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String,
  },
  { collection: "inventory" }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
