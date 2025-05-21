export const getAllPemeriksaan = async () => {
   try {
      const res = await fetch("/api/pemeriksaan", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch pemeriksaan: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat mengambil data pemeriksaan:", error);
      throw error;
   }
};
