export const getAllPasien = async () => {
   try {
      const res = await fetch("/api/pasien", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(`Gagal fetch pasien: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat mengambil data pasien:", error);
      throw error;
   }
};
