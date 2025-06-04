export const getAllRekamMedis = async () => {
   try {
      const res = await fetch("/api/admin/rekam-medis", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch rekam medis: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat mengambil data rekam medis:", error);
      throw error;
   }
};
