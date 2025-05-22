import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash("password", saltRounds);

   // Create users
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

   const dokterUser = await prisma.user.create({
      data: {
         username: "dokter",
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
      include: { dokter: true },
   });

   const pasienUser = await prisma.user.create({
      data: {
         username: "pasien",
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
      include: { pasien: true },
   });

   await prisma.user.create({
      data: {
         username: "farmasi",
         password: hashedPassword,
         role: "PENGELOLA_OBAT",
         staffPengelolaObat: {
            create: {
               nama: "Petugas Obat",
            },
         },
      },
   });

   const dokter = dokterUser.dokter!;
   const pasien = pasienUser.pasien!;

   // Create Obat
   const paracetamol = await prisma.obat.create({
      data: {
         nama: "Paracetamol",
         stok: 100,
         satuan: "tablet",
      },
   });

   // Create Pendaftaran
   const pendaftaran = await prisma.pendaftaran.create({
      data: {
         pasienId: pasien.id,
         keluhan: "Demam dan pusing",
      },
   });

   // Create Antrian
   await prisma.antrian.create({
      data: {
         pendaftaranId: pendaftaran.id,
         nomorUrut: 1,
         status: "MENUNGGU",
         waktuMasuk: new Date(),
      },
   });

   // Create Pemeriksaan
   const pemeriksaan = await prisma.pemeriksaan.create({
      data: {
         tanggal: new Date(),
         pasienId: pasien.id,
         dokterId: dokter.id,
         keluhan: "Demam tinggi",
         diagnosa: "Influenza",
         catatanTambahan: "Istirahat dan banyak minum air",
      },
   });

   // Create Rekam Medis
   const rekamMedis = await prisma.rekamMedis.create({
      data: {
         pasienId: pasien.id,
         dokterId: dokter.id,
         pemeriksaanId: pemeriksaan.id,
         isi: "Pasien mengalami demam dan pusing selama 3 hari.",
         tanggal: new Date(),
      },
   });

   // Create Resep terkait (optional relasi ke rekamMedis)
   await prisma.resep.create({
      data: {
         dokterId: dokter.id,
         obatId: paracetamol.id,
         jumlah: 10,
         aturan: "3x1 sesudah makan",
         rekamMedisId: rekamMedis.id, // hanya jika kamu pakai relasi ini di model!
      },
   });

   // Create Pembayaran
   await prisma.pembayaran.create({
      data: {
         pasienId: pasien.id,
         jumlah: 150000,
         tanggal: new Date(),
         metode: "Cash",
      },
   });

   // Create Laporan Dokter
   await prisma.laporan.create({
      data: {
         dokterId: dokter.id,
         jenis: "Kunjungan Harian",
         konten: "5 pasien diperiksa, 3 influenza, 2 batuk pilek",
         tanggal: new Date(),
      },
   });

   console.log("✅ Seeding selesai.");
}

main()
   .catch((e) => {
      console.error("Error seeding database:", e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
