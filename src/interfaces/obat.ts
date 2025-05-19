import { Resep } from "./resep";

export interface Obat {
  id: number;
  nama: string;
  stok: number;
  satuan: string;
  resep: Resep[];
}