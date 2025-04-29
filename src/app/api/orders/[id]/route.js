import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const orderId = parseInt(params.id);

    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Error mengambil detail pesanan:", error);
    return NextResponse.json({ error: "Gagal mengambil detail pesanan" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const orderId = parseInt(params.id);
    const { approval_status, payment_status } = await request.json();

    const updateData = {};
    if (approval_status) updateData.approval_status = approval_status;
    if (payment_status) updateData.payment_status = payment_status;

    // Dapatkan data pesanan sebelum diupdate
    const oldOrder = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
    });

    const updatedOrder = await prisma.orders.update({
      where: {
        id: orderId,
      },
      data: updateData,
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Siapkan response
    const response = {
      order: updatedOrder,
    };

    // Jika status berubah menjadi "DIKIRIM" dan status pembayaran "DIBAYAR", buat URL WhatsApp
    if (approval_status === "DIKIRIM" && updatedOrder.payment_status === "DIBAYAR") {
      const whatsappUrl = generateWhatsAppUrl(updatedOrder);
      response.whatsappUrl = whatsappUrl;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error mengupdate status pesanan:", error);
    return NextResponse.json({ error: "Gagal mengupdate status pesanan" }, { status: 500 });
  }
}

// Fungsi untuk menghasilkan URL WhatsApp
function generateWhatsAppUrl(order) {
  try {
    // Format nomor telepon ke format internasional (menghilangkan 0 di awal dan tambahkan 62)
    let phoneNumber = order.no_telp;
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "62" + phoneNumber.substring(1);
    }

    // Buat teks untuk daftar produk yang dibeli
    let productList = "";
    order.order_items.forEach((item, index) => {
      const productName = item.product ? item.product.name : "Produk tidak tersedia";
      const quantity = item.quantity;
      const price = item.unit_price ? (item.unit_price * quantity).toLocaleString("id-ID") : "0";

      productList += `${index + 1}. ${productName} (${quantity} pcs) - Rp ${price}\n`;
    });

    // Format pesan lengkap
    const message = `
*PEMBERITAHUAN PENGIRIMAN PESANAN*
      
Halo ${order.nama_lengkap},
      
Pesanan Anda dengan ID #${order.id} sedang dalam proses pengiriman.

*Detail Pesanan:*
${productList}
*Total:* Rp ${order.total_amount.toLocaleString("id-ID")}

Pesanan akan segera tiba di alamat:
${order.alamat}

Jika ada pertanyaan, silakan hubungi kami.
Terima kasih telah berbelanja!

Salam Sehat,
Tim Apotek HealthMed
`;

    // Enkode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);

    // Generate URL untuk WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Log URL untuk tujuan debugging
    console.log("WhatsApp notification URL generated:", whatsappUrl);

    return whatsappUrl;
  } catch (error) {
    console.error("Error generating WhatsApp URL:", error);
    return null;
  }
}
