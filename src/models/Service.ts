import mongoose, { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { 
      type: String, 
      enum: ["APPLIANCE", "HOME"], 
      required: true 
    },
    iconName: { type: String, default: "WashingMachine" },
    description: { type: String },
    isActive: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Service = models.Service || model("Service", ServiceSchema);
