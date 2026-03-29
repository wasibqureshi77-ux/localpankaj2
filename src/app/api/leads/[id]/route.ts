import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { Technician } from "@/models/Technician";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const lead = await Lead.findById(id).populate("assignedTechnician");
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    await connectDB();
    const updated = await Lead.findByIdAndUpdate(id, data, { new: true }).populate("assignedTechnician");
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
