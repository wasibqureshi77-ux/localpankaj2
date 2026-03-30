import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/email/sendEmail";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    if (!identifier) return NextResponse.json({ error: "Missing identifier" }, { status: 400 });

    await connectDB();

    // Find user using robust matching
    const cleanId = identifier.replace(/\D/g, "").slice(-10);
    const isMobileInput = /^\d{10}$/.test(cleanId);

    const matchQuery = isMobileInput 
      ? { $or: [{ email: identifier }, { phone: { $regex: cleanId + "$" } }] }
      : { email: identifier };

    const user = await User.findOne(matchQuery);

    if (!user) {
      return NextResponse.json({ error: "No account found with this identity." }, { status: 404 });
    }

    if (!user.email) {
       return NextResponse.json({ error: "No email linked to this account. Contact support." }, { status: 400 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save/Update OTP record (we'll use the user's phone for tracking if available, or email)
    const trackKey = user.phone || user.email;
    await Otp.findOneAndUpdate(
      { phone: trackKey },
      { otp: code, expiresAt, verified: false },
      { upsert: true }
    );

    // Send Mail
    await sendEmail({
      to: user.email,
      subject: "Security Verification Code - Local Pankaj 🔐",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 30px; text-align: center;">
          <h2 style="color: #2563eb; margin-bottom: 30px;">Account Recovery</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 40px;">Use the following cryptographic code to verify your identity. This code expires in 10 minutes.</p>
          <div style="background: #f8fafc; padding: 30px; border-radius: 20px; font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #1e293b; border: 1px solid #e2e8f0;">
            ${code}
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 40px;">If you did not request this code, please ignore this email or contact security support.</p>
        </div>
      `
    });

    return NextResponse.json({ message: "OTP Sent Successfully" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
