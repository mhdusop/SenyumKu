export const getAllDokter = async () => {
   try {
      const res = await fetch("/api/dokter", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(`Gagal fetch dokter: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat mengambil data dokter:", error);
      throw error;
   }
};
