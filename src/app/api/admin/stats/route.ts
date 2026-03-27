import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { Appointment } from "@/models/Appointment";
import { Technician } from "@/models/Technician";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const [leadCount, appointmentCount, techCount, productCount, recentLeads, technicians] = await Promise.all([
      Lead.countDocuments(),
      Appointment.countDocuments(),
      Technician.countDocuments(),
      Product.countDocuments(),
      Lead.find().sort({ createdAt: -1 }).limit(5),
      Technician.find()
    ]);

    // Simple delta calculations (mocked or compare with last week)
    // For now, let's just return actual counts
    const stats = {
      leads: leadCount,
      appointments: appointmentCount,
      conversions: appointmentCount, // Mocked as successful appointments
      failures: 0, // Mocked
      recentLeads,
      technicians: technicians.map((t: any) => ({
        name: t.name,
        type: t.serviceType,
        status: t.availability ? "ACTIVE" : "BUSY"
      }))
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
