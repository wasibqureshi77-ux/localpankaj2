import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Lead } from "@/models/Lead";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");

    await connectDB();
    
    const query = leadId ? { leadId } : {};
    const appointments = await Appointment.find(query)
      .populate({ path: "leadId", model: Lead })
      .populate({ path: "technicianId", model: User })
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

    return NextResponse.json(leadId ? formatted[0] : formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
