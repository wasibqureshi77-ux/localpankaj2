import mongoose, { Schema, model, models } from "mongoose";

const LeadSchema = new Schema(
  {
    requestId: { type: String, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    serviceType: { type: String },
    category: { type: String },
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
    assignedTechnician: { type: Schema.Types.ObjectId, ref: "Technician" },
  },
  { timestamps: true }
);

export const Lead = models.Lead || model("Lead", LeadSchema);
