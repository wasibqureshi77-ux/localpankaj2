import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Lead } from "@/models/Lead";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // If status is COMPLETED, we should also update the associated lead status
    if (status === "COMPLETED" && appointment.leadId) {
       await Lead.findByIdAndUpdate(appointment.leadId, { status: "COMPLETED" });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Admin update appointment status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
