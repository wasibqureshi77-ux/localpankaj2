import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/email/sendEmail";
import crypto from "crypto";

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

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save/Update Reset Token in Otp model (we'll use it as a storage for tokens too)
    const trackKey = user.phone || user.email;
    await Otp.findOneAndUpdate(
      { phone: trackKey },
      { otp: token, expiresAt, verified: false },
      { upsert: true }
    );

    const resetUrl = `${new URL(req.url).origin}/reset-password?token=${token}&id=${encodeURIComponent(trackKey)}`;

    // Send Mail
    await sendEmail({
      to: user.email,
      subject: "Action Required: Reset Your Password - Local Pankaj 🔑",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #1e293b; border-radius: 30px; text-align: center; background: #0f172a; color: white;">
          <h2 style="color: #3b82f6; margin-bottom: 20px;">Secure Account Recovery</h2>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 40px;">A secure password reset was requested for your account. Click the button below to establish new credentials.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 20px 40px; background: #2563eb; color: white; text-decoration: none; border-radius: 15px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; font-size: 12px; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.4);">
            Reset Credentials
          </a>
          <p style="color: #64748b; font-size: 12px; margin-top: 40px;">This link expires in 60 minutes. If you did not request this, please disregard.</p>
        </div>
      `
    });

    return NextResponse.json({ message: "Reset Link Sent Successfully" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
