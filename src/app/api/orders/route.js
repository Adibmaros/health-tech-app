import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        order_date: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error mengambil data pesanan:", error);
    return NextResponse.json({ error: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}
