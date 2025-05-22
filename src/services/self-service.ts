export const getPasienSelf = async () => {
   try {
      const res = await fetch("/api/pasien/self", {
         cache: "no-store",
      });

      if (!res.ok) {
         throw new Error(
            `Gagal fetch pasien self: ${res.status} ${res.statusText}`
         );
      }

      const data = await res.json();
      return data;
   } catch (error) {
      console.error("Error saat mengambil data pasien self:", error);
      throw error;
   }
};
