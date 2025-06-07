export const getDaftarPasien = async () => {
   try {
      const res = await fetch("/api/dokter/daftar-pasien", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch daftar pasien: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data.data;
   } catch (error) {
      console.error("Error saat mengambil data daftar pasien:", error);
      throw error;
   }
};
