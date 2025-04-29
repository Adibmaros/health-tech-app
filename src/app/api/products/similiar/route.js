// src/app/api/products/similar/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const limit = parseInt(searchParams.get("limit") || "4");

  if (!id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  try {
    // First get the current product to know if it requires prescription
    const currentProduct = await prisma.products.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find similar products with the same prescription requirement
    const similarProducts = await prisma.products.findMany({
      where: {
        id: {
          not: parseInt(id), // Exclude current product
        },
        requires_prescription: currentProduct.requires_prescription,
      },
      take: limit,
      orderBy: {
        created_at: "desc", // Get newest products
      },
    });

    return NextResponse.json(similarProducts);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return NextResponse.json({ error: "Failed to fetch similar products" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// src/app/api/cart/add/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, quantity, price } = body;

    if (!productId || !quantity || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In a real implementation, you'd either:
    // 1. Store the cart in a database if the user is logged in
    // 2. Store the cart in a cookie or localStorage if the user is not logged in

    // For this example, let's use a cookie approach
    const cookieStore = cookies();
    const existingCart = cookieStore.get("cart")?.value ? JSON.parse(cookieStore.get("cart").value) : [];

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item) => item.productId === productId);

    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      existingCart.push({
        productId,
        quantity,
        price,
        addedAt: new Date().toISOString(),
      });
    }

    // Save updated cart to cookie
    cookieStore.set("cart", JSON.stringify(existingCart), {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      cartCount: existingCart.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}
