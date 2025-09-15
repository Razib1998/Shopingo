import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    // get the data from form data
    const formData = await request.formData();
    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");
    if (
      !name ||
      username ||
      description ||
      email ||
      contact ||
      address ||
      image
    ) {
      return NextResponse.json(
        {
          error: "Missing Store information",
        },
        { status: 400 }
      );
    }
    // Check is user is already registered as a store

    const isStoreRegistered = await prisma.store.findFirst({
      where: { userId: userId },
    });
    if (isStoreRegistered) {
      return NextResponse.json({ status: store.status });
    }
    // check is userName Already taken
    const isUserNameExists = await prisma.store.findFirst({
      where: { username: username.lowerCase() },
    });
    if (isUserNameExists) {
      return NextResponse.json(
        {
          error: "This user Name is available",
        },
        { status: 400 }
      );
    }

    // Upload image to imageKit

    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "Logos",
    });
    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        image: optimizedImage,
      },
    });

    // update the store in user table
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });
    return NextResponse.json({ message: "Applied,Waiting For Admin Approval" });
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

// Check is user have already registered a store if yes then send the status

export async function GET(request) {
  try {
    const { userId } = getAuth();

    const isStoreRegistered = await prisma.store.findFirst({
      where: { userId: userId },
    });
    if (isStoreRegistered) {
      return NextResponse.json({ status: store.status });
    }
    return NextResponse.json({ status: "Not Registered" });
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
