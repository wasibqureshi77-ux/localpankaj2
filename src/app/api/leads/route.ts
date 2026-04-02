import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { Technician } from "@/models/Technician"; // Required for population

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    await connectDB();
    
    // Force model registration for population stability
    if (!mongoose.models.Technician) {
       await import("@/models/Technician");
    }
    if (!mongoose.models.User) {
       await import("@/models/User");
    }

    let query: any = { source: { $ne: "ORDER" } };
    if (email || phone) {
      const orConditions = [];
      if (email) orConditions.push({ email });
      if (phone && phone.trim() !== "") {
        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        if (cleanPhone.length === 10) {
          orConditions.push({ phone: { $regex: cleanPhone + "$" } });
        }
      }
      
      if (orConditions.length > 0) {
        query = { ...query, $or: orConditions };
      }
    }

    console.log("Telemetry Search Query:", JSON.stringify(query));
    console.log("Registered Models:", Object.keys(mongoose.models));
    let leads;
    try {
      leads = await Lead.find(query).sort({ createdAt: -1 }).populate({
        path: "assignedTechnician",
        strictPopulate: false
      });
    } catch (popErr: any) {
       console.error("POPULATION_FAILURE:", popErr);
       leads = await Lead.find(query).sort({ createdAt: -1 }); // Fallback to unpopulated
    }    
    // Calculate stats
    const stats = {
      total: leads.length,
      unassigned: leads.filter((l: any) => l.status === "UNASSIGNED").length,
      converted: leads.filter((l: any) => l.status === "CONVERTED").length,
      completed: leads.filter((l: any) => l.status === "COMPLETED").length,
    };

    return NextResponse.json({ leads, stats });
  } catch (error: any) {
    console.error("TELEMETRY_SYNC_CRASH:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    const { User } = await import("@/models/User");
    const bcrypt = await import("bcryptjs");
    const { sendEmail } = await import("@/lib/email/sendEmail");
    const { bookingTemplate, adminTemplate, userWelcomeTemplate } = await import("@/lib/email/templates");

    // 1. Automatic Account Creation for New Users
    let isNewUser = false;
    let generatedPassword = "";
    
    // Check by email or phone
    let existingUser = await User.findOne({ 
      $or: [
        { email: data.email },
        { phone: data.phone }
      ]
    });

    if (!existingUser && data.phone) {
      isNewUser = true;
      generatedPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.default.hash(generatedPassword, 10);
      
      existingUser = await User.create({
        name: data.name,
        email: data.email || `${data.phone}@localpankaj.com`,
        phone: data.phone,
        password: hashedPassword,
        role: "USER"
      });

      // Send Account Creation Mail FIRST
      if (data.email) {
        try {
          await sendEmail({
            to: data.email,
            subject: "Welcome to Local Pankaj 🚀 - Your Account Details",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                <h2 style="color: #2563eb;">Welcome to Local Pankaj 🚀</h2>
                <p>Hello <strong>${data.name}</strong>,</p>
                <p>Your account has been successfully created. We're excited to have you on board!</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">Your Login Credentials:</p>
                  <p style="margin: 0; font-size: 16px; font-weight: bold;">User: ${data.email || data.phone}</p>
                  <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #2563eb;">Password: ${generatedPassword}</p>
                </div>
                <p>You can use these credentials to log in and track your bookings.</p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
                  Best Regards,<br>Team Local Pankaj
                </div>
              </div>
            `
          });
        } catch (mailErr) {
          console.error("Welcome email failed:", mailErr);
        }
      }
    }
    
    // 2. Lead Generation
    // Generate unique Request ID
    const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    data.requestId = `LP-${randomId}`;

    const lead = await Lead.create(data);

    // 3. Trigger Lead Alerts
    try {
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
            Service: <strong>${data.service}</strong><br>
            Booking Date: <strong>${data.bookingDate} (${data.bookingTime})</strong><br>
            Address: <strong>${data.address}</strong><br>
            Payment Method: <strong style="color: #10b981;">${data.paymentMethod === "PAY_ON_VISIT" ? "Pay on Visit" : "Paid Online"}</strong>
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
