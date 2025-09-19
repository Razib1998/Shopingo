import prisma from "@/lib/prisma";
import { authAdmin } from "@/Middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    // Get total orders
    const orders = await prisma.order.count();
    // Get total shop in our app
    const stores = await prisma.store.count();

    //Get total revenue
    const aLLOrders = await prisma.order.findMany({
      select: {
        createdAt: true,
        total: true,
      },
    });

    let totalRevenue = 0;
    aLLOrders.forEach((order) => {
      totalRevenue += order.total;
    });
    const revenue = totalRevenue.toFixed(2);

    // Get total products on the app
    const products = await prisma.product.count();

    const dashboardData = {
      orders,
      stores,
      products,
      revenue,
      aLLOrders,
    };
    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.code || error.message,
      },
      { status: 400 }
    );
  }
}
