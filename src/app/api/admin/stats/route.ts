import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { Technician } from "@/models/Technician";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const [leadCount, orderCount, techCount, productCount, recentLeads, technicians, allOrders] = await Promise.all([
      Lead.countDocuments({ source: { $ne: "ORDER" } }),
      Order.countDocuments(),
      Technician.countDocuments(),
      Product.countDocuments(),
      Lead.find({ source: { $ne: "ORDER" } }).sort({ createdAt: -1 }).limit(5),
      Technician.find(),
      Order.find({ paymentStatus: "COMPLETED" })
    ]);

    const totalRevenue = allOrders.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);

    const stats = {
      leads: leadCount,
      appointments: orderCount, 
      conversions: orderCount, 
      revenue: totalRevenue,
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
