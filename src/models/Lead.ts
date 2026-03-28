import mongoose, { Schema, model, models } from "mongoose";

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    service: { type: String, required: true },
    servicePlan: { type: String },
    price: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    bookingDate: { type: String },
    bookingTime: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: ["UNASSIGNED", "FOLLOWING", "CONVERTED"],
      default: "UNASSIGNED",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Lead = models.Lead || model("Lead", LeadSchema);
