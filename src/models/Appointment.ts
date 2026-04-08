import mongoose, { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    technicianId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "IN_PROGRESS", "PENDING_APPROVAL", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Appointment = models.Appointment || model("Appointment", AppointmentSchema);
