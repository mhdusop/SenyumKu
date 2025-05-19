import { Dokter } from "./dokter";

export interface Laporan {
  id: number;
  dokterId: number;
  jenis: string;
  konten: string;
  tanggal: string;
  dokter: Dokter;
}