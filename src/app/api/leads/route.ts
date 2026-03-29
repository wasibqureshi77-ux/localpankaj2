import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    
    // Calculate stats
    const stats = {
      total: leads.length,
      unassigned: leads.filter((l: any) => l.status === "UNASSIGNED").length,
      converted: leads.filter((l: any) => l.status === "CONVERTED").length,
      following: leads.filter((l: any) => l.status === "FOLLOWING").length,
    };

    return NextResponse.json({ leads, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();
    
    // Generate unique Request ID
    const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    data.requestId = `LP-${randomId}`;

    const lead = await Lead.create(data);

    // Trigger Lead Alerts
    try {
      const { sendEmail } = await import("@/lib/email/sendEmail");
      const { bookingTemplate, adminTemplate } = await import("@/lib/email/templates");

      // To Potential Customer (Lead)
      if (data.email) {
        await sendEmail({
          to: data.email,
          subject: `Service Request Received [${data.requestId}] - Local Pankaj ✅`,
          html: bookingTemplate({
            service: `${data.service} (Req ID: ${data.requestId})`,
            date: data.bookingDate || "Reviewing Schedule",
            location: data.address || "Jaipur"
          })
        });
      }

      // To Admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@localpankaj.com",
        subject: `New Lead Generated - ${data.requestId} 📞`,
        html: adminTemplate({
          message: `New service lead captured: <strong>${data.service}</strong>`,
          details: `
            Request ID: <strong style="color: #2563eb;">${data.requestId}</strong><br>
            Name: <strong>${data.name}</strong><br>
            Email: <strong>${data.email || "N/A"}</strong><br>
            Phone: <strong>${data.phone}</strong><br>
            Service Type: <strong>${data.serviceType || "N/A"}</strong><br>
            Category: <strong>${data.category || "N/A"}</strong><br>
            Service: <strong>${data.service}</strong><br>
            Location: <strong>${data.city}, ${data.state} (${data.pincode})</strong><br>
            Booking Date: <strong>${data.bookingDate}</strong><br>
            Booking Time: <strong>${data.bookingTime}</strong><br>
            Address: <strong>${data.address}</strong>
          `
        })
      });
    } catch (emailError) {
      console.error("Non-critical email failure:", emailError);
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, technician, techPhone, techName } = await req.json();
    await connectDB();
    
    // Explicitly update only relevant fields
    const updatedLead = await Lead.findByIdAndUpdate(
      id, 
      { status, technician: techName || technician }, 
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Trigger Assignment Email IF technician was assigned
    if (status === "CONVERTED" || technician) {
      try {
        const { sendEmail } = await import("@/lib/email/sendEmail");
        const { technicianTemplate, adminTemplate } = await import("@/lib/email/templates");

        // To Customer
        if (updatedLead.email) {
          await sendEmail({
            to: updatedLead.email,
            subject: "Expert Assigned to Your Service - Local Pankaj 👨‍🔧",
            html: technicianTemplate({
              service: updatedLead.service,
              techName: techName || "Service Expert",
              techPhone: techPhone || "Expert assigned",
              date: "Today/Scheduled",
              time: "Shortly"
            })
          });
        }

        // To Admin
        await sendEmail({
          to: process.env.ADMIN_EMAIL || "admin@localpankaj.com",
          subject: "Fulfillment Update: Technician Dispatched",
          html: adminTemplate({
            message: `Lead <strong>${updatedLead.service}</strong> has been converted.`,
            details: `Assigned Specialist: <strong>${techName || technician}</strong>`
          })
        });
      } catch (emailError) {
        console.error("Non-critical email failure:", emailError);
      }
    }

    return NextResponse.json(updatedLead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
