import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { User } from "@/models/User";
import { Appointment } from "@/models/Appointment";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const [
      leadCount, 
      orderCount, 
      techCount, 
      recentLeads, 
      technicians, 
      assignedCount,
      inProgressCount,
      completedCount,
      activeAssignments
    ] = await Promise.all([
      Lead.countDocuments({ source: { $ne: "ORDER" } }),
      Order.countDocuments(),
      User.countDocuments({ role: "TECHNICIAN" }),
      Lead.find({ source: { $ne: "ORDER" } }).sort({ createdAt: -1 }).limit(5),
      User.find({ role: "TECHNICIAN" }),
      Appointment.countDocuments({ status: { $in: ["ASSIGNED", "SCHEDULED"] } }),
      Appointment.countDocuments({ status: "IN_PROGRESS" }),
      Appointment.countDocuments({ status: "COMPLETED" }),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("leadId")
        .populate("technicianId")
    ]);

    const stats = {
      leadsCount: leadCount,
      appointmentsCount: orderCount, 
      assignedCount,
      inProgressCount,
      completedCount,
      totalJobs: assignedCount + inProgressCount + completedCount,
      recentLeads,
      activeAssignments: activeAssignments.map((a: any) => ({
         _id: a._id,
         serviceName: a.leadId?.service || "General Service",
         customerName: a.leadId?.name || "Anonymous",
         phone: a.leadId?.phone || "---",
         address: a.leadId?.address || "---",
         bookingDate: a.leadId?.bookingDate || "---",
         bookingTime: a.leadId?.bookingTime || "---",
         status: a.status,
         category: a.leadId?.category || "SERVICE",
         technician: a.technicianId?.name || "Unassigned"
      })),
      technicians: technicians.map((t: any) => ({
        name: t.name,
        type: t.specialties?.[0] || "General Tech",
        status: t.status || "ACTIVE"
      }))
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("STATS_FETCH_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
