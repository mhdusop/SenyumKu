import { Dokter } from "./dokter";
import { Pasien } from "./pasien";
import { Role } from "./role";
import { StafAdministrasi } from "./staff-administrasi";
import { StafPengelolaObat } from "./staff-pengelola-obat";

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  pasien?: Pasien;
  dokter?: Dokter;
  staffAdministrasi?: StafAdministrasi;
  staffPengelolaObat?: StafPengelolaObat;
}