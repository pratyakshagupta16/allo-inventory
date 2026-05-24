import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { inventoryId, quantity } =
      body;

    if (!inventoryId || !quantity) {
      return NextResponse.json(
        {
          error: "Missing fields",
        },
        { status: 400 }
      );
    }

    const inventory =
      await prisma.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });

    if (!inventory) {
      return NextResponse.json(
        {
          error: "Inventory not found",
        },
        { status: 404 }
      );
    }

    const availableStock =
      inventory.totalStock -
      inventory.reservedStock;

    if (availableStock < quantity) {
      return NextResponse.json(
        {
          error:
            "Not enough stock",
        },
        { status: 409 }
      );
    }

    await prisma.inventory.update({
      where: {
        id: inventoryId,
      },
      data: {
        reservedStock: {
          increment: quantity,
        },
      },
    });

    const reservation =
      await prisma.reservation.create({
        data: {
          inventoryId,
          quantity,
          status: "PENDING",
          expiresAt: new Date(
            Date.now() +
              10 * 60 * 1000
          ),
        },
      });

    return NextResponse.json(
      reservation
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error:
          "Reservation failed",
      },
      { status: 500 }
    );
  }
}