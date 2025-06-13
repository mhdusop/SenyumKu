import { Resep } from "./resep";
import { Dokter } from "./dokter";
import { Pasien } from "./pasien";
import { Pemeriksaan } from "./pemeriksaan";

export interface RekamMedis {
   id: number;
   pasienId: number;
   dokterId: number;
   pemeriksaanId: number;
   isi: string;
   tanggal: string;
   pasien: Pasien;
   dokter: Dokter;
   pemeriksaan?: Pemeriksaan;
   resep?: Resep[];
}
