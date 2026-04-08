import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    const technicians = await User.find({ role: "TECHNICIAN" }).sort({ name: 1 });
    return NextResponse.json(technicians);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();
    
    // Ensure role is technician
    data.role = "TECHNICIAN";
    
    // Validate required fields for User model
    if (!data.name || !data.email || !data.phone) {
       return NextResponse.json({ error: "Name, Email, and Phone are required for field registry" }, { status: 400 });
    }

    // Hash the password (required for login)
    const rawPassword = data.password || "Tech@123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    data.password = hashedPassword;

    const technician = await User.create(data);
    
    // Return safe data
    const { password: _, ...safeData } = technician.toObject();
    return NextResponse.json(safeData);
  } catch (error: any) {
    console.error("TECHNICIAN_REGISTRATION_CRASH:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    await connectDB();
    
    if (data.password) {
       data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectDB();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
