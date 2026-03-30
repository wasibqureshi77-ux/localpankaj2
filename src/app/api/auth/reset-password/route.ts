import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    let { identifier, newPassword, token } = await req.json();
    if (!identifier || !newPassword) {
      return NextResponse.json({ error: "Missing identity parameters" }, { status: 400 });
    }

    await connectDB();

    // REGEX: Robust Identifier Matching
    // 1. Clean input if it's a mobile (last 10 digits)
    const cleanId = identifier.replace(/\D/g, "").slice(-10);
    const isMobileInput = /^\d{10}$/.test(cleanId);

    const matchQuery = isMobileInput 
      ? { $or: [{ email: identifier }, { phone: { $regex: cleanId + "$" } }] }
      : { email: identifier };

    const user = await User.findOne(matchQuery);

    if (!user) {
      return NextResponse.json({ error: "No account found with this telemetry profile." }, { status: 404 });
    }

    // Canonical key for verification tracking
    const trackKey = user.phone || user.email;

    // Validation Path
    let recordFound = false;

    if (token) {
        // Path A: Link Flow
        const tokenRecord = await Otp.findOne({ 
            phone: trackKey, 
            otp: token 
        });

        if (tokenRecord && tokenRecord.expiresAt > new Date()) {
            recordFound = true;
            await Otp.findByIdAndDelete(tokenRecord._id);
        } else {
            return NextResponse.json({ error: "Secure link signature has expired." }, { status: 403 });
        }
    } else {
        // Path B: OTP Flow
        const otpRecord = await Otp.findOne({ phone: trackKey, verified: true });
        
        if (!otpRecord) {
          return NextResponse.json({ error: "Identity verification required (OTP mismatch)." }, { status: 403 });
        }

        const freshVerification = (Date.now() - otpRecord.updatedAt.getTime()) < 15 * 60 * 1000;
        if (!freshVerification) {
           return NextResponse.json({ error: "Identity verification session expired." }, { status: 403 });
        }
        
        recordFound = true;
        await Otp.findByIdAndUpdate(otpRecord._id, { verified: false });
    }

    if (!recordFound) {
        return NextResponse.json({ error: "Cryptographic validation failed." }, { status: 403 });
    }

    // UPDATED PERSISTENCE: Explicit Document Save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
