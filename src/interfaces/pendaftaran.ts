import { Pasien } from "./pasien";

export interface Pendaftaran {
  id: number;
  pasienId: number;
  tanggal: string;
  pasien: Pasien;
}