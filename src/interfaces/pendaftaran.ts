import { Antrian } from "./antrian";
import { Pasien } from "./pasien";

export interface Pendaftaran {
   id: number;
   pasienId: number;
   tanggalDaftar: string;
   keluhan: string;
   status: string;
   pasien: Pasien;
   antrian?: Antrian | null;
}
