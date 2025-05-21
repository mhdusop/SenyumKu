import { Dokter } from "./dokter";
import { Pasien } from "./pasien";

export interface Pemeriksaan {
   id: number;
   tanggal: string;
   pasienId: number;
   dokterId: number;
   keluhan: string;
   diagnosa: string;
   catatanTambahan: string;
   pasien: Pasien;
   dokter: Dokter;
}
