import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Lead } from "@/models/Lead";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    // Check if it's a new Order or a legacy Lead
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    
    if (!order) {
      // If not in Orders, it might be a legacy Lead being treated as an Order
      // We map status and potentially technician info back to Lead schema
      const updateData: any = {};
      
      if (body.orderStatus) updateData.status = body.orderStatus;
      if (body.assignedTechnician) {
         // Lead model doesn't have assignedTechnician natively, we store in notes or ignore for now
         // Actually let's assume Super Admin only manages new Orders correctly
         // But for legacy compatibility, we just update what we can
      }

      const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!lead) {
        return NextResponse.json({ error: "Reference not found" }, { status: 404 });
      }
      
      return NextResponse.json({ message: "Legacy Lead updated successfully" });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
