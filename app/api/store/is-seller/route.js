import prisma from "@/lib/prisma";
import { authSeller } from "@/Middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Seller info
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        {
          error: "not Authorized",
        },
        { status: 401 }
      );
    }

    const storeInfo = await prisma.store.findUnique({
      where: { userId },
    });
    return NextResponse.json({ isSeller, storeInfo });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}
