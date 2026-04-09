import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      leadId 
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "";

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      await connectDB();
      
      // If leadId is provided, update the lead (Legacy/Lead flow)
      if (leadId) {
        await Lead.findByIdAndUpdate(leadId, {
          paymentStatus: "COMPLETED",
          razorpayPaymentId: razorpay_payment_id
        });
      }

      return NextResponse.json({ 
        success: true,
        message: "Payment verified successfully" 
      });
    } else {
      if (leadId) {
        await connectDB();
        await Lead.findByIdAndUpdate(leadId, {
          paymentStatus: "FAILED"
        });
      }
      return NextResponse.json({ 
        success: false,
        message: "Invalid signature" 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
