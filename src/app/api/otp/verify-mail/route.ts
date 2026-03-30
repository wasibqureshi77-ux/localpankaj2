import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { identifier, otp } = await req.json();
    if (!identifier || !otp) return NextResponse.json({ error: "Identifier and OTP required" }, { status: 400 });

    await connectDB();

    // Verify user using robust matching
    const cleanId = identifier.replace(/\D/g, "").slice(-10);
    const isMobileInput = /^\d{10}$/.test(cleanId);

    const matchQuery = isMobileInput 
      ? { $or: [{ email: identifier }, { phone: { $regex: cleanId + "$" } }] }
      : { email: identifier };

    const user = await User.findOne(matchQuery);

    if (!user) return NextResponse.json({ error: "Identity mismatch." }, { status: 404 });

    const trackKey = user.phone || user.email;

    // Verify OTP
    const record = await Otp.findOne({ phone: trackKey, otp });
    if (!record) return NextResponse.json({ error: "Invalid cryptographic code." }, { status: 401 });
    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP has expired. Request a new code." }, { status: 410 });
    }

    // Success - Mark verified
    await Otp.findByIdAndUpdate(record._id, { verified: true });

    return NextResponse.json({ 
       message: "Verified Successfully"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
