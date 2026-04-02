import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, unique: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    city: { type: String, default: "Jaipur" },
    state: { type: String, default: "Rajasthan" },
    pincode: { type: String },
    items: [
      {
        id: { type: String },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
        category: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["PAY_ON_VISIT", "ONLINE"], default: "PAY_ON_VISIT" },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    assignedTechnician: {
      name: { type: String },
      phone: { type: String },
      id: { type: String }
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
