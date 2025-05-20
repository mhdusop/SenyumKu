import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
   // Buat User
   const userPasien = await prisma.user.create({
      data: {
         username: "pasien1",
         password: "hashed_password1",
         role: "PASIEN",
         pasien: {
            create: {
               nama: "Darmana Safitri",
               alamat: "Jalan Joyoboyo No. 224",
               noTelp: "+62-900-862-7858",
            },
         },
      },
      include: {
         pasien: true,
      },
   });

   const userDokter = await prisma.user.create({
      data: {
         username: "dokter1",
         password: "hashed_password2",
         role: "DOKTER",
         dokter: {
            create: {
               nama: "Lurhur Rajata",
               spesialisasi: "Dokter Gigi",
            },
         },
      },
   });

   const userAdmin = await prisma.user.create({
      data: {
         username: "admin1",
         password: "hashed_password3",
         role: "ADMINISTRASI",
         staffAdministrasi: {
            create: {
               nama: "Tomi Haryanti",
            },
         },
      },
   });

   const userObat = await prisma.user.create({
      data: {
         username: "obat1",
         password: "hashed_password4",
         role: "PENGELOLA_OBAT",
         staffPengelolaObat: {
            create: {
               nama: "dr. Karma Manullang, S.H.",
            },
         },
      },
   });

   // Buat Obat
   const paracetamol = await prisma.obat.create({
      data: {
         nama: "Paracetamol",
         stok: 100,
         satuan: "tablet",
      },
   });

   const ibuprofen = await prisma.obat.create({
      data: {
         nama: "Ibuprofen",
         stok: 50,
         satuan: "tablet",
      },
   });

   // Buat Pendaftaran dan Antrian
   const pendaftaran = await prisma.pendaftaran.create({
      data: {
         pasienId: userPasien.pasien!.id,
         keluhan: "Sakit gigi",
         status: "MENUNGGU",
         Antrian: {
            create: {
               nomorUrut: 1,
            },
         },
      },
   });
}

main()
   .then(() => {
      console.log("Seeder berhasil dijalankan");
      return prisma.$disconnect();
   })
   .catch((e) => {
      console.error(e);
      return prisma.$disconnect();
   });
