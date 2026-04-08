import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";

export async function POST(req: Request) {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TECHNICIAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { appointmentId, newStatus } = await req.json();

    if (!appointmentId || !newStatus) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate ownership
    const appointment = await Appointment.findOne({ 
       _id: appointmentId, 
       technicianId: session.user.id 
    });

    if (!appointment) {
      return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 404 });
    }

    // Logic: PENDING -> IN_PROGRESS -> PENDING_APPROVAL -> COMPLETED (by admin)
    // Technician can move to IN_PROGRESS or PENDING_APPROVAL
    // If technician wants to mark as completed, it becomes PENDING_APPROVAL
    
    let finalStatus = newStatus;
    if (newStatus === "COMPLETED") {
       finalStatus = "PENDING_APPROVAL";
    }

    // Allowed transitions for technician
    const allowedStatuses = ["IN_PROGRESS", "PENDING_APPROVAL", "CANCELLED"];
    if (!allowedStatuses.includes(finalStatus)) {
       return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    appointment.status = finalStatus;
    await appointment.save();

    return NextResponse.json({ 
       message: "Status updated successfully", 
       status: finalStatus 
    });

  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
