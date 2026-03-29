import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Technician } from "@/models/Technician";

export async function GET() {
  try {
    await connectDB();
    const technicians = await Technician.find({}).sort({ createdAt: -1 });
    return NextResponse.json(technicians);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();
    const technician = await Technician.create(data);
    return NextResponse.json(technician);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    await connectDB();
    const updated = await Technician.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectDB();
    await Technician.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
