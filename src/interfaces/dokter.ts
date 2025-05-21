import { Laporan } from "./laporan";
import { Pemeriksaan } from "./pemeriksaan";
import { RekamMedis } from "./rekam-medis";
import { Resep } from "./resep";
import { User } from "./user";

export interface Dokter {
   id: number;
   nama: string;
   spesialisasi?: string;
   noTelp: string;
   userId: number;
   user: User;
   resep: Resep[];
   rekamMedis: RekamMedis[];
   laporan: Laporan[];
   pemeriksaan: Pemeriksaan[];
}
