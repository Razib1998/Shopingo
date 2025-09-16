import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get Store username from query params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) {
      NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    // Now get the store info and store products

    const store = await prisma.store.findUnique({
      where: { username, isActive: true },
      include: { Product: { include: { rating: true } } },
    });
    if (!store) {
      return NextResponse.json({ error: "Store Not Found" }, { status: 400 });
    }
    return NextResponse.json({ store });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}
