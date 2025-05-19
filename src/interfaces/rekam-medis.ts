import { Dokter } from "./dokter";
import { Pasien } from "./pasien";

export interface RekamMedis {
  id: number;
  pasienId: number;
  dokterId: number;
  isi: string;
  tanggal: string;
  pasien: Pasien;
  dokter: Dokter;
}