// File: /app/api/products/reduce-stock/route.js
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const requestBody = await request.json();
    const { orderId, items } = requestBody;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items data" }, { status: 400 });
    }

    // Check if stock has already been reduced for this order
    const stockLogs = await prisma.stockReductionLogs.findFirst({
      where: {
        order_id: orderId,
      },
    });

    if (stockLogs) {
      // Stock already reduced for this order
      return NextResponse.json({ message: "Stock already reduced for this order", alreadyReduced: true }, { status: 200 });
    }

    // Begin processing each item
    const results = [];
    const errors = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity) {
        errors.push(`Invalid item data: ${JSON.stringify(item)}`);
        continue;
      }

      // Get current product stock
      const product = await prisma.products.findUnique({
        where: {
          id: productId,
        },
        select: {
          stock: true,
        },
      });

      if (!product) {
        errors.push(`Error getting product ${productId}: Product not found`);
        continue;
      }

      // Calculate new stock
      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - quantity); // Prevent negative stock

      // Update product stock
      const updatedProduct = await prisma.products.update({
        where: {
          id: productId,
        },
        data: {
          stock: newStock,
        },
      });

      results.push({
        productId,
        previousStock: currentStock,
        newStock,
        reduced: currentStock - newStock,
      });
    }

    // Log this stock reduction
    await prisma.stockReductionLogs.create({
      data: {
        order_id: orderId,
        reduction_data: results,
        reduced_at: new Date(),
        errors: errors.length > 0 ? errors : null,
      },
    });

    return NextResponse.json({
      message: "Stock updated successfully",
      results,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (error) {
    console.error("Error reducing stock:", error);
    return NextResponse.json({ error: "Failed to reduce stock", details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
