import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Technician } from "@/models/Technician";

export async function GET() {
  try {
    await connectDB();
    const technicians = await Technician.find({ status: "ACTIVE" }).sort({ name: 1 });
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
