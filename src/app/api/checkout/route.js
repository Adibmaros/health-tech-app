import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Import for file handling
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    // Check if the request is multipart form data
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          success: false,
          message: "Format permintaan tidak valid. Harus menggunakan multipart/form-data",
        },
        { status: 400 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();

    // Extract customer data
    const customer = {
      nama_lengkap: formData.get("customer[nama_lengkap]"),
      no_telp: formData.get("customer[no_telp]"),
      email: formData.get("customer[email]"),
      alamat: formData.get("customer[alamat]"),
    };

    // Parse items from formData
    const items = [];
    let i = 0;
    let requiresPrescription = false;

    while (formData.get(`items[${i}][product_id]`)) {
      const itemRequiresPrescription = formData.get(`items[${i}][requires_prescription]`) === "true";

      items.push({
        product_id: parseInt(formData.get(`items[${i}][product_id]`)),
        quantity: parseInt(formData.get(`items[${i}][quantity]`)),
        unit_price: parseFloat(formData.get(`items[${i}][unit_price]`)),
        requires_prescription: itemRequiresPrescription,
      });

      if (itemRequiresPrescription) {
        requiresPrescription = true;
      }

      i++;
    }

    // Handle payment proof file upload
    const paymentFile = formData.get("bukti_bayar");

    if (!paymentFile || !(paymentFile instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Bukti pembayaran tidak ditemukan atau tidak valid",
        },
        { status: 400 }
      );
    }

    // Generate unique filename for the uploaded payment proof
    const paymentFileExt = paymentFile.name.split(".").pop();
    const paymentFileName = `payment_${uuidv4()}.${paymentFileExt}`;

    // Define upload directory and path
    const uploadDir = join(process.cwd(), "public", "uploads");
    const paymentFilePath = join(uploadDir, paymentFileName);
    const paymentFileUrl = `/uploads/${paymentFileName}`;

    // Handle prescription file upload if needed
    let prescriptionFileUrl = null;

    if (requiresPrescription) {
      const prescriptionFile = formData.get("resep");

      if (!prescriptionFile || !(prescriptionFile instanceof File)) {
        return NextResponse.json(
          {
            success: false,
            message: "Resep dokter wajib diunggah untuk produk yang memerlukan resep",
          },
          { status: 400 }
        );
      }

      // Generate unique filename for the uploaded prescription
      const prescriptionFileExt = prescriptionFile.name.split(".").pop();
      const prescriptionFileName = `prescription_${uuidv4()}.${prescriptionFileExt}`;
      const prescriptionFilePath = join(uploadDir, prescriptionFileName);
      prescriptionFileUrl = `/uploads/${prescriptionFileName}`;

      // Save the prescription file
      try {
        const prescriptionBuffer = Buffer.from(await prescriptionFile.arrayBuffer());
        await writeFile(prescriptionFilePath, prescriptionBuffer);
        console.log(`Prescription file saved to ${prescriptionFilePath}`);
      } catch (error) {
        console.error("Error saving prescription file:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Gagal menyimpan file resep dokter",
            error: error.message,
          },
          { status: 500 }
        );
      }
    }

    // Save the payment proof file
    try {
      // Convert file to buffer
      const paymentBuffer = Buffer.from(await paymentFile.arrayBuffer());
      // Save file to server
      await writeFile(paymentFilePath, paymentBuffer);
      console.log(`Payment proof file saved to ${paymentFilePath}`);
    } catch (error) {
      console.error("Error saving payment file:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Gagal menyimpan bukti pembayaran",
          error: error.message,
        },
        { status: 500 }
      );
    }

    const totalAmount = parseFloat(formData.get("totalAmount"));

    console.log("Processing order with data:", {
      customer,
      items,
      totalAmount,
      paymentFileUrl,
      prescriptionFileUrl,
    });

    // Validasi input
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak valid",
        },
        { status: 400 }
      );
    }

    // Periksa setiap item memiliki product_id yang valid
    const invalidItems = items.filter((item) => !item.product_id);
    if (invalidItems.length > 0) {
      console.error("Items with invalid product_id:", invalidItems);
      return NextResponse.json(
        {
          success: false,
          message: "Beberapa item tidak memiliki ID produk yang valid",
        },
        { status: 400 }
      );
    }

    // Verifikasi semua produk ada dalam database
    const productIds = items.map((item) => item.product_id);
    const products = await prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    console.log(
      "Found products in DB:",
      products.map((p) => p.id)
    );

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      console.error("Missing product IDs:", missingIds);

      return NextResponse.json(
        {
          success: false,
          message: "Beberapa produk tidak ditemukan di database",
          missingIds,
        },
        { status: 400 }
      );
    }

    // Verify prescription requirements match product settings
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);

      if (product.requires_prescription && !prescriptionFileUrl) {
        return NextResponse.json(
          {
            success: false,
            message: `Produk ${product.name} memerlukan resep dokter. Mohon unggah resep dokter.`,
          },
          { status: 400 }
        );
      }
    }

    // Create order metadata to store the prescription file URL
    const orderMetadata = {};
    if (prescriptionFileUrl) {
      orderMetadata.prescriptionUrl = prescriptionFileUrl;
    }

    // Buat pesanan baru di database
    const order = await prisma.orders.create({
      data: {
        total_amount: totalAmount,
        nama_lengkap: customer.nama_lengkap,
        no_telp: customer.no_telp,
        email: customer.email,
        alamat: customer.alamat,
        bukti_bayar: paymentFileUrl,
        resep_dokter: prescriptionFileUrl, // Gunakan kolom baru ini
        order_items: {
          create: [
            {
              product_id: 6,
              quantity: 1,
              unit_price: 125000,
            },
          ],
        },
      },
      include: {
        order_items: true,
      },
    });

    console.log("Order created successfully:", order.id);

    // Redirect ke halaman sukses dengan mengirimkan data pesanan
    return NextResponse.json(
      {
        success: true,
        message: "Pesanan berhasil dibuat",
        order,
        prescriptionUrl: prescriptionFileUrl, // Include this in the response
        redirect: `/pasien/toko/checkout/success?orderId=${order.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat membuat pesanan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
