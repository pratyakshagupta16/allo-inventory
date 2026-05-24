import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const reservation =
      await prisma.reservation.findUnique({
        where: { id },
      });

    if (!reservation) {
      return NextResponse.json(
        {
          error:
            "Reservation not found",
        },
        { status: 404 }
      );
    }

    if (
      reservation.status !==
      "PENDING"
    ) {
      return NextResponse.json(
        {
          error:
            "Reservation already processed",
        },
        { status: 400 }
      );
    }

    await prisma.inventory.update({
      where: {
        id: reservation.inventoryId,
      },
      data: {
        reservedStock: {
          decrement:
            reservation.quantity,
        },
      },
    });

    const updatedReservation =
      await prisma.reservation.update({
        where: { id },
        data: {
          status: "RELEASED",
        },
      });

    return NextResponse.json(
      updatedReservation
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}