import prisma from "@/lib/prisma";
import { authSeller } from "@/Middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { productId } = request.json();
    if (!productId) {
      return NextResponse.json({ error: "Missing details" }, { status: 400 });
    }
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Check if the product is exists

    const product = await prisma.product.findFirst({
      where: { id: productId, storeId },
    });
    if (!product) {
      return NextResponse.json({ error: "No Product Found" }, { status: 400 });
    }
    await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    });
    return NextResponse({ message: "Product Stock Updated Successfully" });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}
