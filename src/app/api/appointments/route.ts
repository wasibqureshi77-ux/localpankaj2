import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";

export async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find({})
      .populate("leadId")
      .populate("technicianId")
      .sort({ createdAt: -1 });
    
    const formatted = appointments.map((a: any) => ({
      _id: a._id,
      leadId: a.leadId?._id || a.leadId,
      customer: a.leadId?.name || "System User",
      service: a.leadId?.service || "Maintenance Service",
      location: `${a.leadId?.city || "Jaipur"}, ${a.leadId?.pincode || ""}`,
      time: a.leadId?.bookingTime || new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: a.status || "PENDING",
      tech: a.technicianId?.name || "Unassigned"
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
