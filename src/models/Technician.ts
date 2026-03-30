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

export const Technician = models.Technician || model("Technician", TechnicianSchema);
export default Technician;
