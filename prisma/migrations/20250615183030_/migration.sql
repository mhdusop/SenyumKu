-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PASIEN', 'DOKTER', 'ADMINISTRASI', 'PENGELOLA_OBAT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('MENUNGGU', 'DIPERIKSA', 'SELESAI', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pasien" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "noTelp" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pasien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StafAdministrasi" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StafAdministrasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dokter" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "spesialisasi" TEXT,
    "noTelp" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Dokter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StafPengelolaObat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StafPengelolaObat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "stok" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,

    CONSTRAINT "Obat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pendaftaran" (
    "id" SERIAL NOT NULL,
    "pasienId" INTEGER NOT NULL,
    "tanggalDaftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keluhan" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'MENUNGGU',

    CONSTRAINT "Pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemeriksaan" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "pasienId" INTEGER NOT NULL,
    "dokterId" INTEGER NOT NULL,
    "keluhan" TEXT NOT NULL,
    "diagnosa" TEXT NOT NULL,
    "catatanTambahan" TEXT,

    CONSTRAINT "Pemeriksaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RekamMedis" (
    "id" SERIAL NOT NULL,
    "pasienId" INTEGER NOT NULL,
    "dokterId" INTEGER NOT NULL,
    "pemeriksaanId" INTEGER,
    "isi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RekamMedis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" SERIAL NOT NULL,
    "pasienId" INTEGER NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "metode" TEXT NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resep" (
    "id" SERIAL NOT NULL,
    "dokterId" INTEGER NOT NULL,
    "obatId" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "aturan" TEXT NOT NULL,
    "rekamMedisId" INTEGER,

    CONSTRAINT "Resep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" SERIAL NOT NULL,
    "dokterId" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Antrian" (
    "id" SERIAL NOT NULL,
    "pendaftaranId" INTEGER NOT NULL,
    "nomorUrut" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'MENUNGGU',
    "waktuMasuk" TIMESTAMP(3),
    "waktuSelesai" TIMESTAMP(3),

    CONSTRAINT "Antrian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_userId_key" ON "Pasien"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StafAdministrasi_userId_key" ON "StafAdministrasi"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Dokter_userId_key" ON "Dokter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StafPengelolaObat_userId_key" ON "StafPengelolaObat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RekamMedis_pemeriksaanId_key" ON "RekamMedis"("pemeriksaanId");

-- CreateIndex
CREATE UNIQUE INDEX "Antrian_pendaftaranId_key" ON "Antrian"("pendaftaranId");

-- AddForeignKey
ALTER TABLE "Pasien" ADD CONSTRAINT "Pasien_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StafAdministrasi" ADD CONSTRAINT "StafAdministrasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StafPengelolaObat" ADD CONSTRAINT "StafPengelolaObat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pendaftaran" ADD CONSTRAINT "Pendaftaran_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "Pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemeriksaan" ADD CONSTRAINT "Pemeriksaan_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "Pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemeriksaan" ADD CONSTRAINT "Pemeriksaan_dokterId_fkey" FOREIGN KEY ("dokterId") REFERENCES "Dokter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "Pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_dokterId_fkey" FOREIGN KEY ("dokterId") REFERENCES "Dokter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_pemeriksaanId_fkey" FOREIGN KEY ("pemeriksaanId") REFERENCES "Pemeriksaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "Pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resep" ADD CONSTRAINT "Resep_dokterId_fkey" FOREIGN KEY ("dokterId") REFERENCES "Dokter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resep" ADD CONSTRAINT "Resep_obatId_fkey" FOREIGN KEY ("obatId") REFERENCES "Obat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resep" ADD CONSTRAINT "Resep_rekamMedisId_fkey" FOREIGN KEY ("rekamMedisId") REFERENCES "RekamMedis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_dokterId_fkey" FOREIGN KEY ("dokterId") REFERENCES "Dokter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antrian" ADD CONSTRAINT "Antrian_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
