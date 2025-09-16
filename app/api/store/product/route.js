// Add A new Product

import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { authSeller } from "@/Middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    // get data from the form data

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const images = formData.getAll("images");

    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      !category ||
      images.length < 1
    ) {
      return NextResponse.json(
        { error: "Missing Product Details" },
        { status: 400 }
      );
    }
    // Now upload the image in in imagekit

    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });

        const imageUrl = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ],
        });
        return imageUrl;
      })
    );
    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: imagesUrl,
        storeId,
      },
    });
    return NextResponse.json(
      { message: "Product Added Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}
// Get all products for a specific Seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    const products = await prisma.product.findMany({
      where: { storeId },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}
