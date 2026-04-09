import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Lead } from "@/models/Lead";

export async function GET() {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TECHNICIAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find appointments assigned to this technician
    // Populate lead data for service details and contact info
    const appointments = await Appointment.find({ technicianId: session.user.id })
      .populate({
        path: "leadId",
        model: Lead,
        select: "name phone email service address bookingDate bookingTime category price paymentMethod paymentStatus notes"
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Fetch technician jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
