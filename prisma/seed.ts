import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
   // Clear existing data (optional)
   await prisma.antrian.deleteMany();
   await prisma.resep.deleteMany();
   await prisma.pembayaran.deleteMany();
   await prisma.rekamMedis.deleteMany();
   await prisma.pemeriksaan.deleteMany();
   await prisma.pendaftaran.deleteMany();
   await prisma.obat.deleteMany();
   await prisma.laporan.deleteMany();
   await prisma.pasien.deleteMany();
   await prisma.dokter.deleteMany();
   await prisma.stafAdministrasi.deleteMany();
   await prisma.stafPengelolaObat.deleteMany();
   await prisma.user.deleteMany();

   const saltRounds = 10;

   // Hash passwords
   const hashedPassword = await bcrypt.hash("password", saltRounds);

   // Create users with related data
   await prisma.user.create({
      data: {
         username: "admin",
         password: hashedPassword,
         role: "ADMINISTRASI",
         staffAdministrasi: {
            create: {
               nama: "Admin Satu",
            },
         },
      },
   });

   await prisma.user.create({
      data: {
         username: "dokter1",
         password: hashedPassword,
         role: "DOKTER",
         dokter: {
            create: {
               nama: "dr. Joko",
               spesialisasi: "Umum",
               noTelp: "081234567890",
            },
         },
      },
   });

   await prisma.user.create({
      data: {
         username: "pasien1",
         password: hashedPassword,
         role: "PASIEN",
         pasien: {
            create: {
               nama: "Budi Santoso",
               alamat: "Jl. Kenangan No. 10",
               noTelp: "082233445566",
            },
         },
      },
   });

   await prisma.user.create({
      data: {
         username: "obat1",
         password: hashedPassword,
         role: "PENGELOLA_OBAT",
         staffPengelolaObat: {
            create: {
               nama: "Petugas Obat",
            },
         },
      },
   });

   // Fetch created dokter and pasien for foreign keys usage
   const dokter = await prisma.dokter.findFirstOrThrow();
   const pasien = await prisma.pasien.findFirstOrThrow();

   // Create obat
   const paracetamol = await prisma.obat.create({
      data: {
         nama: "Paracetamol",
         stok: 100,
         satuan: "tablet",
      },
   });

   // Create pendaftaran
   const pendaftaran = await prisma.pendaftaran.create({
      data: {
         pasienId: pasien.id,
         keluhan: "Demam dan pusing",
      },
   });

   // Create pemeriksaan
   await prisma.pemeriksaan.create({
      data: {
         tanggal: new Date(),
         pasienId: pasien.id,
         dokterId: dokter.id,
         keluhan: "Demam tinggi",
         diagnosa: "Influenza",
         catatanTambahan: "Istirahat dan banyak minum air",
      },
   });

   // Create rekam medis
   await prisma.rekamMedis.create({
      data: {
         pasienId: pasien.id,
         dokterId: dokter.id,
         isi: "Pasien mengalami demam dan pusing selama 3 hari.",
         tanggal: new Date(),
      },
   });

   // Create pembayaran
   await prisma.pembayaran.create({
      data: {
         pasienId: pasien.id,
         jumlah: 150000,
         tanggal: new Date(),
         metode: "Cash",
      },
   });

   // Create resep
   await prisma.resep.create({
      data: {
         dokterId: dokter.id,
         obatId: paracetamol.id,
         jumlah: 10,
         aturan: "3x1 sesudah makan",
      },
   });

   // Create laporan
   await prisma.laporan.create({
      data: {
         dokterId: dokter.id,
         jenis: "Kunjungan Harian",
         konten: "5 pasien diperiksa, 3 influenza, 2 batuk pilek",
         tanggal: new Date(),
      },
   });

   // Create antrian
   await prisma.antrian.create({
      data: {
         pendaftaranId: pendaftaran.id,
         nomorUrut: 1,
         status: "MENUNGGU",
         waktuMasuk: new Date(),
      },
   });

   console.log("Seeding selesai.");
}

main()
   .catch((e) => {
      console.error("Error seeding database:", e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
