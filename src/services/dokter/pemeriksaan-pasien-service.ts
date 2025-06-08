export const getPemeriksaanPasien = async () => {
   try {
      const res = await fetch("/api/dokter/pemeriksaan-pasien", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch pemeriksaan pasien: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.data;
   } catch (error) {
      console.error("Error saat mengambil data pemeriksaan pasien:", error);
      throw error;
   }
};

export const createPemeriksaanPasien = async (pemeriksaanData: {
   tanggal: string;
   pasienId: number;
   keluhan: string;
   diagnosa: string;
   catatanTambahan?: string;
}) => {
   try {
      const res = await fetch("/api/dokter/pemeriksaan-pasien", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(pemeriksaanData),
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal membuat pemeriksaan pasien: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.data;
   } catch (error) {
      console.error("Error saat membuat pemeriksaan pasien:", error);
      throw error;
   }
};

export const updatePemeriksaanPasien = async (pemeriksaanData: {
   id: number;
   keluhan: string;
   diagnosa: string;
   catatanTambahan?: string;
}) => {
   try {
      const res = await fetch("/api/dokter/pemeriksaan-pasien", {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(pemeriksaanData),
      });

      if (!res.ok) {
         throw new Error(
            `Gagal memperbarui pemeriksaan pasien: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.data;
   } catch (error) {
      console.error("Error saat memperbarui pemeriksaan pasien:", error);
      throw error;
   }
};

export const deletePemeriksaanPasien = async (id: number) => {
   try {
      const res = await fetch(`/api/dokter/pemeriksaan-pasien?id=${id}`, {
         method: "DELETE",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal menghapus pemeriksaan pasien: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.message;
   } catch (error) {
      console.error("Error saat menghapus pemeriksaan pasien:", error);
      throw error;
   }
};
