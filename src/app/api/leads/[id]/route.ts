import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import "@/models/User"; // Ensure User model is registered for population

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    // We populate assignedTechnician to get the specialist details (name, phone)
    const lead = await Lead.findById(id).populate("assignedTechnician");

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

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

    const lead = await Lead.findByIdAndUpdate(id, data, { new: true });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // 1. TECHNICIAN ASSIGNMENT LOGIC & NOTIFICATIONS
    if (data.assignedTechnician) {
       const { Appointment } = await import("@/models/Appointment");
       const { User } = await import("@/models/User");
       const { sendEmail } = await import("@/lib/email/sendEmail");

       const technician = await User.findById(data.assignedTechnician);
       
       if (technician) {
          // Update or Create Appointment
          await Appointment.findOneAndUpdate(
             { leadId: id },
             { 
               technicianId: technician._id, 
               status: "ASSIGNED",
               date: lead.bookingDate ? new Date(lead.bookingDate) : new Date()
             },
             { upsert: true, new: true }
          );

          // Notifications
          try {
             // To Technician
             await sendEmail({
                to: technician.email,
                subject: `New Job Assigned: ${lead.service} 🛠️`,
                html: `
                   <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                      <h2 style="color: #2563eb;">New Assignment Received</h2>
                      <p>Hello <strong>${technician.name}</strong>, a new service job has been assigned to you.</p>
                      <div style="background: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
                         <p><strong>Customer:</strong> ${lead.name}</p>
                         <p><strong>Service:</strong> ${lead.service}</p>
                         <p><strong>Contact:</strong> ${lead.phone}</p>
                         <p><strong>Address:</strong> ${lead.address}</p>
                         <p><strong>Schedule:</strong> ${lead.bookingDate} at ${lead.bookingTime}</p>
                      </div>
                      <p>Please log in to your portal to start the job.</p>
                   </div>
                `
             });

             // To User
             if (lead.email) {
                await sendEmail({
                   to: lead.email,
                   subject: "Your Service Expert is Assigned! 👨‍🔧",
                   html: `
                      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                         <h2 style="color: #2563eb;">Specialist Assigned</h2>
                         <p>Hi <strong>${lead.name}</strong>, we have assigned an expert for your <strong>${lead.service}</strong>.</p>
                         <div style="background: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
                            <p><strong>Expert Name:</strong> ${technician.name}</p>
                            <p><strong>Contact:</strong> ${technician.phone}</p>
                         </div>
                         <p>The expert will reach your location as per the scheduled time.</p>
                      </div>
                   `
                });
             }
          } catch (mailErr) {
             console.error("Assignment email failure:", mailErr);
          }
       }
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
