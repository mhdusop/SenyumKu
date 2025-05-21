import { User } from "./user";
import { Pemeriksaan } from "./pemeriksaan";
import { RekamMedis } from "./rekam-medis";
import { Pendaftaran } from "./pendaftaran";
import { Pembayaran } from "./pembayaran";

export interface Pasien {
   id: number;
   nama: string;
   alamat?: string;
   noTelp?: string;
   userId: number;
   user: User;
   pendaftaran: Pendaftaran[];
   rekamMedis: RekamMedis[];
   pembayaran: Pembayaran[];
   pemeriksaan: Pemeriksaan[];
}
