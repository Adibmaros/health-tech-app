//di frontent dan js
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Menggunakan export default untuk memungkinkan impor seperti ini:
// import prisma from '@/lib/prisma';
export default prisma;

//cara importnya

// import prisma from '@/lib/prisma'
