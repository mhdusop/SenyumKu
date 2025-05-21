import { Pasien } from "./pasien";

export interface Pembayaran {
   id: number;
   pasienId: number;
   jumlah: number;
   tanggal: string;
   metode: string;
   pasien: Pasien;
}
