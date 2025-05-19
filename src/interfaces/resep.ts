import { Dokter } from "./dokter";
import { Obat } from "./obat";

export interface Resep {
  id: number;
  dokterId: number;
  obatId: number;
  jumlah: number;
  aturan: string;
  dokter: Dokter;
  obat: Obat;
}