import mongoose, { Schema, model, models } from "mongoose";

const TechnicianSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    specialties: [{ type: String }], // e.g., ["Electrician", "AC Expert"]
    status: { type: String, enum: ["ACTIVE", "BUSY", "OFFLINE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

if (mongoose.models.Technician) {
  delete mongoose.models.Technician;
}

export const Technician = mongoose.model("Technician", TechnicianSchema);
